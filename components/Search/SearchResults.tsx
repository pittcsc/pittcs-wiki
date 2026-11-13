"use client"

import Link from "next/link"
import { SearchResult } from "@/utils/search"
import { BookOpen, Code, CornerDownLeft } from "lucide-react"

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  query: string
  activeIndex: number
  onResultClick?: () => void
  onHover?: (index: number) => void
  /** "dropdown" (navbar) is compact with no footer; "palette" (⌘K) is roomier */
  variant?: "dropdown" | "palette"
}

/** Underline the parts of `text` that match any query token. */
function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1)
  if (tokens.length === 0) return <>{text}</>

  const pattern = tokens
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")
  const parts = text.split(new RegExp(`(${pattern})`, "gi"))

  return (
    <>
      {parts.map((part, i) =>
        tokens.includes(part.toLowerCase()) ? (
          <mark
            key={i}
            className="bg-transparent font-bold text-inherit underline decoration-[#ffb81c] decoration-2 underline-offset-2"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

/** "CS0445" -> "CS 0445" for display */
const prettyCourseId = (id: string) => id.replace(/^([A-Z]+)(\d+)$/, "$1 $2")

export default function SearchResults({
  results,
  isLoading,
  query,
  activeIndex,
  onResultClick,
  onHover,
  variant = "palette",
}: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <div className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
        Search for a course code, a guide, or a topic — try &ldquo;CS
        0445&rdquo; or &ldquo;internship&rdquo;
      </div>
    )
  }

  return (
    <>
      {isLoading && (
        <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Searching…
        </div>
      )}

      {!isLoading && results.length === 0 && (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            Try a course code (e.g. &ldquo;CS 0445&rdquo;) or a topic like
            &ldquo;internship&rdquo;
          </p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <>
          <ul
            role="listbox"
            id="search-results-list"
            aria-label="Search results"
            className={`m-0 list-none overflow-y-auto overscroll-contain p-1.5 ${
              variant === "palette" ? "max-h-[55vh]" : "max-h-[65vh]"
            }`}
          >
            {results.map((result, index) => (
              <SearchResultItem
                key={result.id}
                result={result}
                query={query}
                isActive={index === activeIndex}
                onClick={onResultClick}
                onHover={() => onHover?.(index)}
              />
            ))}
          </ul>
          {variant === "palette" && (
            <div className="flex items-center justify-end gap-4 border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-400 dark:border-slate-700/60 dark:bg-black/20 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-slate-200 bg-white px-1 font-sans dark:border-slate-600 dark:bg-white/5">
                  ↑
                </kbd>
                <kbd className="rounded border border-slate-200 bg-white px-1 font-sans dark:border-slate-600 dark:bg-white/5">
                  ↓
                </kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-slate-200 bg-white px-1 font-sans dark:border-slate-600 dark:bg-white/5">
                  ↵
                </kbd>
                open
              </span>
            </div>
          )}
        </>
      )}
    </>
  )
}

function SearchResultItem({
  result,
  query,
  isActive,
  onClick,
  onHover,
}: {
  result: SearchResult
  query: string
  isActive: boolean
  onClick?: () => void
  onHover?: () => void
}) {
  const isCourse = result.type === "course"
  const Icon = isCourse ? Code : BookOpen

  return (
    <li
      role="option"
      aria-selected={isActive}
      id={`search-result-${result.id}`}
    >
      <Link
        href={result.href}
        onClick={onClick}
        onMouseMove={onHover}
        className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors duration-100 ${
          isActive ? "bg-slate-100 dark:bg-white/10" : ""
        }`}
      >
        <div
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${
            isActive
              ? "bg-[#ffb81c]/20 text-[#8a5a00] dark:text-[#ffb81c]"
              : "bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-slate-500"
          }`}
        >
          <Icon size={14} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            {isCourse && result.courseId && (
              <span className="flex-shrink-0 rounded bg-slate-100 px-1 py-px font-mono text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                {prettyCourseId(result.courseId)}
              </span>
            )}
            <span className="truncate text-sm font-semibold leading-snug text-slate-900 dark:text-white">
              <Highlight text={result.title} query={query} />
            </span>
          </div>
          <p className="mb-0 mt-0.5 truncate text-xs leading-snug text-slate-500 dark:text-slate-400">
            {!isCourse && result.category && (
              <span className="font-medium text-slate-400 dark:text-slate-500">
                {result.category} ·{" "}
              </span>
            )}
            {result.description}
          </p>
        </div>
        <CornerDownLeft
          size={14}
          className={`flex-shrink-0 text-slate-300 dark:text-slate-600 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
      </Link>
    </li>
  )
}
