import React from 'react'
import FilterMenu from './components/filter-menu'

const page = () => {
    return (
        <div className='w-full flex flex-row px-10 py-8 gap-4'>
            {/* Filter */}
            <FilterMenu />
            
            {/* Result Products */}
            <div className='w-8/10'>
                <h1>Products Result</h1>
            </div>
        </div>
    )
}

export default page