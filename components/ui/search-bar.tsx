import React from 'react'
import { Search, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
    page?: 'navbar' | 'landing';
}

export const SearchBar = ({ className, page = 'navbar' }: { className?: string; page?: 'navbar' | 'landing' }) => {
  return (
    <div className={cn("relative md:w-lg w-[200px]", className)}>
        {
            page === 'navbar' ? (
                <>
                    <input 
                    type="text" 
                    placeholder="Search" 
                    className="w-full rounded-full border pl-4 pr-24 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 outline-none focus-visible:ring-[3px] focus-visible:ring-[#C1EDFE] transition-all" 
                    />
                    <div className="absolute right-[3px] top-1/2 -translate-y-1/2">
                        <div className="flex flex-row items-center gap-1">
                            <Button variant="link" size="icon" className='text-gray-500'>   
                                <Camera className='size-5'/>
                            </Button>
                            <Button variant="default" className='rounded-full'>
                                <Search /> Search
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex flex-row gap-4">
                    <div className="relative w-4/5">
                        <input
                        type="text"
                        placeholder="Search"
                        className="w-full rounded-full border pl-6 pr-48 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 outline-none focus-visible:ring-[3px] focus-visible:ring-[#C1EDFE] transition-all"
                        />
                        <div className="absolute right-1 top-1/2 -translate-y-1/2">
                            <div className="flex flex-row items-center gap-1">
                                <Button variant="default" className="w-[110px] rounded-full p-6">
                                    <Search /> Search
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button variant="secondary" size="icon" className='rounded-full text-gray-500 px-20 py-7'>   
                        <Camera className='size-5'/> Image Search
                    </Button>
                </div>
            )
        }
    </div>
  )
}