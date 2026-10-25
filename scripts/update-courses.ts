import * as fs from "fs"
import * as path from "path"
import * as cheerio from "cheerio"
import { CourseInfoData } from "../data/CourseInfoData"
import {
  fetchCatalog,
  fetchSectionCount,
  isTermPublished,
  sleep,
  upcomingTerms,
} from "./pitt-class-search"

// Types matching the existing data structure
type TermsOffered = {
  FALL: boolean
  SPRING: boolean
  SUMMER: boolean
}

type TermOffering = {
  term: string
  name: string
  sections: number
}

type CourseData = {
  sci_href: string
  title: string
  id: string
  credits: number
  description: string
  requirements: string
  terms_offered: TermsOffered
  typically_offered?: string
  term_offerings?: TermOffering[]
  instructors: string[]
}

type CourseInfoDataType = {
  metadata: {
    generated: string
  }
  courses: CourseData[]
}

const BASE_URL = "https://courses.sci.pitt.edu"
const COURSES_URL = `${BASE_URL}/courses`

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  return response.text()
}

async function scrapeCourses() {
  console.log("Fetching course list...")
  const basePageHtml = await fetchPage(BASE_URL)
  const mainPageHtml = await fetchPage(COURSES_URL)
  const $ = cheerio.load(mainPageHtml)

  const currentSemester = (() => {
    const semesterHeader = cheerio.load(basePageHtml)("h1").first().text()

    if (semesterHeader.includes("Fall")) return "FALL"
    if (semesterHeader.includes("Spring")) return "SPRING"
    if (semesterHeader.includes("Summer")) return "SUMMER"
  })()

  const courseLinks: string[] = []

  // Find all course links that start with /courses/view/
  // We filter for CS and CMPINF courses based on the ID in the link or text
  $('a[href^="/courses/view/"]').each((_, element) => {
    const href = $(element).attr("href")
    if (href) {
      // Check if it's a CS or CMPINF course
      if (href.includes("CS-") || href.includes("CMPINF-")) {
        courseLinks.push(href)
      }
    }
  })

  // Deduplicate links
  const uniqueLinks = Array.from(new Set(courseLinks))
  console.log(`Found ${uniqueLinks.length} potential courses.`)

  const courses: CourseData[] = []

  const coursesMap = new Map<string, TermsOffered>()
  for (const course of CourseInfoData.courses)
    coursesMap.set(course.id, course.terms_offered)

  for (const link of uniqueLinks) {
    const fullUrl = `${BASE_URL}${link}`
    console.log(`Scraping ${fullUrl}...`)

    try {
      const detailHtml = await fetchPage(fullUrl)
      const $detail = cheerio.load(detailHtml)

      // Extract ID and Title
      // Find the H1 that contains the course code (e.g. "CS 0401")
      let headerText = ""
      let $header = $detail("h1").first()

      $detail("h1").each((_, el) => {
        const text = $detail(el).text().trim()
        if (text.match(/^[A-Z]+\s+\d+/)) {
          headerText = text
          $header = $detail(el)
          return false // break
        }
      })

      if (!headerText) {
        // Fallback: try to find it in the title tag or just skip
        console.warn(`Could not find course header for ${fullUrl}`)
        continue
      }

      const idMatch = headerText.match(/^([A-Z]+\s+\d+)\s+(.*)/)
      let id = ""
      let title = ""

      if (idMatch) {
        id = idMatch[1].replace(/\s+/g, "") // "CS0401"
        title = idMatch[2]
      } else {
        id = link.split("/").pop()?.replace("-", "") || ""
        title = headerText
      }

      // Extract Description
      let description = ""
      $header.nextAll("p").each((_, el) => {
        const text = $detail(el).text().trim()
        // Skip empty paragraphs or metadata paragraphs
        if (
          text &&
          !text.startsWith("Academic Career") &&
          !text.startsWith("Course Component")
        ) {
          description = text
          return false // break
        }
      })

      // Extract Credits
      const pageText = $detail("body").text()
      const creditsMatch = pageText.match(/Minimum Credits:\s*(\d+)/)
      const credits = creditsMatch ? parseInt(creditsMatch[1], 10) : 3

      // Extract Requirements
      const reqMatch = pageText.match(
        /Course Requirements:\s*([^]*?)(?:Minimum Credits|$)/
      )
      const requirements = reqMatch ? reqMatch[1].trim() : ""

      // Extract Terms Offered
      const termsOffered: TermsOffered = {
        ...(coursesMap.get(id) ?? {
          FALL: false,
          SPRING: false,
          SUMMER: false,
        }),
      }

      const currentSectionsText = $detail('h2:contains("Current Sections")')
        .nextAll()
        .text()
        .toUpperCase()

      if (currentSectionsText.includes("FALL")) termsOffered.FALL = true
      else if (currentSemester == "FALL") termsOffered.FALL = false
      if (currentSectionsText.includes("SPRING")) termsOffered.SPRING = true
      else if (currentSemester == "SPRING") termsOffered.SPRING = false
      if (currentSectionsText.includes("SUMMER")) termsOffered.SUMMER = true
      else if (currentSemester == "SUMMER") termsOffered.SUMMER = false

      // Extract Instructors
      // Look for td elements with headers starting with "instructors-"
      const instructorsSet = new Set<string>()
      $detail('td[headers^="instructors-"]').each((_, el) => {
        const name = $detail(el).text().trim()
        if (name && name !== "To be announced") {
          instructorsSet.add(name)
        }
      })
      const instructors = Array.from(instructorsSet).sort()

      courses.push({
        sci_href: fullUrl,
        title,
        id,
        credits,
        description,
        requirements,
        terms_offered: termsOffered,
        instructors,
      })
    } catch (error) {
      console.error(`Error scraping ${fullUrl}:`, error)
    }
  }

  // Sort courses by ID
  courses.sort((a, b) => a.id.localeCompare(b.id))

  // Layer in real per-term availability from Pitt's class search
  await augmentWithClassSearch(courses)

  const data: CourseInfoDataType = {
    metadata: {
      generated: new Date().toISOString(),
    },
    courses,
  }

  const fileContent = `import { CoursesDataType } from "@/types/CoursesDataType"

export type CourseInfoDataType = {
  metadata: {
    generated: string
  }
  courses: CoursesDataType[]
}

export const CourseInfoData: CourseInfoDataType = ${JSON.stringify(
    data,
    null,
    2
  )}
`

  const outputPath = path.join(process.cwd(), "data", "CourseInfoData.ts")
  fs.writeFileSync(outputPath, fileContent)
  console.log(`Successfully wrote ${courses.length} courses to ${outputPath}`)
}

/**
 * Enrich courses from Pitt's class-search API: terms_offered /
 * typically_offered from the catalog's typ_offr, and term_offerings with
 * real section counts per published term. Any failure falls back to the
 * previous run's data — an API outage must never flip a course to
 * "not offered".
 */
async function augmentWithClassSearch(courses: CourseData[]) {
  const previousCourses = new Map(
    CourseInfoData.courses.map((course) => [course.id, course])
  )

  const keepPreviousData = () => {
    for (const course of courses) {
      const previous = previousCourses.get(course.id)
      if (previous?.typically_offered)
        course.typically_offered = previous.typically_offered
      if (previous?.term_offerings)
        course.term_offerings = previous.term_offerings
    }
  }

  let catalog
  try {
    catalog = await fetchCatalog(["CS", "CMPINF"])
  } catch (error) {
    console.error(
      "Class-search catalog fetch failed; keeping previous term data:",
      error
    )
    keepPreviousData()
    return
  }
  console.log(`Class-search catalog: ${catalog.size} courses`)

  // Only query terms whose schedule the registrar has actually published;
  // for an unpublished term, 0 sections means nothing.
  const publishedTerms = []
  for (const term of upcomingTerms()) {
    if (await isTermPublished(term.term, catalog)) {
      publishedTerms.push(term)
    } else {
      console.log(
        `Term ${term.name} (${term.term}) not published yet; skipping`
      )
    }
  }
  console.log(
    `Published terms: ${publishedTerms.map((t) => t.name).join(", ")}`
  )

  for (const course of courses) {
    const previous = previousCourses.get(course.id)
    const entry = catalog.get(course.id)

    if (!entry) {
      if (previous?.typically_offered)
        course.typically_offered = previous.typically_offered
      if (previous?.term_offerings)
        course.term_offerings = previous.term_offerings
      continue
    }

    if (entry.typOffrDescr) course.typically_offered = entry.typOffrDescr
    if (entry.typOffr) {
      course.terms_offered = {
        FALL: entry.typOffr.includes("FALL"),
        SPRING: entry.typOffr.includes("SPR"),
        SUMMER: entry.typOffr.includes("SUM"),
      }
    }

    const offerings: TermOffering[] = []
    for (const term of publishedTerms) {
      const count = await fetchSectionCount(entry, term.term)
      await sleep(75)
      if (count !== null) {
        offerings.push({ term: term.term, name: term.name, sections: count })
      } else {
        const previousOffering = previous?.term_offerings?.find(
          (offering) => offering.term === term.term
        )
        if (previousOffering) offerings.push(previousOffering)
      }
    }
    if (offerings.length > 0) course.term_offerings = offerings
    else if (previous?.term_offerings)
      course.term_offerings = previous.term_offerings

    console.log(
      `  ${course.id}: ${offerings
        .map((offering) => `${offering.name}=${offering.sections}`)
        .join(" ")}`
    )
  }
}

scrapeCourses().catch(console.error)
