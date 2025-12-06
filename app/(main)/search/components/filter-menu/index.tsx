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
import { Button } from '@/components/ui/button'

const Categories = [
    { id: 1, label: "Speakers" },
    { id: 2, label: "Gaming Speakers" },
    { id: 3, label: "Portable Speakers" },
    { id: 4, label: "Smart Speakers" },
    { id: 5, label: "Charging Stand & Holders" },
]

const data = [
	{
		title: "Color",
		items: [ 
            { id: "color-1", name: "Black" },
            { id: "color-2", name: "White" },
            { id: "color-3", name: "Red" },
            { id: "color-4", name: "Blue" },
            { id: "color-5", name: "Green" },
            { id: "color-6", name: "Yellow" },
            { id: "color-7", name: "Orange" },
            { id: "color-8", name: "Purple" },
            { id: "color-9", name: "Pink" },
            { id: "color-10", name: "Brown" },
        ]
	},
	{
		title: "Brand",
        showSearch: true, 
		items: [
			{ id: "brand-1", name: "Brand A" },
			{ id: "brand-2", name: "Brand B" },
			{ id: "brand-3", name: "Brand C" },
            { id: "brand-4", name: "Brand D" },
			{ id: "brand-5", name: "Brand E" },
			{ id: "brand-6", name: "Brand F" },
		]
	},
    {
		title: "Features",
		items: [
			{ id: "feat-1", name: "Bluetooth" },
			{ id: "feat-2", name: "Waterproof" },
			{ id: "feat-3", name: "WiFi 6" },
            { id: "feat-4", name: "NFC" },
			{ id: "feat-5", name: "GPS" },
			{ id: "feat-6", name: "USB-C" },
		]
	},
    {
        title: "Size",
        items: [
            { id: "size-1", name: "Small" },
            { id: "size-2", name: "Medium" },
            { id: "size-3", name: "Large" },
        ]
    }
];

const FilterMenu = ({className} : {className?: string}) => {
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

    const handleFilterChange = (title: string, ids: string[]) => {
        const newSelectedFilters = {
            ...selectedFilters,
            [title]: ids
        };
        setSelectedFilters(newSelectedFilters);
        console.log("Selected Filters:", newSelectedFilters);
    };
    
    return (
        <div className={cn('w-2/10 flex flex-col', className)}>
            <h1 className='text-2xl font-semibold'>Filters</h1>
            
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
            
            {/* Discount */}
            <div className='flex flex-col gap-1'>
                <p className='text-lg font-semibold'>Discount Range</p>
                <DiscountRangeForm />
            </div>
            
            {/* Options */}
            {data.map((filter) => {
                const currentSelections = selectedFilters[filter.title] || [];
                const isClearable = currentSelections.length > 0;

                return (
                    <Fragment key={filter.title}>
                        <Separator className="my-4" />
                        <div className='flex flex-col gap-1'>
                            <div className='flex flex-row justify-between items-center'>
                                <p className='text-lg font-semibold'>{filter.title}</p>
                                {isClearable && (
                                    <Button size="sm" variant="link" onClick={() => handleFilterChange(filter.title, [])} className="h-auto p-0">
                                        Clear
                                    </Button>
                                )}
                            </div>
                            <CheckboxFilter
                                items={filter.items}
                                showSearch={filter.showSearch || filter.items.length > 10} 
                                selectedIds={currentSelections}
                                onSelectionChange={(ids) => {
                                    handleFilterChange(filter.title, ids);
                                }}
                            />
                        </div>
                    </Fragment>
                )
            })}
        </div>
    )
}

export default FilterMenu