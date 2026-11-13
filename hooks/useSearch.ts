import { useCallback, useEffect, useState, useRef } from "react"
import { searchIndex, SearchIndex, SearchResult } from "@/utils/search"

export const useSearch = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout>()
  const indexRef = useRef<SearchIndex | null>(null)
  const pendingQueryRef = useRef<string | null>(null)

  const performSearch = useCallback((searchQuery: string) => {
    if (!indexRef.current) {
      // Index still loading; remember the query and run it when it arrives
      pendingQueryRef.current = searchQuery
      return
    }

    try {
      setResults(searchIndex(searchQuery, indexRef.current))
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch the prebuilt search index (built server-side; the guide markdown
  // can't be read in the browser) once on mount.
  useEffect(() => {
    let isMounted = true

    const initializeIndex = async () => {
      try {
        // no-cache = revalidate with the server (304 when unchanged) so a
        // stale cached index doesn't outlive a deploy
        const response = await fetch("/api/search-index", {
          cache: "no-cache",
        })
        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.status}`)
        }
        const index: SearchIndex = await response.json()
        if (isMounted) {
          indexRef.current = index
          if (pendingQueryRef.current !== null) {
            const pending = pendingQueryRef.current
            pendingQueryRef.current = null
            performSearch(pending)
          }
        }
      } catch (error) {
        console.error("Error loading search index:", error)
        if (isMounted) setIsLoading(false)
      }
    }

    if (!indexRef.current) {
      initializeIndex()
    }

    return () => {
      isMounted = false
    }
  }, [performSearch])

  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery)
      setIsLoading(!!newQuery.trim())

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Small debounce keeps typing snappy without re-scoring every keystroke
      debounceTimerRef.current = setTimeout(() => {
        performSearch(newQuery)
      }, 120)
    },
    [performSearch]
  )

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const clearSearch = useCallback(() => {
    setQuery("")
    setResults([])
    setIsLoading(false)
    pendingQueryRef.current = null
  }, [])

  return {
    query,
    results,
    isLoading,
    setQuery: handleQueryChange,
    clearSearch,
  }
}
