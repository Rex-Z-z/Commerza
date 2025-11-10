import { cn } from '@/lib/utils'
import React, { useState } from 'react'

const categoriesData = [
    {
        id: 1,
        name: "Electronics",
        subcategories: [
            { name: "Smartphones", href: "/" }, { name: "Laptops", href: "/" },
            { name: "Televisions", href: "/" }, { name: "Cameras", href: "/" },
            { name: "Audio", href: "/" }, { name: "Gaming", href: "/" },
        ],
    },
    {
        id: 2, 
        name: "Fashion",
        subcategories: [
            { name: "Men's Clothing", href: "/" }, { name: "Women's Clothing", href: "/" },
            { name: "Shoes", href: "/" }, { name: "Accessories", href: "/" },
        ],
    },
    {
        id: 3, 
        name: "Home & Garden",
        subcategories: [
            { name: "Furniture", href: "/" }, { name: "Kitchen", href: "/" },
            { name: "Lighting", href: "/" }, { name: "Tools", href: "/" },
        ],
    },
]

const CategoriesMenu = () => {
    const [activeCategory, setActiveCategory] = useState(categoriesData[0])
    
    return (
        <div className="w-full p-2 bg-white shadow-md">
            <div className="flex w-full max-w-7xl mx-auto h-[200px] gap-1">
                {/* Left Column */}
                <div className="w-1/5 pr-2 overflow-y-auto custom-scrollbar">
                    <ul className="flex flex-col space-y-1">
                        {categoriesData.map((category) => (
                            <li key={category.id}>
                                <button
                                    onMouseEnter={() => setActiveCategory(category)}
                                    className={cn(`w-full text-left px-5 py-2 text-sm hover:cursor-pointer border-l-4 border-transparent ${
                                        activeCategory.id === category.id
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'text-gray-800 hover:bg-gray-50'
                                    }`)}
                                >
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Column */}
                <div className="w-4/5 pl-2 border-l border-gray-200 overflow-y-auto custom-scrollbar">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{activeCategory.name}</h3>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-2">
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
        </div>
    )
}

export default CategoriesMenu
