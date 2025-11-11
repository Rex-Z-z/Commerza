import React from 'react'
import { BadgePercent, BadgePlus, Medal } from 'lucide-react'

const HelpCenter = () => {
    return (
        <div>
            <div className='w-full p-4 bg-white text-gray-900 shadow-md'>
                <div className='flex flex-row gap-8 justify-between max-w-7xl mx-auto'>
                    <div className='w-3/5 flex flex-row text-gray-700 gap-8 justify-between'>
                        <div className='flex flex-col w-full p-6 items-center rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer gap-6 group'>
                            <Medal className='transition-transform duration-200 group-hover:scale-110' size={36} />
                            <h3 className='text-lg font-semibold mb-2 transition-transform duration-200 group-hover:scale-110'>
                                Top Ranking
                            </h3>
                        </div>
                        <div className='flex flex-col w-full p-6 items-center rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer gap-6 group'>
                            <BadgePlus className='transition-transform duration-200 group-hover:scale-110' size={36} />
                            <h3 className='text-lg font-semibold mb-2 transition-transform duration-200 group-hover:scale-110'>
                                New Arrivals
                            </h3>
                        </div>
                        <div className='flex flex-col w-full p-6 items-center rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer gap-6 group'>
                            <BadgePercent className='transition-transform duration-200 group-hover:scale-110' size={36} />
                            <h3 className='text-lg font-semibold mb-2 transition-transform duration-200 group-hover:scale-110'>
                                Discount
                            </h3>
                        </div>
                    </div>

                    <div className='w-2/5 flex flex-col justify-center border-l border-gray-300'>
                        <div className='flex flex-col text-sm text-gray-700 pl-6 gap-4'>
                            <p className='hover:underline cursor-pointer'>Open Disputes</p>
                            <p className='hover:underline cursor-pointer'>Report IRP Infringement</p>
                            <p className='hover:underline cursor-pointer'>Contact Us</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HelpCenter
