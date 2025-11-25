import { Dispatch, SetStateAction } from "react"
import { CourseListingState } from "./CourseListing"

type ToggleKey = "showTitles" | "isPrereqFilterModeOn" | "showHidden"

type CourseControlsProps = {
  filters: CourseListingState
  setFilters: Dispatch<SetStateAction<CourseListingState>>
}

const CourseControls = ({ filters, setFilters }: CourseControlsProps) => {
  const termOptions = [
    { value: "FALL", label: "Fall" },
    { value: "SPRING", label: "Spring" },
    { value: "SUMMER", label: "Summer" },
  ]

  const handleSetTermOffered = (value: string) => {
    setFilters({ ...filters, termOfferedFilter: value })
  }

  const clearTermFilter = () => {
    setFilters({ ...filters, termOfferedFilter: "OFF" })
  }

  const handleToggle = (name: ToggleKey) => {
    const nextFilters = { ...filters, [name]: !filters[name] }
    if (name === "showHidden" && !filters.showHidden) {
      nextFilters.termOfferedFilter = "OFF"
    }
    setFilters(nextFilters)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value })
  }

  const renderToggle = (label: string, name: ToggleKey) => (
    <button
      type="button"
      className={`toggle-switch ${filters[name] ? "active" : ""}`}
      aria-pressed={filters[name]}
      onClick={() => handleToggle(name)}
    >
      <span className="toggle-indicator" aria-hidden="true" />
      <span className="toggle-label">{label}</span>
    </button>
  )

  return (
    <div className="filter-bar" role="region" aria-label="Course filters">
      <div className="filter-group filter-search">
        <label htmlFor="course-search" className="filter-label">
          Search courses
        </label>
        <input
          id="course-search"
          type="search"
          placeholder="Search courses..."
          value={filters.searchTerm}
          onChange={handleSearchChange}
          className="filter-input"
        />
      </div>
      <div className="filter-group filter-semester">
        <span className="filter-label">Semester:</span>
        <div className="pill-group" role="group" aria-label="Filter by semester">
          {termOptions.map(({ value, label }) => (
            <button
              type="button"
              key={value}
              className={`pill-button ${
                filters.termOfferedFilter === value ? "active" : ""
              }`}
              onClick={() => handleSetTermOffered(value)}
              aria-pressed={filters.termOfferedFilter === value}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className={`pill-button clear ${
              filters.termOfferedFilter === "OFF" ? "active" : ""
            }`}
            onClick={clearTermFilter}
            aria-pressed={filters.termOfferedFilter === "OFF"}
          >
            All
          </button>
        </div>
      </div>
      <div className="filter-group filter-toggles">
        <div className="toggle-section">
          <span className="filter-label">Display:</span>
          <div className="toggle-stack">
            {renderToggle("Course titles", "showTitles")}
          </div>
        </div>
        <div className="toggle-section">
          <span className="filter-label">Options:</span>
          <div className="toggle-stack">
            {renderToggle("Requirements filter", "isPrereqFilterModeOn")}
            {renderToggle("Hidden classes", "showHidden")}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseControls
