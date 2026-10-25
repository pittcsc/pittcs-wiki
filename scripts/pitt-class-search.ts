/**
 * Client for Pitt's class-search API (PeopleSoft/HighPoint, same backend
 * pittcsc/PittAPI uses). Unlike courses.sci.pitt.edu, it lists upcoming
 * terms as soon as the registrar publishes them, so it can answer "is this
 * course offered next semester?" before enrollment.
 */

const PS_BASE = "https://pitcsprd.csps.pitt.edu/psc/pitcsprd/EMPLOYEE/SA/s/"

const SUBJECT_COURSES_API = (subject: string) =>
  `${PS_BASE}WEBLIB_HCX_CM.H_COURSE_CATALOG.FieldFormula.IScript_SubjectCourses?institution=UPITT&subject=${subject}`

const BROWSE_SECTIONS_API = (crseId: string, offerNbr: string, term: string) =>
  `${PS_BASE}WEBLIB_HCX_CM.H_BROWSE_CLASSES.FieldFormula.IScript_BrowseSections?institution=UPITT&campus=&location=&course_id=${crseId}&institution=UPITT&term=${term}&crse_offer_nbr=${offerNbr}`

export type TermInfo = {
  /** Pitt term code: "2" + academic-year ending + {1 fall, 4 spring, 7 summer} */
  term: string
  /** e.g. "Spring 2027" */
  name: string
}

export type CatalogEntry = {
  /** Wiki-style id, e.g. "CS0445" */
  id: string
  /** PeopleSoft course id, e.g. "105695" */
  crseId: string
  offerNbr: string
  /** e.g. "FALLSPRSUM" */
  typOffr: string
  /** e.g. "Fall, Spring, Summer" */
  typOffrDescr: string
}

// The API 302-redirects once to set a session cookie, so requests go through
// a minimal cookie-jar fetch.
const cookies = new Map<string, string>()

const cookieHeader = () =>
  Array.from(cookies.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join("; ")

const storeCookies = (response: Response) => {
  for (const setCookie of response.headers.getSetCookie?.() ?? []) {
    const [pair] = setCookie.split(";")
    const eq = pair.indexOf("=")
    if (eq > 0) cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1))
  }
}

async function fetchJson(url: string): Promise<any> {
  let currentUrl = url
  for (let hop = 0; hop < 5; hop++) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers: {
        "User-Agent": "pittcswiki (github.com/pittcsc/pittcs-wiki)",
        ...(cookies.size > 0 ? { Cookie: cookieHeader() } : {}),
      },
    })
    storeCookies(response)

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location")
      if (!location) throw new Error(`Redirect without location from ${url}`)
      currentUrl = new URL(location, currentUrl).toString()
      continue
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} from ${url}`)
    }
    return response.json()
  }
  throw new Error(`Too many redirects for ${url}`)
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

type Season = "FALL" | "SPRING" | "SUMMER"

const termFor = (season: Season, year: number): TermInfo => {
  // Fall 2026 belongs to academic year 2027 -> "2271"
  const ayEnding = season === "FALL" ? year + 1 : year
  const seasonDigit = { FALL: "1", SPRING: "4", SUMMER: "7" }[season]
  return {
    term: `2${String(ayEnding % 100).padStart(2, "0")}${seasonDigit}`,
    name: `${season.charAt(0) + season.slice(1).toLowerCase()} ${year}`,
  }
}

const nextSeason = (season: Season, year: number): [Season, number] => {
  if (season === "SPRING") return ["SUMMER", year]
  if (season === "SUMMER") return ["FALL", year]
  return ["SPRING", year + 1]
}

/** The in-session term plus the next two (the enrollable horizon). */
export const upcomingTerms = (now = new Date()): TermInfo[] => {
  const month = now.getMonth()
  let season: Season = "FALL"
  if (month <= 3) season = "SPRING"
  else if (month <= 7) season = "SUMMER"
  let year = now.getFullYear()

  const terms: TermInfo[] = []
  for (let i = 0; i < 3; i++) {
    terms.push(termFor(season, year))
    ;[season, year] = nextSeason(season, year)
  }
  return terms
}

/**
 * Course catalog for the given subjects, keyed by wiki-style id ("CS0445").
 * Duplicate rows (multiple offer numbers) collapse to the one carrying a
 * typically-offered value.
 */
export async function fetchCatalog(
  subjects: string[]
): Promise<Map<string, CatalogEntry>> {
  const catalog = new Map<string, CatalogEntry>()

  for (const subject of subjects) {
    const data = await fetchJson(SUBJECT_COURSES_API(subject))
    for (const course of data?.courses ?? []) {
      const id = `${subject}${course.catalog_nbr}`
      const entry: CatalogEntry = {
        id,
        crseId: course.crse_id,
        offerNbr: course.crse_offer_nbr ?? "1",
        typOffr: course.typ_offr ?? "",
        typOffrDescr: course.typ_offr_descr ?? "",
      }
      const existing = catalog.get(id)
      if (!existing || (!existing.typOffr && entry.typOffr)) {
        catalog.set(id, entry)
      }
    }
    await sleep(150)
  }

  return catalog
}

const sectionCountCache = new Map<string, number>()

/**
 * Number of sections a course has in a term, or null if the request failed
 * (callers must treat null as "unknown", never as 0).
 */
export async function fetchSectionCount(
  entry: CatalogEntry,
  term: string
): Promise<number | null> {
  const cacheKey = `${entry.crseId}:${term}`
  const cached = sectionCountCache.get(cacheKey)
  if (cached !== undefined) return cached

  try {
    const data = await fetchJson(
      BROWSE_SECTIONS_API(entry.crseId, entry.offerNbr, term)
    )
    const count = Array.isArray(data?.sections) ? data.sections.length : 0
    sectionCountCache.set(cacheKey, count)
    return count
  } catch (error) {
    console.error(`Section lookup failed for ${entry.id} term ${term}:`, error)
    return null
  }
}

/**
 * Staple courses that run every published term; if fewer than two of them
 * have sections, the registrar hasn't published that term's schedule yet
 * (so per-course zeros would be meaningless).
 */
const STAPLE_COURSE_IDS = ["CS0007", "CS0441", "CS0445", "CS1501", "CMPINF0401"]

export async function isTermPublished(
  term: string,
  catalog: Map<string, CatalogEntry>
): Promise<boolean> {
  let staplesOffered = 0
  for (const stapleId of STAPLE_COURSE_IDS) {
    const entry = catalog.get(stapleId)
    if (!entry) continue
    const count = await fetchSectionCount(entry, term)
    if (count !== null && count > 0) staplesOffered++
    await sleep(75)
  }
  return staplesOffered >= 2
}
