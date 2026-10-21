// Server-only search index builder (uses fs to read guide markdown).
// Served to the client as JSON by app/api/search-index/route.ts.
import { CourseInfoData } from "@/data/CourseInfoData"
import { CoreCoursesData } from "@/data/CoreCoursesData"
import { getMDFrontMatter } from "@/utils/frontmatter-parser"
import { SearchIndex, SearchResult } from "@/utils/search"
import { promises as fs } from "fs"
import path from "path"

export type { SearchIndex, SearchResult }

/**
 * Extract the first 150 characters of meaningful text from markdown content
 * Skips frontmatter and empty lines
 */
const extractDescription = (markdown: string): string => {
  // Find the end of frontmatter
  const endOfFrontmatter = markdown.indexOf("---", 3)
  const content = markdown.substring(endOfFrontmatter + 3)

  // Remove markdown syntax and extract first paragraph
  const lines = content
    .split("\n")
    .filter(
      (line) => line.trim() && !line.startsWith("#") && !line.startsWith(">")
    )
    .join(" ")

  // Remove markdown formatting
  const cleaned = lines
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Links
    .replace(/\*\*([^\*]+)\*\*/g, "$1") // Bold
    .replace(/\*([^\*]+)\*/g, "$1") // Italic
    .replace(/`([^`]+)`/g, "$1") // Code

  return cleaned.substring(0, 150) + (cleaned.length > 150 ? "..." : "")
}

/**
 * Get all guide files recursively from /data/guides
 */
const getGuideFiles = async (
  dirPath: string,
  arrayOfFiles: string[] = []
): Promise<string[]> => {
  try {
    const files = await fs.readdir(dirPath)

    for (const file of files) {
      const filePath = path.join(dirPath, file)
      const stat = await fs.stat(filePath)

      if (stat.isDirectory()) {
        arrayOfFiles = await getGuideFiles(filePath, arrayOfFiles)
      } else if (file.endsWith(".md") || file.endsWith(".mdx")) {
        // index.md files are real category pages ("Registering for Special
        // Classes", "Academics", ...) and are indexed at the folder URL
        arrayOfFiles.push(filePath)
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
  }

  return arrayOfFiles
}

const titleCase = (s: string) =>
  s.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/-/g, " ")

const SMALL_WORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "in",
  "of",
  "or",
  "the",
  "to",
  "with",
])

/** "ALGORITHMS AND DATA STRUCTURES 1" -> "Algorithms and Data Structures 1" */
const titleCaseCourse = (s: string) =>
  s
    .toLowerCase()
    .replace(/[a-z]+/g, (word, offset) =>
      offset > 0 && SMALL_WORDS.has(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )

// Build search index from courses and guides
export const buildSearchIndex = async (): Promise<SearchIndex> => {
  const results: SearchResult[] = []

  // CoreCoursesData has nicer, properly-cased titles/descriptions for the
  // core classes; merge it into the full course list by course number.
  const coreByNumber = CoreCoursesData

  CourseInfoData.courses.forEach((course) => {
    const courseNumber = parseInt(course.id.replace(/\D/g, ""), 10).toString()
    const core = coreByNumber[courseNumber]
    // Only use core data if it refers to the same course (code matches id)
    const coreMatches =
      core && core.code.replace(/\s/g, "").toUpperCase() === course.id

    results.push({
      id: course.id,
      type: "course",
      title: coreMatches ? core.title : titleCaseCourse(course.title),
      description: (coreMatches
        ? core.description
        : course.description
      ).substring(0, 150),
      href: `/courses/${course.id}`,
      courseId: course.id,
    })
  })

  // Add all guides from markdown files
  try {
    const guidesPath = path.join(process.cwd(), "data/guides")
    const guideFiles = await getGuideFiles(guidesPath)

    for (const filePath of guideFiles) {
      try {
        const fileContent = await fs.readFile(filePath, "utf-8")
        const frontmatter = getMDFrontMatter(fileContent)

        // Extract relative path and convert to URL; a folder's index.md is
        // indexed at the folder's own URL
        const relativePath = filePath
          .replace(process.cwd() + "/data/guides/", "")
          .replace(/\.(md|mdx)$/, "")
          .replace(/(^|\/)index$/, "")
          .replace(/\/$/, "")

        // The top-level index.md is the guides landing page itself; skip it
        if (!relativePath) continue

        const href = `/guides/${relativePath}`
        const id = `guide-${relativePath}`
        const title = frontmatter.title || "Untitled Guide"
        const description = extractDescription(fileContent)
        // Folder and file names carry useful words the body may not repeat
        // (e.g. "registration" in academics/registration/cross-register)
        const pathWords = relativePath.split(/[\/\-_]+/).filter(Boolean)
        const tags = (
          Array.isArray(frontmatter.search_tags)
            ? frontmatter.search_tags.map(String)
            : []
        ).concat(pathWords)
        const category = titleCase(relativePath.split("/")[0] ?? "")

        results.push({
          id,
          type: "guide",
          title,
          description,
          href,
          category,
          tags,
        })
      } catch (error) {
        console.error(`Error parsing guide ${filePath}:`, error)
      }
    }
  } catch (error) {
    console.error("Error loading guides for search index:", error)
  }

  return {
    results,
    buildTime: new Date().toISOString(),
  }
}
