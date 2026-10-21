// Client-safe search types and scoring. The index itself is built server-side
// (utils/search-index.ts) and fetched as JSON from /api/search-index.

export type SearchResult = {
  id: string
  type: "course" | "guide"
  title: string
  description: string
  href: string
  /** Course id like "CS0445" (courses only) */
  courseId?: string
  /** Top-level section like "Academics" (guides only) */
  category?: string
  tags?: string[]
  relevance?: number
}

export type SearchIndex = {
  results: SearchResult[]
  buildTime: string
}

const alnum = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "")

const splitWords = (s: string) =>
  s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)

/**
 * Score one result against the query tokens. Every token must match the
 * result somewhere (AND semantics); matches on course ids, titles, and tags
 * far outweigh matches buried in descriptions.
 */
const scoreResult = (
  result: SearchResult,
  tokens: string[],
  queryAlnum: string
): number => {
  const titleLower = result.title.toLowerCase()
  const titleWords = splitWords(result.title)
  const descLower = result.description.toLowerCase()
  const tagWords = (result.tags ?? []).flatMap(splitWords)

  // Course id variants: "CS0445" -> subject "cs", digits "0445", short "445"
  const idAlnum = result.courseId ? alnum(result.courseId) : ""
  const idSubject = idAlnum.replace(/[0-9].*$/, "")
  const idDigits = idAlnum.slice(idSubject.length)
  const idShort = idDigits.replace(/^0+/, "")

  let score = 0

  for (const token of tokens) {
    const t = alnum(token)
    if (!t) continue
    let tokenScore = 0

    if (idAlnum) {
      if (idAlnum === t || idSubject + idShort === t) tokenScore += 8
      else if (idAlnum.startsWith(t) || idSubject === t) tokenScore += 5
      else if (idDigits.startsWith(t) || (idShort && idShort.startsWith(t)))
        tokenScore += 4
    }

    if (titleWords.some((w) => w.startsWith(t))) tokenScore += 4
    else if (titleLower.includes(token)) tokenScore += 2

    if (tagWords.some((w) => w.startsWith(t))) tokenScore += 3

    if (descLower.includes(token)) tokenScore += 1

    // AND semantics: a token that matches nothing disqualifies the result
    if (tokenScore === 0) return 0
    score += tokenScore
  }

  // Whole-query bonuses for phrase and exact-course matches
  const q = tokens.join(" ")
  if (titleLower.startsWith(q)) score += 5
  else if (titleLower.includes(q)) score += 3

  if (idAlnum && queryAlnum) {
    if (queryAlnum === idAlnum || queryAlnum === idSubject + idShort)
      score += 10
  }

  return score
}

export const searchIndex = (
  query: string,
  index: SearchIndex,
  limit = 8
): SearchResult[] => {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) return []

  const tokens = trimmed.split(/\s+/).slice(0, 8)
  const queryAlnum = alnum(trimmed)

  return index.results
    .map((result) => ({
      ...result,
      relevance: scoreResult(result, tokens, queryAlnum),
    }))
    .filter((result) => result.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance || a.title.localeCompare(b.title))
    .slice(0, limit)
}
