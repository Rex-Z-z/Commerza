"use client"

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, Truck, ShieldCheck, Store, ShoppingCart, Heart } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export default function ProductDetailsClient({ product }: { product: any }) {
  // State for selected options (e.g., { Color: 'Black', Size: '32x32' })
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.keys(product.availableOptions).forEach(key => {
      initial[key] = product.availableOptions[key][0];
    });
    return initial;
  });

  // Find the variant that matches all selected options
  const currentVariant = useMemo(() => {
    return product.variants.find((v: any) => 
      v.options.every((opt: any) => selectedOptions[opt.optionName] === opt.valueName)
    ) || product.variants[0];
  }, [selectedOptions, product.variants]);

  // Gallery: Priority to variant images, fallback to main product image
  const galleryImages = useMemo(() => {
    const variantImages = currentVariant.options.find((o: any) => o.images.length > 0)?.images;
    return variantImages && variantImages.length > 0 ? variantImages : [product.mainImage];
  }, [currentVariant, product.mainImage]);

  const [mainDisplayImage, setMainDisplayImage] = useState(galleryImages[0]);

  // Handle option click
  const handleOptionSelect = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
    // Reset display image to the first image of the new variant selection
    setMainDisplayImage(null); 
  };

  const displayImg = mainDisplayImage || galleryImages[0];

  return (
    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
      {/* Left: Image Gallery (Alibaba Style) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="aspect-square relative overflow-hidden rounded-xl border bg-white">
          <Image 
            src={displayImg} 
            alt={product.productName} 
            fill 
            className="object-contain p-4" 
            priority 
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {galleryImages.map((img: string, idx: number) => (
            <button 
              key={idx}
              onClick={() => setMainDisplayImage(img)}
              className={cn(
                "relative w-20 h-20 flex-shrink-0 border-2 rounded-md overflow-hidden bg-white",
                displayImg === img ? "border-primary" : "border-transparent"
              )}
            >
              <Image src={img} alt="thumbnail" fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Info & Selection (Amazon Style) */}
      <div className="lg:col-span-7 mt-8 lg:mt-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-primary font-bold text-lg">{product.brandName}</p>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{product.productName}</h1>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart size={24} />
          </Button>
        </div>

        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center text-yellow-500">
            <Star size={18} fill="currentColor" />
            <span className="ml-1 font-bold text-gray-900">{product.averageRating || "N/A"}</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
            {product.totalReviews} Reviews
          </span>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-xl">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-primary">${currentVariant.salePrice}</span>
            {currentVariant.discountPercentage > 0 && (
              <>
                <span className="text-lg text-gray-400 line-through">${currentVariant.price}</span>
                <Badge className="bg-red-500">-{currentVariant.discountPercentage}%</Badge>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">SKU: {currentVariant.sku} | Stock: {currentVariant.stockQuantity}</p>
        </div>

        {/* Dynamic Options Mapping */}
        <div className="mt-8 space-y-6">
          {Object.entries(product.availableOptions).map(([optionName, values]: any) => (
            <div key={optionName}>
              <h3 className="text-sm font-bold text-gray-900 mb-3">Select {optionName}: <span className="text-primary">{selectedOptions[optionName]}</span></h3>
              <div className="flex flex-wrap gap-2">
                {values.map((val: string) => (
                  <button
                    key={val}
                    onClick={() => handleOptionSelect(optionName, val)}
                    className={cn(
                      "px-4 py-2 text-sm font-medium border rounded-md transition-all",
                      selectedOptions[optionName] === val 
                        ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    )}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex gap-4">
          <Button className="flex-1 h-14 text-lg bg-orange-500 hover:bg-orange-600 shadow-lg">Buy Now</Button>
          <Button variant="outline" className="flex-1 h-14 text-lg border-primary text-primary hover:bg-primary/5">
            <ShoppingCart className="mr-2" size={20} /> Add to Cart
          </Button>
        </div>

        {/* Seller Info */}
        <div className="mt-8 border rounded-xl p-5 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Store className="text-gray-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{product.seller.storeName}</p>
              {product.seller.verified && <span className="text-xs text-green-600 flex items-center gap-1 font-semibold"><ShieldCheck size={12}/> Verified Supplier</span>}
            </div>
          </div>
          <Button variant="outline" size="sm">Contact</Button>
        </div>
      </div>
    </div>
  )
}