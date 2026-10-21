"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { createPortal } from "react-dom"
import { useRouter } from "next/navigation"
import { useSearch } from "@/hooks/useSearch"
import SearchResults from "./SearchResults"

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
)

const Search = () => {
  const { query, results, isLoading, setQuery, clearSearch } = useSearch()
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [shortcutLabel, setShortcutLabel] = useState("⌘K")
  const containerRef = useRef<HTMLDivElement>(null)
  const inlineInputRef = useRef<HTMLInputElement>(null)
  const paletteInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) {
      setShortcutLabel("Ctrl K")
    }
  }, [])

  const closeAll = useCallback(() => {
    setIsPaletteOpen(false)
    setIsDropdownOpen(false)
    setActiveIndex(-1)
    clearSearch()
  }, [clearSearch])

  // Global ⌘K / Ctrl+K opens the palette (toggles it when already open)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setIsDropdownOpen(false)
        setActiveIndex(-1)
        setIsPaletteOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", handleGlobalKey)
    return () => document.removeEventListener("keydown", handleGlobalKey)
  }, [])

  // Close the inline dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus the palette input and lock body scroll while the palette is open
  useEffect(() => {
    if (!isPaletteOpen) return
    // Select any carried-over query so typing replaces it
    paletteInputRef.current?.select()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isPaletteOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    setActiveIndex(-1)
    if (!isPaletteOpen) {
      setIsDropdownOpen(!!e.target.value)
    }
  }

  const handleResultClick = () => {
    closeAll()
  }

  const handleClear = () => {
    clearSearch()
    setIsDropdownOpen(false)
    setActiveIndex(-1)
    inlineInputRef.current?.focus()
  }

  // Shared keyboard handling for both the inline input and the palette input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault()
      if (isPaletteOpen) {
        closeAll()
      } else {
        setIsDropdownOpen(false)
        inlineInputRef.current?.blur()
      }
      return
    }

    if (results.length === 0) return
    if (!isPaletteOpen && !isDropdownOpen) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % results.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const target = results[activeIndex] ?? results[0]
      if (target) {
        router.push(target.href)
        closeAll()
        inlineInputRef.current?.blur()
      }
    }
  }

  const activeResult = activeIndex >= 0 ? results[activeIndex] : undefined
  const activeDescendant = activeResult
    ? `search-result-${activeResult.id}`
    : undefined

  return (
    <div
      ref={containerRef}
      className="search-container relative"
      role="search"
      aria-label="Site search"
    >
      {/* Inline navbar search */}
      <div
        className="relative flex h-10 items-center"
        role="combobox"
        aria-haspopup="listbox"
        aria-owns="search-results-list"
        aria-controls="search-results-list"
        aria-expanded={isDropdownOpen}
      >
        <label
          htmlFor="search-bar"
          className="pointer-events-none absolute left-3 z-10 text-black/60 dark:text-white/70"
          aria-hidden="true"
        >
          <SearchIcon className="h-[18px] w-[18px]" />
        </label>
        <input
          ref={inlineInputRef}
          id="search-bar"
          type="text"
          inputMode="search"
          placeholder="Search..."
          value={isPaletteOpen ? "" : query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsDropdownOpen(!!query && !isPaletteOpen)}
          className="h-10 w-full rounded-lg border border-black/10 bg-white/95 pl-10 pr-14 text-sm text-black placeholder:text-black/60 transition-colors hover:border-black/20 focus:border-[#ffb81c] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[#ffb81c]/20 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/70 dark:hover:border-white/30 dark:focus:bg-white/15"
          aria-label="Search courses, articles, or topics"
          aria-autocomplete="list"
          aria-controls="search-results-list"
          aria-activedescendant={isDropdownOpen ? activeDescendant : undefined}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {query && !isPaletteOpen ? (
          <button
            onClick={handleClear}
            className="absolute right-2 z-10 flex h-6 w-6 items-center justify-center rounded text-black/50 transition-colors hover:bg-black/5 hover:text-black/80 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white/90"
            aria-label="Clear search query"
            type="button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <kbd
            className="pointer-events-none absolute right-2 hidden rounded border border-black/10 bg-black/5 px-1.5 py-0.5 font-sans text-[11px] font-medium text-black/50 dark:border-white/15 dark:bg-white/10 dark:text-white/50 md:inline-block"
            aria-hidden="true"
          >
            {shortcutLabel}
          </kbd>
        )}
      </div>

      {/* Inline dropdown results */}
      {isDropdownOpen && !isPaletteOpen && !!query.trim() && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-[#222222]">
          <SearchResults
            results={results}
            isLoading={isLoading}
            query={query}
            activeIndex={activeIndex}
            onResultClick={handleResultClick}
            onHover={setActiveIndex}
            variant="dropdown"
          />
        </div>
      )}

      {/* ⌘K command palette — portaled to <body> so the header's stacking
          context (sticky z-50) can't trap the overlay below page content */}
      {isPaletteOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) closeAll()
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Search the wiki"
          >
            <div className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#222222]">
              <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-slate-700/60">
                <SearchIcon className="h-[18px] w-[18px] flex-shrink-0 text-slate-400 dark:text-slate-500" />
                <input
                  ref={paletteInputRef}
                  type="text"
                  inputMode="search"
                  placeholder="Search courses, guides, topics..."
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="h-14 w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500"
                  aria-label="Search courses, articles, or topics"
                  aria-autocomplete="list"
                  aria-controls="search-results-list"
                  aria-activedescendant={activeDescendant}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={closeAll}
                  className="flex-shrink-0 rounded border border-slate-200 px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 dark:border-slate-600 dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-slate-300"
                  aria-label="Close search"
                >
                  esc
                </button>
              </div>

              <SearchResults
                results={results}
                isLoading={isLoading}
                query={query}
                activeIndex={activeIndex}
                onResultClick={handleResultClick}
                onHover={setActiveIndex}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

export default Search
