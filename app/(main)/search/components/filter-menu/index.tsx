'use client'

import { Fragment, useState } from 'react'
import { cn } from '@/lib/utils'
import { Info } from 'lucide-react'
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from '@/components/ui/scroll-area'
import PriceRangeForm from './price-range-form'
import DiscountRangeForm from './discount-range-form'
import { CheckboxFilter } from './checkbox-filter'

const Categories = [
    { id: 1, label: "Women's Sets" },
    { id: 2, label: "Traditional Muslim Clothing&Accessories" },
    { id: 3, label: "Muslim Clothing&Accessories" },
    { id: 4, label: "Traditional Muslim Clothing&Accessories" },
    { id: 5, label: "Women's Sets" },
    { id: 6, label: "Women's Sets" },
    { id: 7, label: "Traditional Muslim Clothing&Accessories" },
    { id: 8, label: "Muslim Clothing&Accessories" },
    { id: 9, label: "Traditional Muslim Clothing&Accessories" },
    { id: 10, label: "Women's Sets" },
]

const colors = [
    { id: "1", name: "Black" },
    { id: "2", name: "White" },
    { id: "3", name: "Red" },
    { id: "4", name: "Blue" },
    { id: "5", name: "Green" },
    { id: "6", name: "Yellow" },
    { id: "7", name: "Orange" },
    { id: "8", name: "Purple" },
    { id: "9", name: "Pink" },
    { id: "10", name: "Brown" },
];

const FilterMenu = ({className} : {className?: string}) => {
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    
    return (
        <div className={cn('w-2/10 flex flex-col', className)}>
            <h1 className='text-2xl font-semibold'>Filter</h1>
            
            <Separator className="my-4" />
            
            {/* Supplier */}
            <div className='flex flex-col gap-3'>
                <p className='text-lg font-semibold'>Supplier features</p>
                <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className='font-normal'>
                        Verify supplier
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className='size-4'/>
                            </TooltipTrigger>
                            <TooltipContent>This is content in a tooltip.</TooltipContent>
                        </Tooltip>
                    </Label>
                </div>
                <div className="flex items-center gap-3">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms" className='font-normal'>
                        Verify supplier Pro
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className='size-4'/>
                            </TooltipTrigger>
                            <TooltipContent>This is content in a tooltip.</TooltipContent>
                        </Tooltip>
                    </Label>
                </div>
            </div>

            <Separator className="my-4" />
            
            {/* Rating */}
            <div className='flex flex-col gap-3'>
                <p className='text-lg font-semibold'>Store reviews</p>
                <RadioGroup defaultValue="5">
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="5" id="5"/>
                        <Label htmlFor="5" className='font-normal'>
                            5.0
                        </Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="4.5" id="4.5"/>
                        <Label htmlFor="terms" className='font-normal'>
                            4.5 & up
                        </Label>
                    </div>
                    <div className="flex items-center gap-3">
                        <RadioGroupItem value="4" id="4"/>
                        <Label htmlFor="terms" className='font-normal'>
                            4.0 & up
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <Separator className="my-4" />

            {/* Categories */}
            <div className='flex flex-col gap-1'>
                <p className='text-lg font-semibold'>Categories</p>
                <ScrollArea className="h-38">
                    <div>
                        {Categories.map((category) => (
                            <Fragment key={category.id}>
                                <div className="text-md mb-1">
                                    <a href="#" className='hover:underline'>{category.label}</a>
                                </div>
                            </Fragment>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <Separator className="my-4" />

            {/* Price */}
            <div className='flex flex-col gap-1'>
                <p className='text-lg font-semibold'>Price Range</p>
                <PriceRangeForm />
            </div>

            <Separator className="my-4" />

            <div className='flex flex-col gap-1'>
                <p className='text-lg font-semibold'>Discount Range</p>
                <DiscountRangeForm />
            </div>

            <Separator className="my-4" />

            <div className='flex flex-col gap-1'>
                <p className='text-lg font-semibold'>Color</p>
                <CheckboxFilter
                    items={colors}
                    showSearch={false}
                    onSelectionChange={(ids) => {
                        console.log("Selected suppliers:", ids);
                        setSelectedColors(ids);
                    }}
                />
            </div>
        </div>
    )
}

export default FilterMenu