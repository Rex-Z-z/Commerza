"use client"

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import CategoriesMenu from './categories-menu'
import MarketPlace from './market-place'
import HelpCenter from './help-center'
import { MapPin, Store, ShoppingBasket, MessageCircleQuestionMark, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from '../separator'
import { useScroll } from '@/app/context/scroll-context' 
import { SearchBar } from '@/components/ui/search-bar'

const menuItems = [
    { id: 'categories', label: 'All Categories', icon: <Menu className='size-4 mr-2' /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBasket className='size-4 mr-2' /> },
    { id: 'seller', label: 'Became a Seller', icon: <Store className='size-4 mr-2' />, align: 'right', href: '/' },
    { id: 'help', label: 'Help Center', icon: <MessageCircleQuestionMark className='size-4 mr-2' />, align: 'right' },
]

const borderBottomStyle = "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100"
const borderBottomLinkStyle = "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-in-out"

// --- Main Component ---
// 1. UPDATED PROP TYPE
const NavBar = ({ page = 'default' }: { page?: 'default' | 'search' | 'dashboard' }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const isSearchPage = page === 'search'
    
    // 2. UPDATED HOOK CALL
    const { isScrolledPastSearch = false } = (page === 'default') ? useScroll() : {};

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
        help: HelpCenter,
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
            setIsScrolled(window.scrollY > 0)
        }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    const activeMenuId = activeIndex !== null ? menuItems[activeIndex]?.id : null;

    // --- Main Render ---
    return (
        <div className={cn(`flex flex-col bg-[#35B9EC] border-b border-transparent sticky top-0 z-20`, isScrolled ? "shadow-md" : "")}>
            {/* Top Section */}
            <div className="px-4 py-4 flex items-center justify-between">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <svg width="230" height="40" viewBox="0 0 260 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 40H19.5098C17.9943 40 16.5408 39.398 15.4692 38.3263L1.67368 24.5308C0.60204 23.4592 0 22.0057 0 20.4902V10L30 40Z" fill="white"></path>
                        <path d="M10.7143 40H4.28571C1.91878 40 0 38.0812 0 35.7143V29.2857L10.7143 40Z" fill="white"></path>
                        <path d="M33.7239 36.5809C37.7426 32.5622 40.0002 27.1118 40.0002 21.4286C40.0002 15.7454 37.7426 10.2949 33.7239 6.27629C29.7053 2.25765 24.2549 1.02188e-06 18.5717 0C12.8884 -1.02188e-06 7.438 2.25764 3.41936 6.27628L10.4904 13.3473C11.6062 14.4631 13.408 14.4074 14.8275 13.7181C15.9835 13.1568 17.2621 12.8571 18.5716 12.8571C20.8449 12.8571 23.0251 13.7602 24.6326 15.3677C26.24 16.9751 27.1431 19.1553 27.1431 21.4286C27.1431 22.7381 26.8434 24.0167 26.2821 25.1727C25.5928 26.5922 25.5371 28.394 26.6529 29.5098L33.7239 36.5809Z" fill="white"></path>
                        <path d="M244.136 6.92919C252.576 6.92919 259.448 13.8007 259.448 22.2407V33.0708H251.979V22.2407C251.979 19.1411 250.112 16.4522 247.497 15.1825V33.0708H240.028V22.2407C240.028 19.1411 238.161 16.4522 235.547 15.1825V33.0708H228.078V6.92919H232.186C235.024 6.92919 237.713 7.75078 240.028 9.13256V6.92919H244.136Z" fill="white"></path>
                        <path d="M225.111 22.2407C225.111 28.2159 220.219 33.0708 214.281 33.0708C208.306 33.0708 203.451 28.2159 203.451 22.2407V6.92919H210.92V22.2407C210.92 24.108 212.414 25.6018 214.281 25.6018C216.111 25.6018 217.642 24.108 217.642 22.2407V6.92919H225.111V22.2407Z" fill="white"></path>
                        <path d="M201.174 24.6681C201.174 29.2616 197.439 32.9961 192.846 32.9961H181.754V25.5271H192.846C193.294 25.5271 193.705 25.1536 193.705 24.6681C193.705 24.22 193.294 23.8466 192.846 23.8466H189.821C185.153 23.8466 181.381 20.0747 181.381 15.4065C181.381 10.7384 185.153 6.92919 189.821 6.92919H200.8V14.3982H189.821C189.261 14.3982 188.85 14.8464 188.85 15.4065C188.85 15.9294 189.261 16.3775 189.821 16.3775H192.846C197.439 16.3775 201.174 20.112 201.174 24.6681Z" fill="white"></path>
                        <path d="M170.441 6.92919C175.669 6.92919 179.964 11.2239 179.964 16.4522C179.964 21.7179 175.669 25.9752 170.441 25.9752H167.64V33.0708H160.171V6.92919H170.441ZM170.441 18.5062C171.561 18.5062 172.495 17.6099 172.495 16.4522C172.495 15.3319 171.561 14.3982 170.441 14.3982H167.64V18.5062H170.441Z" fill="white"></path>
                        <path d="M156.809 33.0708H149.34V6.92919H156.809V33.0708Z" fill="white"></path>
                        <path d="M147.046 20C147.046 27.2076 141.145 33.0708 133.975 33.0708C126.767 33.0708 120.904 27.2076 120.904 20C120.904 12.8297 126.767 6.92919 133.975 6.92919C141.145 6.92919 147.046 12.8297 147.046 20ZM139.577 20C139.577 16.9377 137.037 14.3982 133.975 14.3982C130.875 14.3982 128.373 16.9377 128.373 20C128.373 23.0996 130.875 25.6018 133.975 25.6018C137.037 25.6018 139.577 23.0996 139.577 20Z" fill="white"></path>
                        <path d="M118.73 18.3195V33.0708H109.394C102.187 33.0708 96.3233 27.2076 96.3233 20C96.3233 12.8297 102.187 6.92919 109.394 6.92919H118.73V14.3982H109.394C106.295 14.3982 103.792 16.9377 103.792 20C103.792 23.0996 106.295 25.6018 109.394 25.6018H111.261V18.3195H118.73Z" fill="white"></path>
                        <path d="M95.1126 20C95.1126 27.2076 89.212 33.0708 82.0417 33.0708C74.8341 33.0708 68.9709 27.2076 68.9709 20C68.9709 12.8297 74.8341 6.92919 82.0417 6.92919C89.212 6.92919 95.1126 12.8297 95.1126 20ZM87.6435 20C87.6435 16.9377 85.1041 14.3982 82.0417 14.3982C78.9421 14.3982 76.44 16.9377 76.44 20C76.44 23.0996 78.9421 25.6018 82.0417 25.6018C85.1041 25.6018 87.6435 23.0996 87.6435 20Z" fill="white"></path>
                        <path d="M68.2013 25.6018V33.0708H58.865C55.1305 33.0708 52.1429 30.0832 52.1429 26.3487V6.92919H59.6119V25.6018H68.2013Z" fill="white"></path>
                    </svg>
                </a>

                {page !== 'dashboard' && (
                    <div className={cn( "flex flex-row items-center gap-2", (isScrolledPastSearch || isSearchPage) ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none")}>
                        <SearchBar className="md:w-lg w-[200px]" /> 
                        <Button variant="secondary" size="lg" className="rounded-full hover:text-primary/90 hover:bg-gray-100">
                            <MapPin className='size-4'/> Location
                        </Button>
                    </div>
                )}

                {page === 'dashboard' && <div className="flex-grow" />}

                <div className='flex flex-row items-center gap-2'>
                    <Button variant="ghost" size="lg" className="text-white hover:text-white hover:bg-accent/20" asChild> 
                        <a href="/signup"> Sign Up </a>
                    </Button>
                    <Button variant="secondary" size="lg" className="hover:text-primary/90 hover:bg-gray-100" asChild> 
                        <a href="/login"> Login </a>
                    </Button>
                </div>
            </div>

            <div className={`px-4 ${isScrolled ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"}`} >
                <Separator className="bg-[#139ED3]" />
            </div>
            
            {/* Bottom Section */}
            <div 
                onMouseLeave={handleTriggerLeave} 
                className={cn( "transition-all duration-300 ease-in-out overflow-hidden", (isScrolled || isSearchPage || page === 'dashboard') ? "max-h-0 opacity-0" : "max-h-20 opacity-100")}>
                <div className="flex items-center justify-between w-full">
                    {/* Left-aligned triggers */}
                    <div className="flex items-center">
                        {menuItems.filter(item => item.align !== 'right').map(item => (
                            item.href ? (
                                <a
                                    key={item.id}
                                    href={item.href}
                                    onMouseEnter={handleLinkEnter}
                                    className={cn(borderBottomStyle)}
                                >
                                    {item.icon} {item.label}
                                </a>
                            ) : (
                                <div
                                    key={item.id}
                                    onMouseEnter={() => handleTriggerEnter(item.id)}
                                    className={cn(borderBottomLinkStyle, activeMenuId === item.id && "after:scale-x-100")}
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
                                    className={cn(borderBottomStyle)}
                                >
                                    {item.icon} {item.label}
                                </a>
                            ) : (
                                <div
                                    key={item.id}
                                    onMouseEnter={() => handleTriggerEnter(item.id)}
                                    className={cn(borderBottomLinkStyle, activeMenuId === item.id && "after:scale-x-100")}
                                >
                                    {item.icon} {item.label}
                                </div>
                            )
                        ))}
                    </div>
                </div>

                {/* --- Full-Width Animated Dropdown Container --- */}
                <div
                    className={cn( "absolute left-0 top-full w-full transition-all duration-300 ease-in-out", activeIndex !== null ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none" )}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                >
                    <div className="w-full relative h-[300px] overflow-hidden">
                        
                        {menuItems.map((item, index) => {
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
                                <div key={item.id} className={cn( "absolute top-0 left-0 w-full transition-all duration-300 ease-in-out", positionClasses )}>
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