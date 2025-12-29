"use client"

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Star, 
  Truck, 
  ShieldCheck, 
  Store, 
  ShoppingCart, 
  Heart, 
  Info, 
  ChevronRight, 
  MapPin, 
  RotateCcw 
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function ProductDetailsClient({ product }: { product: any }) {
  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.keys(product.availableOptions || {}).forEach(key => {
      initial[key] = product.availableOptions[key][0];
    });
    return initial;
  });

  // Find the variant matching all selected options
  const currentVariant = useMemo(() => {
    return product.variants.find((v: any) => 
      v.options.every((opt: any) => selectedOptions[opt.optionName] === opt.valueName)
    ) || product.variants[0];
  }, [selectedOptions, product.variants]);

  // Gallery Logic
  const galleryImages = useMemo(() => {
    const variantImages = currentVariant.options.find((o: any) => o.images && o.images.length > 0)?.images;
    return variantImages && variantImages.length > 0 ? variantImages : [product.mainImage];
  }, [currentVariant, product.mainImage]);

  const [mainDisplayImage, setMainDisplayImage] = useState<string | null>(null);
  const displayImg = mainDisplayImage || galleryImages[0];

  const handleOptionSelect = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
    setMainDisplayImage(null); 
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* COLUMN 1: IMAGE GALLERY (col-span 5) */}
      <div className="lg:col-span-5 flex flex-col md:flex-row gap-4 lg:sticky lg:top-24">
        {/* Thumbnails on the left for Desktop */}
        <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto">
          {galleryImages.map((img: string, idx: number) => (
            <button 
              key={idx}
              onMouseEnter={() => setMainDisplayImage(img)}
              onClick={() => setMainDisplayImage(img)}
              className={cn(
                "relative w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden bg-white transition-all",
                displayImg === img ? "border-primary ring-1 ring-primary" : "border-gray-200 hover:border-primary"
              )}
            >
              <Image src={img} alt="thumbnail" fill className="object-contain p-1" />
            </button>
          ))}
        </div>

        {/* Main Image View */}
        <div className="flex-1 aspect-square relative overflow-hidden rounded-lg border border-gray-100 bg-white order-1 md:order-2">
          <Image 
            src={displayImg || '/placeholder.png'} 
            alt={product.productName} 
            fill 
            className="object-contain p-6 transition-transform duration-300 hover:scale-110" 
            priority 
          />
        </div>
      </div>

      {/* COLUMN 2: PRODUCT INFO (col-span 4) */}
      <div className="lg:col-span-4 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-blue-600 hover:underline cursor-pointer font-medium text-sm">
              Visit the {product.brandName} Store
            </p>
            <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 border shadow-sm"><Heart size={16} /></Button>
            </div>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
            {product.productName}
          </h1>
        </div>

        {/* Rating Section */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-orange-400">
            <Star size={18} fill="currentColor" />
            <span className="ml-1 font-bold text-gray-900">{product.averageRating || "0.0"}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <p className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer">
            {product.totalReviews} ratings
          </p>
        </div>

        <Separator />

        {/* Variant Selectors */}
        <div className="space-y-6">
          {Object.entries(product.availableOptions || {}).map(([optionName, values]: any) => (
            <div key={optionName}>
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                {optionName}: <span className="font-normal text-gray-600">{selectedOptions[optionName]}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {values.map((val: string) => (
                  <button
                    key={val}
                    onClick={() => handleOptionSelect(optionName, val)}
                    className={cn(
                      "px-4 py-1.5 text-sm border rounded shadow-sm transition-all",
                      selectedOptions[optionName] === val 
                        ? "border-orange-500 bg-orange-50 ring-1 ring-orange-500 text-gray-900" 
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Features / Short Description */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold">About this item</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
            {product.description.split('.').slice(0, 4).map((sentence: string, i: number) => (
                sentence.length > 5 && <li key={i}>{sentence.trim()}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* COLUMN 3: THE BUY BOX (col-span 3) */}
      <div className="lg:col-span-3">
        <div className="border border-gray-300 rounded-lg p-5 space-y-4 bg-white lg:sticky lg:top-24">
          
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
               <span className="text-sm font-medium self-start mt-1">$</span>
               <span className="text-3xl font-medium">{Math.floor(currentVariant.salePrice)}</span>
               <span className="text-sm font-medium self-start mt-1">{(currentVariant.salePrice % 1).toFixed(2).substring(2)}</span>
            </div>
            {currentVariant.discountPercentage > 0 && (
              <p className="text-sm text-gray-500">
                List Price: <span className="line-through">${currentVariant.price}</span>
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-sm">
                Delivery <span className="font-bold">Wednesday, Jan 1</span>
            </p>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-medium">
               <MapPin size={14} /> 
               <span className="hover:underline cursor-pointer">Deliver to Cambodia</span>
            </div>
          </div>

          <h3 className={cn(
            "text-lg font-bold",
            currentVariant.stockQuantity > 0 ? "text-green-700" : "text-red-600"
          )}>
            {currentVariant.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
          </h3>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button className="w-full h-10 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black border-none shadow-sm font-normal">
              Add to Cart
            </Button>
            <Button className="w-full h-10 rounded-full bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm font-normal">
              Buy Now
            </Button>
          </div>

          {/* Trust Details */}
          <div className="text-xs space-y-2 pt-4 border-t">
            <div className="flex justify-between">
                <span className="text-gray-500">Ships from</span>
                <span className="text-gray-900">{product.brandName} Store</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Sold by</span>
                <span className="text-gray-900">{product.seller.storeName}</span>
            </div>
            <div className="flex justify-between">
                <span className="text-gray-500">Returns</span>
                <span className="text-blue-600 flex items-center gap-1 hover:underline cursor-pointer">
                    Eligible for Return <RotateCcw size={10} />
                </span>
            </div>
          </div>

          {/* Seller Trust Card */}
          <div className="pt-4 mt-2">
             <div className="bg-gray-50 rounded p-3 border border-dashed border-gray-300">
                <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck size={16} className="text-orange-500" />
                    <span className="text-[10px] font-bold uppercase text-gray-500">Trade Assurance</span>
                </div>
                <p className="text-[10px] text-gray-500">Commerza protects your order from payment to delivery.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}