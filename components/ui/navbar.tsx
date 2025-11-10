"use client"

import React, { useState, useRef } from 'react'
import { 
    Search, Camera, MapPin, Store, 
    ShoppingBasket, MessageCircleQuestionMark, 
    Menu, Star 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from './separator'
import { cn } from '@/lib/utils'

// --- Menu Data ---
// You can customize this data to build your menus
const categoriesData = [
    {
        id: 1, name: "Electronics",
        subcategories: [
            { name: "Smartphones", href: "/" }, { name: "Laptops", href: "/" },
            { name: "Televisions", href: "/" }, { name: "Cameras", href: "/" },
            { name: "Audio", href: "/" }, { name: "Gaming", href: "/" },
        ],
    },
    {
        id: 2, name: "Fashion",
        subcategories: [
            { name: "Men's Clothing", href: "/" }, { name: "Women's Clothing", href: "/" },
            { name: "Shoes", href: "/" }, { name: "Accessories", href: "/" },
        ],
    },
    {
        id: 3, name: "Home & Garden",
        subcategories: [
            { name: "Furniture", href: "/" }, { name: "Kitchen", href: "/" },
            { name: "Lighting", href: "/" }, { name: "Tools", href: "/" },
        ],
    },
]

// Main menu items for the bottom bar
const menuItems = [
    { id: 'categories', label: 'All Categories', icon: <Menu className='size-4 mr-2' /> },
    { id: 'featured', label: 'Feature', icon: <Star className='size-4 mr-2' /> },
    { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBasket className='size-4 mr-2' /> },
    { id: 'seller', label: 'Became a Seller', icon: <Store className='size-4 mr-2' />, align: 'right' },
    { id: 'help', label: 'Help Center', icon: <MessageCircleQuestionMark className='size-4 mr-2' />, align: 'right' },
]

// --- Main Component ---
const NavBar = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState(categoriesData[0])
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Clear timeout when entering a trigger
    const handleTriggerEnter = (menuId: string) => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
        setActiveMenu(menuId)
    }

    // Set a timeout when leaving a trigger
    const handleTriggerLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setActiveMenu(null)
        }, 200) // 200ms delay
    }

    // Clear timeout when entering the dropdown content
    const handleDropdownEnter = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current)
            hoverTimeoutRef.current = null
        }
    }

    // Set timeout when leaving the dropdown content
    const handleDropdownLeave = () => {
        hoverTimeoutRef.current = setTimeout(() => {
            setActiveMenu(null)
        }, 200) // 200ms delay
    }

    // --- Sub-Components for Dropdown Content ---
    const CategoriesMenu = () => (
        <div className="flex w-[1000px] h-[200px] p-2 gap-1 bg-white rounded-md shadow-md">
            {/* Left Column (Main Categories) */}
            <div className="w-2/5 pr-4 overflow-y-auto custom-scrollbar">
                <ul className="flex flex-col space-y-1">
                    {categoriesData.map((category) => (
                        <li key={category.id}>
                            <button
                                onMouseEnter={() => setActiveCategory(category)}
                                className={`w-full text-left px-5 py-2 rounded-md text-sm hover:cursor-pointer ${
                                    activeCategory.id === category.id
                                        ? 'bg-primary/10 border-l-4 border-primary font-semibold text-primary'
                                        : 'text-gray-800 hover:bg-gray-50'
                                }`}
                            >
                                {category.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Right Column (Subcategories) */}
            <div className="w-3/5 pl-6 border-l border-gray-200 overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{activeCategory.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {activeCategory.subcategories.map((sub) => (
                        <a
                            key={sub.name}
                            href={sub.href}
                            className="block px-4 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700"
                        >
                            {sub.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )

    const FeaturedMenu = () => (
        <div className='w-[400px] p-4 bg-white rounded-md text-gray-900 shadow-md'>
            <p className=' text-lg font-semibold mb-2'>
                Featured Content!
            </p>
            <p>This is the dropdown for the 'Feature' category. You can add any content here.</p>
        </div>
    )
    
    // Simple component map
    const menuContentMap: { [key: string]: React.ReactNode } = {
        categories: <CategoriesMenu />,
        featured: <FeaturedMenu />,
        marketplace: <div className='w-[300px] p-4 bg-white rounded-md text-gray-900 shadow-md'>Marketplace Content</div>,
        seller: <div className='w-[300px] p-4 bg-white rounded-md text-gray-900 shadow-md'>Seller Content</div>,
        help: <div className='w-[300px] p-4 bg-white rounded-md text-gray-900 shadow-md'>Help Content</div>,
    }

    // --- Main Render ---
    return (
        <div className="flex flex-col bg-[#35B9EC] border-b border-gray-200 shadow-sm relative z-20">
            {/* Top Section (Copied from your navbar.tsx) */}
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
            
            {/* Bottom Section (New Alibaba-style) */}
            <div className='px-2 py-3' onMouseLeave={handleTriggerLeave}>
                <div className="flex items-center justify-between w-full">
                    {/* Left-aligned triggers */}
                    <div className="flex items-center">
                        {menuItems.filter(item => item.align !== 'right').map(item => (
                            <div
                                key={item.id}
                                onMouseEnter={() => handleTriggerEnter(item.id)}
                                className={cn(
                                    "flex items-center py-2 px-3 rounded-md text-sm font-medium text-white hover:bg-black/10 cursor-pointer",
                                    activeMenu === item.id && "bg-black/10"
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
                                    "flex items-center py-2 px-3 rounded-md text-sm font-medium text-white hover:bg-black/10 cursor-pointer",
                                    activeMenu === item.id && "bg-black/10"
                                )}
                            >
                                {item.icon} {item.label}
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Full-Width Animated Dropdown Container --- */}
                <div
                    className={cn(
                        "absolute left-0 top-full w-full pt-1.5 transition-all duration-300 ease-in-out",
                        // Animation: slide down and fade in
                        activeMenu
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 -translate-y-4 pointer-events-none"
                    )}
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                >
                    <div className="w-full bg-transparent shadow-lg">
                        {/* We render the content in a container that aligns with the triggers */}
                        <div className="max-w-7xl mx-auto px-2 relative">
                            {/* This logic positions the dropdown. 
                                It's simple for now, but can be customized.
                            */}
                            {activeMenu && (
                                <div className={cn(
                                    "absolute top-0",
                                    menuItems.find(item => item.id === activeMenu)?.align === 'right' ? "right-2" : "left-2"
                                )}>
                                    {menuContentMap[activeMenu]}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar