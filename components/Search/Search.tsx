"use client"

import Image from "next/image"
import { useRef, useEffect, useState } from "react"
import searchIcon from "@/images/search-icon.svg"
import { useSearch } from "@/hooks/useSearch"
import SearchResults from "./SearchResults"

const Search = () => {
  const { query, results, isLoading, setQuery, clearSearch } = useSearch()
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setIsOpen(!!value)
  }

  const handleClear = () => {
    clearSearch()
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleEscape = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const handleResultClick = () => {
    handleClear()
  }

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xs">
      <div className="flex gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded items-center focus-within:border-[#FFB81C] focus-within:shadow-[0_0_0_2px_rgba(255,184,28,0.1)] transition-all duration-200">
        <label htmlFor="search-bar" className="h-8 flex items-center ml-2">
          <Image src={searchIcon} alt="Search Icon" className="max-h-4 w-auto" />
        </label>
        <input
          ref={inputRef}
          id="search-bar"
          type="text"
          placeholder="Search courses, guides..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleEscape}
          onFocus={() => setIsOpen(!!query)}
          className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none p-2"
          aria-label="Search courses and guides"
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-expanded={isOpen}
        />
        {query && (
          <button
            onClick={handleClear}
            className="mr-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-150 p-1"
            aria-label="Clear search"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && (
        <SearchResults
          results={results}
          isLoading={isLoading}
          query={query}
          onResultClick={handleResultClick}
        />
      )}
    </div>
  )
}

export default Search
