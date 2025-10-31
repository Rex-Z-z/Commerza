'use client'

import React from 'react'
import { Search, Camera, MapPin, Store, ShoppingBasket, MessageCircleQuestionMark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from './separator'
import NavbarCategory from './navbar-category'
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const NavBar = () => {
    return (
        <div className="flex flex-col bg-[#35B9EC] border-b border-gray-200 shadow-sm">
            {/* Top Section */}
            <div className="px-4 py-3 flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src="/picture/logo.png" className="md:h-8 h-6" alt="Flowbite Logo" />
                </a>

                {/* Search */}
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
                
                {/* Button Group */}
                <div className='flex flex-row items-center gap-2'>
                    <Button variant="ghost" size="lg" className="text-sm py-5 text-white hover:text-white hover:bg-accent/20"> Sign Up </Button>
                    <Button variant="secondary" size="lg" className="text-sm py-5 hover:bg-gray-200"> Login </Button>
                </div>
            </div>

            <div className='px-4'>
                <Separator className="bg-[#139ED3] mt-2"/>
            </div>
            
            {/* Bottom Section */}
            <div className='px-2 py-3 flex items-center justify-between'>
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavbarCategory />
                        
                        <Button variant="link" size="lg" className="text-sm py-5 text-white hover:cursor-pointer">
                            <ShoppingBasket /> Marketplace
                        </Button>
                    </NavigationMenuList>
                </NavigationMenu>

                <NavigationMenu align="right">
                    <NavigationMenuList>
                        <Button variant="link" size="lg" className="text-sm py-5 text-white hover:cursor-pointer">
                            <Store /> Became a Seller
                        </Button>
                        
                        
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className='py-5 text-sm text-white bg-transparent hover:cursor-pointer hover:text-white hover:bg-transparent focus:bg-transparent focus:text-white data-[state=open]:text-white data-[state=open]:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:hover:bg-transparent'>
                                <MessageCircleQuestionMark className='size-4 mr-2'/> Help Center
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className='w-[400px] p-4'>
                                <p className=' text-lg font-semibold mb-2'>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
                                </p>
                                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis sunt, nemo temporibus dolores aliquam ex vitae commodi quae nesciunt unde accusantium aperiam? Aut dolore architecto possimus quaerat nostrum, id consectetur.</p>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </div>
        </div>
    )
}

export default NavBar