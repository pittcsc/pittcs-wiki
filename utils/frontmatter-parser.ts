import matter from "gray-matter"

export type MDFrontMatterType = {
  title: string
  guides_blurb: string
  href: string
  search_tags: string[]
  related: string[]
  author: string
  order?: number
}

export const getMDFrontMatter = (md: string) => {
  const { data } = matter(md)

  const searchTags = Array.isArray(data.search_tags)
    ? data.search_tags.map(String)
    : typeof data.search_tags === "string" && data.search_tags.trim()
      ? [data.search_tags.trim()]
      : []

  const related = Array.isArray(data.related)
    ? data.related.map(String)
    : []

  const author = typeof data.author === "string" ? data.author : ""

  return {
    title: data.title || "",
    guides_blurb: data.guides_blurb || "",
    href: "",
    search_tags: searchTags,
    related,
    author,
    order: data.order,
  } as MDFrontMatterType
}
