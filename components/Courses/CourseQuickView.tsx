import { TermOfferingType, TermsOfferedType } from "@/types/CoursesDataType"
import CourseQuickViewContent from "./CourseQuickViewContent"

export type CourseQuickViewProps = {
  id: string
  description?: string
  title?: string
  terms_offered?: TermsOfferedType
  typically_offered?: string
  term_offerings?: TermOfferingType[]
  instructors?: string[]
  children: React.ReactNode
}

const CourseQuickView = ({
  id,
  description,
  title,
  terms_offered,
  typically_offered,
  term_offerings,
  instructors,
  children,
}: CourseQuickViewProps) => {
  return id ? (
    <CourseQuickViewContent
      {...{
        id,
        description,
        title,
        terms_offered,
        typically_offered,
        term_offerings,
        instructors,
      }}
    />
  ) : (
    <div>{children}</div>
  )
}

export default CourseQuickView
