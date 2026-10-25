export type TermsOfferedType = {
  SPRING: boolean
  FALL: boolean
  SUMMER: boolean
}

/**
 * A term whose schedule Pitt has published. 0 sections = genuinely not
 * offered that term; unpublished terms are omitted entirely.
 */
export type TermOfferingType = {
  /** Pitt term code, e.g. "2274" = Spring 2027 */
  term: string
  /** e.g. "Spring 2027" */
  name: string
  sections: number
}

export type CoursesDataType = {
  sci_href: string
  title: string
  id: string
  credits: number
  description: string
  requirements: string
  replaces?: string
  /** Terms this course is typically offered in (from Pitt's catalog) */
  terms_offered: TermsOfferedType
  /** Display text from Pitt's catalog, e.g. "Fall, Spring, Summer" */
  typically_offered?: string
  /** Live per-term section counts for published schedules */
  term_offerings?: TermOfferingType[]
  instructors?: string[]
}
