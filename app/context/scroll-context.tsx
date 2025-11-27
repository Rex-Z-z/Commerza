"use client"

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useRef, 
  ReactNode 
} from 'react'

interface ScrollContextType {
  isScrolledPastSearch: boolean
  searchBarRef: React.RefObject<HTMLDivElement | null>
}

const ScrollContext = createContext<ScrollContextType | null>(null)

export const ScrollProvider = ({ children }: { children: ReactNode }) => {
  const [isScrolledPastSearch, setIsScrolledPastSearch] = useState(false)
  const searchBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (searchBarRef.current) {
        const { offsetTop, offsetHeight } = searchBarRef.current
        const scrollThreshold = offsetTop + offsetHeight - 100

        setIsScrolledPastSearch(window.scrollY > scrollThreshold)
      }
    }

    // Add listener
    window.addEventListener('scroll', handleScroll)

    // Clean up listener
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // Empty dependency array ensures this runs once on mount

  return (
    <ScrollContext.Provider value={{ isScrolledPastSearch, searchBarRef }}>
      {children}
    </ScrollContext.Provider>
  )
}

// Custom hook to easily consume the context
export const useScroll = () => {
  const context = useContext(ScrollContext)
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider")
  }
  return context
}

