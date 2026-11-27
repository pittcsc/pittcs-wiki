/**
 * Configuration for newly added or recently updated guides
 * Format: "category/guide-slug" (without .md extension)
 *
 * Add guides here to display a ribbon on their cards
 * Remove after 30-60 days or when you want to stop highlighting them
 */

export const newGuides = [
  "career/running-for-officer", // Running for PittCSC Officer - NEW
  "career/working-at-startup", // Working at a Startup - NEW
  "skills/csc-dev-lab/0-what-is-csc-dev-lab", // What is CSC Dev Lab - NEW
  "skills/student-success", // SCI Student Success - NEW
  "zero-to-offer/resume", // Zero to Offer: Resume - NEW
  "zero-to-offer/behavioral-interviews", // Zero to Offer: Behavioral Interviews - NEW
]

export const updatedGuides = [
  "career/general-college-advice", // General College Advice - UPDATED
  "academics/study-abroad", // Study Abroad - UPDATED
  "zero-to-offer/overview", // Zero to Offer: Overview - UPDATED
  "zero-to-offer/mindset", // Zero to Offer: Mindset - UPDATED
  "zero-to-offer/building-your-case", // Zero to Offer: Building Your Case - UPDATED
  "zero-to-offer/technical-interviews", // Zero to Offer: Technical Interviews - UPDATED
  "zero-to-offer/post-interview", // Zero to Offer: Post-Interview - UPDATED
]

/**
 * Check if a guide is marked as new
 * @param categorySlug - The category slug (e.g., "career")
 * @param guideSlug - The guide slug (e.g., "running-for-officer")
 * @returns "new", "updated", or null
 */
export const getGuideStatus = (
  categorySlug: string,
  guideSlug: string
): "new" | "updated" | null => {
  const fullSlug = `${categorySlug}/${guideSlug}`
  if (newGuides.includes(fullSlug)) return "new"
  if (updatedGuides.includes(fullSlug)) return "updated"
  return null
}
