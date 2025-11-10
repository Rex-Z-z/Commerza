import React from 'react'
import { Medal, BadgePlus, BadgePercent } from 'lucide-react';

const MarketPlace = () => {
    return (
        <div className='w-full p-4 bg-white text-gray-900 shadow-md'>
            <div className='max-w-7xl mx-auto flex flex-row gap-8 justify-between'>
                <div className='flex flex-col w-full p-6 items-center rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer gap-6 group'>
                    <Medal className='text-black transition-transform duration-200 group-hover:scale-110' size={36} />
                    <h3 className='text-lg font-semibold mb-2 transition-transform duration-200 group-hover:scale-110'>
                        Top Ranking
                    </h3>
                </div>

                <div className='flex flex-col w-full p-6 items-center rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer gap-6 group'>
                    <BadgePlus className='text-black transition-transform duration-200 group-hover:scale-110' size={36} />
                    <h3 className='text-lg font-semibold mb-2 transition-transform duration-200 group-hover:scale-110'>
                        New Arrivals
                    </h3>
                </div>

                <div className='flex flex-col w-full p-6 items-center rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer gap-6 group'>
                    <BadgePercent className='text-black transition-transform duration-200 group-hover:scale-110' size={36} />
                    <h3 className='text-lg font-semibold mb-2 transition-transform duration-200 group-hover:scale-110'>
                        Discount
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default MarketPlace
