"use client"

import React, { useState, useRef, useEffect } from 'react'
import CategoriesMenu from './categories-menu'
import MarketPlace from './market-place'
import { Search, Camera, MapPin, Store, ShoppingBasket, MessageCircleQuestionMark, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from '../separator'
import { cn } from '@/lib/utils'
import { useScroll } from '@/app/context/scroll-context' 
import { SearchBar } from '@/components/ui/search-bar'

const menuItems = [
    { id: 'categories', label: 'All Categories', icon: <Menu className='size-4 mr-2' /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBasket className='size-4 mr-2' /> },
    { id: 'seller', label: 'Became a Seller', icon: <Store className='size-4 mr-2' />, align: 'right', href: '/' },
    { id: 'help', label: 'Help Center', icon: <MessageCircleQuestionMark className='size-4 mr-2' />, align: 'right' },
]

// --- Main Component ---
const NavBar = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const { isScrolledPastSearch } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)

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
        help: () => <div className='w-full p-4 bg-white rounded-md text-gray-900 shadow-md'><div className='max-w-7xl mx-auto'>Help Content</div></div>,
    }

    const handleLinkEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setActiveIndex(null);
    }

    useEffect(() => {
        const handleScroll = () => {
            // Set true if scrolled more than 0 pixels, false otherwise
            setIsScrolled(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    const activeMenuId = activeIndex !== null ? menuItems[activeIndex]?.id : null;

    // --- Main Render ---
    return (
        <div className="flex flex-col bg-[#35B9EC] border-b border-gray-200 shadow-sm sticky top-0 z-20">
            {/* Top Section */}
            <div className="px-4 py-3 flex items-center justify-between">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="/picture/logo.png" className="md:h-8 h-6" alt="Commerza Logo" />
                </a>

                <div className={cn(
                    "flex flex-row items-center gap-2",
                    isScrolledPastSearch
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-4 pointer-events-none" 
                )}>
                    <SearchBar className="md:w-lg w-[200px]" /> 
                    
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
            <div 
                onMouseLeave={handleTriggerLeave}
                className={cn(
                    "transition-all duration-300 ease-in-out overflow-hidden",
                    isScrolled
                        ? "max-h-0 opacity-0"
                        : "max-h-20 opacity-100"
                )}
            >
                <div className="flex items-center justify-between w-full">
                    {/* Left-aligned triggers */}
                    <div className="flex items-center">
                        {menuItems.filter(item => item.align !== 'right').map(item => (
                            item.href ? (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    onMouseEnter={handleLinkEnter}
                                    className={cn(
                                        "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer",
                                        "relative", // For the border animation
                                        "after:content-[''] after:absolute after:bottom-0 after:left-0",
                                        "after:h-px after:w-full after:bg-white",
                                        "after:scale-x-0 after:origin-center",
                                        "after:transition-transform after:duration-300 after:ease-in-out",
                                        "hover:after:scale-x-100" // Animate border on hover for links
                                    )}
                                >
                                    {item.icon} {item.label}
                                </a>
                            ) : (
                                <div
                                    key={item.id}
                                    onMouseEnter={() => handleTriggerEnter(item.id)}
                                    className={cn(
                                        "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer",
                                        "relative", // For the border animation
                                        "after:content-[''] after:absolute after:bottom-0 after:left-0",
                                        "after:h-px after:w-full after:bg-white",
                                        "after:scale-x-0 after:origin-center",
                                        "after:transition-transform after:duration-300 after:ease-in-out",
                                        activeMenuId === item.id && "after:scale-x-100" // Animate border when active
                                    )}
                                >
                                    {item.icon} {item.label}
                                </div>
                            )
                        ))}
                    </div>
                    
                    {/* Right-aligned triggers */}
                    <div className="flex items-center">
                         {menuItems.filter(item => item.align === 'right').map(item => (
                            item.href ? (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    onMouseEnter={handleLinkEnter}
                                    className={cn(
                                        "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer",
                                        "relative", // For the border animation
                                        "after:content-[''] after:absolute after:bottom-0 after:left-0",
                                        "after:h-px after:w-full after:bg-white",
                                        "after:scale-x-0 after:origin-center",
                                        "after:transition-transform after:duration-300 after:ease-in-out",
                                        "hover:after:scale-x-100" // Animate border on hover for links
                                    )}
                                >
                                    {item.icon} {item.label}
                                </a>
                            ) : (
                                <div
                                    key={item.id}
                                    onMouseEnter={() => handleTriggerEnter(item.id)}
                                    className={cn(
                                        "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer",
                                        "relative", // For the border animation
                                        "after:content-[''] after:absolute after:bottom-0 after:left-0",
                                        "after:h-px after:w-full after:bg-white",
                                        "after:scale-x-0 after:origin-center",
                                        "after:transition-transform after:duration-300 after:ease-in-out",
                                        activeMenuId === item.id && "after:scale-x-100" // Animate border when active
                                    )}
                                >
                                    {item.icon} {item.label}
                                </div>
                            )
                        ))}
                    </div>
                </div>

                {/* --- Full-Width Animated Dropdown Container --- */}
                <div
                    className={cn(
                        "absolute left-0 top-full w-full pt-1.5 transition-all duration-300 ease-in-out",
                        activeIndex !== null
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-4 pointer-events-none"
                    )}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                >
                    <div className="w-full relative h-[220px] overflow-hidden">
                        
                        {menuItems.map((item, index) => {
                            // If it's a link, it doesn't have dropdown content, so skip
                            if (item.href) return null; 

                            const MenuContent = menuContentMap[item.id];
                            if (!MenuContent) return null;

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