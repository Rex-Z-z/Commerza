"use client"

import React from 'react'
import { useScroll } from '../context/scroll-context'
import { SearchBar } from '@/components/ui/search-bar'

const frequentlySearched = ['Electronics', 'Books', 'Clothing', 'Home Appliances', 'Toys', 'Sports Equipment']

const Page = () => {
  const { searchBarRef } = useScroll()

  return (
    <div>
      <div ref={searchBarRef} className="flex flex-col justify-center items-center py-6 bg-primary gap-3" >
        <SearchBar className="md:w-4xl w-11/12" page='landing'/>
        <div className='w-4xl flex flex-row justify-start gap-3'>
          <p className='text-sm text-white'>Frequently searched:</p>
          <p className='text-sm flex flex-row gap-2'>
            {frequentlySearched.map((item, index) => (
              <span key={index} className='text-white underline cursor-pointer'>
                {item}{index < frequentlySearched.length - 1 ? ',' : ''}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className="h-[200vh] bg-gray-50 p-8">
        <h2 className="text-2xl font-bold">Scroll down</h2>
        <p>As you scroll past the search bar above, the search bar in the sticky navbar will appear.</p>
      </div>
    </div>
  )
}

export default Page