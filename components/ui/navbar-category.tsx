import { useState } from 'react'
import { Menu } from "lucide-react"
import {
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils';

type Category = typeof categories[0];

const categories = [
    {
        id: 1,
        name: "Electronics",
        subcategories: [
            { name: "Smartphones", href: "/" },
            { name: "Laptops", href: "/" },
            { name: "Televisions", href: "/" },
            { name: "Cameras", href: "/" },
            { name: "Audio", href: "/" },
            { name: "Gaming", href: "/" },
        ],
    },
    {
        id: 2,
        name: "Fashion",
        subcategories: [
            { name: "Men's Clothing", href: "/" },
            { name: "Women's Clothing", href: "/" },
            { name: "Shoes", href: "/" },
            { name: "Accessories", href: "/" },
            { name: "Watches", href: "/" },
        ],
    },
    {
        id: 3,
        name: "Home & Garden",
        subcategories: [
            { name: "Furniture", href: "/" },
            { name: "Kitchen", href: "/" },
            { name: "Lighting", href: "/" },
            { name: "Tools", href: "/" },
        ],
    },
    {
        id: 4,
        name: "Sports & Outdoors",
        subcategories: [
            { name: "Fitness Equipment", href: "/" },
            { name: "Outdoor Gear", href: "/" },
            { name: "Cycling", href: "/" },
            { name: "Camping", href: "/" },
        ],
    },
    {
        id: 5,
        name: "Health & Beauty",
        subcategories: [
            { name: "Skincare", href: "/" },
            { name: "Makeup", href: "/" },
            { name: "Haircare", href: "/e" },   
            { name: "Vitamins", href: "/" },
        ],
    }
]

const NavbarCategory = ({className} : {className?: string}) => {
    const [activeCategory, setActiveCategory] = useState<Category>(categories[0])

    return (
        <NavigationMenuItem className={cn("", className)}>
            <NavigationMenuTrigger className="py-5 text-sm text-white bg-transparent hover:cursor-pointer hover:text-white hover:bg-transparent focus:bg-transparent focus:text-white data-[state=open]:text-white data-[state=open]:bg-transparent data-[state=open]:focus:bg-transparent data-[state=open]:hover:bg-transparent">
                <Menu className='size-4 mr-2' /> All Categories
            </NavigationMenuTrigger>

            <NavigationMenuContent>
                <div className="flex w-[600px] h-[200px] p-2 gap-1">
                    {/* Left Column (Main Categories) */}
                    <div className="w-2/5 pr-4 overflow-y-auto custom-scrollbar">
                        <ul className="flex flex-col space-y-1">
                            {categories.map((category) => (
                                <li key={category.id}>
                                    <button
                                        // 6. Update state on hover
                                        onMouseEnter={() => setActiveCategory(category)}
                                        className={`w-full text-left px-5 py-2 rounded-md text-sm hover:cursor-pointer ${
                                            activeCategory.id === category.id
                                                ? 'bg-primary/10 border-l-6 border-primary font-semibold'
                                                : 'hover:bg-gray-50'
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
                        <h3 className="text-lg font-semibold mb-2">{activeCategory.name}</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {/* 7. Display subcategories based on state */}
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
            </NavigationMenuContent>
        </NavigationMenuItem>
    )
}

export default NavbarCategory