"use client"

import React, { useState, useRef } from 'react'
import CategoriesMenu from './categories-menu'
import MarketPlace from './market-place'
import { Search, Camera, MapPin, Store, ShoppingBasket, MessageCircleQuestionMark, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from '../separator'
import { cn } from '@/lib/utils'

const menuItems = [
    { id: 'categories', label: 'All Categories', icon: <Menu className='size-4 mr-2' /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBasket className='size-4 mr-2' /> },
    { id: 'seller', label: 'Became a Seller', icon: <Store className='size-4 mr-2' />, align: 'right' },
    { id: 'help', label: 'Help Center', icon: <MessageCircleQuestionMark className='size-4 mr-2' />, align: 'right' },
]

// --- Main Component ---
const NavBar = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleTriggerEnter = (menuId: string) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
        const newIndex = menuItems.findIndex(item => item.id === menuId)
        setActiveIndex(newIndex)
    }

    const handleTriggerLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setActiveIndex(null)
        }, 200) // 200ms delay
    }

    const handleDropdownEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
    }

    const handleDropdownLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setActiveIndex(null)
        }, 200) // 200ms delay
    }
    
    const menuContentMap: { [key: string]: React.ComponentType } = {
        categories: CategoriesMenu,
        marketplace: MarketPlace,
        seller: () => <div className='w-full p-4 bg-white rounded-md text-gray-900 shadow-md'><div className='max-w-7xl mx-auto'>Seller Content</div></div>,
        help: () => <div className='w-full p-4 bg-white rounded-md text-gray-900 shadow-md'><div className='max-w-7xl mx-auto'>Help Content</div></div>,
    }
    
    const activeMenuId = activeIndex !== null ? menuItems[activeIndex]?.id : null;

    // --- Main Render ---
    return (
        <div className="flex flex-col bg-[#35B9EC] border-b border-gray-200 shadow-sm relative z-20">
            {/* Top Section */}
            <div className="px-4 py-3 flex items-center justify-between">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="/picture/logo.png" className="md:h-8 h-6" alt="Commerza Logo" />
                </a>
                <div className="flex flex-row items-center gap-2">
                    <div className="relative md:w-lg w-[200px]">
                        <input type="text" placeholder="Search" className="w-full rounded-md border pl-4 pr-24 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 outline-none focus-visible:ring-[3px] focus-visible:ring-[#C1EDFE] transition-all" />
                        <div className="absolute right-1 top-1/2 -translate-y-1/2">
                            <div className="flex flex-row items-center gap-1">
                                <Button variant="link" size="icon" className='text-gray-500'>
                                    <Camera className='size-5'/>
                                </Button>
                                <Button variant="default">
                                    <Search /> Search
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button variant="secondary" size="lg" className="text-sm py-5 border text-gray-500 border-gray-300 dark:border-gray-700">
                        <MapPin className='size-4'/> Location
                    </Button>
                </div>
                <div className='flex flex-row items-center gap-2'>
                    <Button variant="ghost" size="lg" className="text-sm py-5 text-white hover:text-white hover:bg-accent/20"> Sign Up </Button>
                    <Button variant="secondary" size="lg" className="text-sm py-5 hover:bg-gray-200"> Login </Button>
                </div>
            </div>

            <div className='px-4'>
                <Separator className="bg-[#139ED3] mt-2"/>
            </div>
            
            {/* Bottom Section */}
            <div className='' onMouseLeave={handleTriggerLeave}>
                <div className="flex items-center justify-between w-full">
                    {/* Left-aligned triggers */}
                    <div className="flex items-center">
                        {menuItems.filter(item => item.align !== 'right').map(item => (
                            <div
                                key={item.id}
                                onMouseEnter={() => handleTriggerEnter(item.id)}
                                className={cn(
                                    "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer",
                                    // --- Start of new classes ---
                                    "relative", // Sets the positioning context for the ::after element
                                    "after:content-[''] after:absolute after:bottom-0 after:left-0", // Create the pseudo-element
                                    "after:h-px after:w-full after:bg-white", // Style it as a 1px white line
                                    "after:scale-x-0 after:origin-center", // Start it at 0% width, centered
                                    "after:transition-transform after:duration-300 after:ease-in-out", // Animate the 'transform' (scale)
                                    // --- End of new classes ---
                                    
                                    // UPDATED: This now toggles the scale
                                    activeMenuId === item.id && "after:scale-x-100"
                                )}
                            >
                                {item.icon} {item.label}
                            </div>
                        ))}
                    </div>
                    
                    {/* Right-aligned triggers */}
                    <div className="flex items-center">
                        {menuItems.filter(item => item.align === 'right').map(item => (
                            <div
                                key={item.id}
                                onMouseEnter={() => handleTriggerEnter(item.id)}
                                className={cn(
                                    "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer",
                                    // --- Start of new classes ---
                                    "relative", // Sets the positioning context for the ::after element
                                    "after:content-[''] after:absolute after:bottom-0 after:left-0", // Create the pseudo-element
                                    "after:h-px after:w-full after:bg-white", // Style it as a 1px white line
                                    "after:scale-x-0 after:origin-center", // Start it at 0% width, centered
                                    "after:transition-transform after:duration-300 after:ease-in-out", // Animate the 'transform' (scale)
                                    // --- End of new classes ---
                                    
                                    // UPDATED: This now toggles the scale
                                    activeMenuId === item.id && "after:scale-x-100"
                                )}
                            >
                                {item.icon} {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Full-Width Animated Dropdown Container --- */}
                <div
                    className={cn( "absolute left-0 top-full w-full pt-1.5 transition-all duration-300 ease-in-out",
                        activeIndex !== null
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-4 pointer-events-none"
                    )}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                >
                    <div className="w-full relative h-[220px] overflow-hidden">
                        
                        {/* UPDATED: Render ALL menu items and use transforms to position them */}
                        {menuItems.map((item, index) => {
                            const MenuContent = menuContentMap[item.id];
                            if (!MenuContent) return null; // Skip if no content for this item

                            const isActive = index === activeIndex;
                            
                            let positionClasses = "";
                            if (activeIndex === null) {
                                positionClasses = "opacity-0 translate-x-0 pointer-events-none";
                            } else if (index < activeIndex) {
                                positionClasses = "opacity-0 -translate-x-full pointer-events-none";
                            } else if (index > activeIndex) {
                                positionClasses = "opacity-0 translate-x-full pointer-events-none";
                            } else {
                                positionClasses = "opacity-100 translate-x-0";
                            }

                            return (
                                <div
                                    key={item.id}
                                    className={cn(
                                        "absolute top-0 left-0 w-full transition-all duration-300 ease-in-out",
                                        positionClasses
                                    )}
                                >
                                    <MenuContent />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar