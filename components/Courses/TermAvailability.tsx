import { CoursesDataType } from "@/types/CoursesDataType"
import TermPills from "./TermPill"

type TermAvailabilityProps = {
  course: Pick<
    CoursesDataType,
    "terms_offered" | "typically_offered" | "term_offerings"
  >
  /** ISO date of the last course-data scrape */
  generatedAt?: string
}

/**
 * Per-term availability chips (✓/✗ per published term), falling back to the
 * legacy "typically offered" pills when live data is missing.
 */
const TermAvailability = ({ course, generatedAt }: TermAvailabilityProps) => {
  const offerings = course.term_offerings

  if (!offerings || offerings.length === 0) {
    return <TermPills termsMap={course.terms_offered} />
  }

  const asOf = generatedAt
    ? new Date(generatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : undefined

  return (
    <div className="m-0">
      <div className="flex flex-wrap items-center gap-2">
        {offerings.map((offering) => {
          const offered = offering.sections > 0
          return (
            <span
              key={offering.term}
              className={
                "border px-1.5 py-0.5 text-sm " +
                (offered
                  ? "bg-green-400 text-green-800 border-green-500 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/60"
                  : "bg-red-50 text-red-700 border-red-300 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/40")
              }
              title={
                offered
                  ? `${offering.sections} section${
                      offering.sections === 1 ? "" : "s"
                    } scheduled for ${offering.name}`
                  : `No sections scheduled for ${offering.name}`
              }
            >
              {offering.name} {offered ? "✓" : "✗"}
            </span>
          )
        })}
      </div>
      <p className="mb-0 mt-1 text-xs text-slate-500 dark:text-slate-400">
        {course.typically_offered && (
          <>Typically offered: {course.typically_offered}. </>
        )}
        From Pitt&apos;s class search{asOf && <> as of {asOf}</>}. Confirm in
        PeopleSoft when enrolling.
      </p>
    </div>
  )
}

export default TermAvailability
