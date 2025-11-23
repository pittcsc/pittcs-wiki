import { CourseInfoData } from "@/data/CourseInfoData"
import { CoreCoursesData } from "@/data/CoreCoursesData"

export type SearchResult = {
  id: string
  type: "course" | "guide"
  title: string
  description: string
  href: string
  relevance: number
  searchableText: string
}

export type SearchIndex = {
  results: SearchResult[]
  buildTime: string
}

// Build search index from courses and guides
export const buildSearchIndex = (): SearchIndex => {
  const results: SearchResult[] = []

  // Add all courses from CourseInfoData
  CourseInfoData.courses.forEach((course) => {
    const searchableText = `${course.title} ${course.id} ${course.description}`.toLowerCase()
    results.push({
      id: course.id,
      type: "course",
      title: course.title,
      description: course.description.substring(0, 150),
      href: `/courses/${course.id}`,
      relevance: 0,
      searchableText,
    })
  })

  // Add all courses from CoreCoursesData
  Object.values(CoreCoursesData).forEach((course) => {
    const searchableText = `${course.title} ${course.code} ${course.id} ${course.description}`.toLowerCase()
    results.push({
      id: course.id,
      type: "course",
      title: `${course.code} - ${course.title}`,
      description: course.description.substring(0, 150),
      href: `/courses/${course.id}`,
      relevance: 0,
      searchableText,
    })
  })

  return {
    results,
    buildTime: new Date().toISOString(),
  }
}

// Fuzzy search helper - simple substring matching with scoring
export const fuzzySearch = (
  query: string,
  searchText: string
): number => {
  const q = query.toLowerCase()
  const text = searchText.toLowerCase()

  if (text.includes(q)) {
    // Exact substring match - highest priority
    if (text.startsWith(q)) return 3
    return 2
  }

  // Check if all characters of query exist in order
  let queryIndex = 0
  for (let i = 0; i < text.length && queryIndex < q.length; i++) {
    if (text[i] === q[queryIndex]) {
      queryIndex++
    }
  }

  if (queryIndex === q.length) {
    return 1
  }

  return 0
}

// Search the index
export const searchIndex = (query: string, index: SearchIndex): SearchResult[] => {
  if (!query.trim()) return []

  const scored = index.results
    .map((result) => ({
      ...result,
      relevance: fuzzySearch(query, result.searchableText),
    }))
    .filter((result) => result.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)

  return scored.slice(0, 10) // Return top 10 results
}
