"use client"

import React from 'react'
import { useScroll } from './context/scroll-context'
import { SearchBar } from '@/components/ui/search-bar'

const Page = () => {
  const { searchBarRef } = useScroll()

  return (
    <div>
      <div ref={searchBarRef} className="flex justify-center items-center py-8 bg-white" >
        <SearchBar className="md:w-4xl w-11/12" page='landing'/>
      </div>

      <div className="h-[200vh] bg-gray-50 p-8">
        <h2 className="text-2xl font-bold">Scroll down</h2>
        <p>As you scroll past the search bar above, the search bar in the sticky navbar will appear.</p>
      </div>
    </div>
  )
}

export default Page