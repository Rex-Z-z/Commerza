"use client"

import React from 'react'
import { useScroll } from '../context/scroll-context'
import { SearchBar } from '@/components/ui/search-bar'
import MainCarousel from './components/main-carousel'
import FlashsaleCarousel from './components/flashsale-carousel'
import BestsaleCarousel from './components/bestsale-carousel'

const frequentlySearched = ['Electronics', 'Books', 'Clothing', 'Home Appliances', 'Toys', 'Sports Equipment']

const Page = () => {
  // This hook now works because it is inside ScrollProvider defined in the layout
  const { searchBarRef } = useScroll()

  return (
    <div className='bg-gray-50'>
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
      
      {/* Carousel Section */}
      <div className="pt-10 pb-4 px-6">
        <MainCarousel />
      </div>
      
      {/* Flash Sale */}
      <div className="py-3.5 px-6">
        <FlashsaleCarousel />
      </div>

      {/* Best Sale */}
      <div className="py-3.5 px-6">
        <BestsaleCarousel />
      </div>
    </div>
  )
}

export default Page