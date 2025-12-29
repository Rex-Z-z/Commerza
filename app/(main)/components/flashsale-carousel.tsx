// "use client"

import React, { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { getPublicProducts } from '@/app/actions/product'

const FlashsaleCarousel = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getPublicProducts(1, 10)
            if (data) setProducts(data)
        }
        fetchProducts()
    }, [])

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-semibold">Flash Sale</h2>
                    {/* Optional: Add a Countdown Timer for Alibaba feel */}
                    <div className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                        Ending Soon
                    </div>
                </div>
                <Button variant="link" asChild>
                    <Link href="/search"> View All </Link>
                </Button>
            </div>
            <Carousel
                opts={{ align: "start" }}
                className="w-full"
            >
                <CarouselContent>
                    {products.map((product: any) => (
                        <CarouselItem key={product.productUuid} className="basis-1/2 md:basis-1/4 lg:basis-1/6">
                            <Link href={`/products/${product.productUuid}`}>
                                <div className="p-1">
                                    <Card className="hover:shadow-lg transition-shadow duration-300">
                                        <CardContent className="flex flex-col p-0">
                                            <div className="relative aspect-square overflow-hidden rounded-t-xl bg-gray-100">
                                                <Image
                                                    src={product.mainImage || "/placeholder-product.png"}
                                                    alt={product.productName}
                                                    fill
                                                    className="object-cover"
                                                />
                                                {/* Discount Badge */}
                                              
                                            </div>
                                            <div className="p-3 flex flex-col gap-1">
                                                <h3 className="text-sm font-medium line-clamp-2 min-h-[40px]">
                                                    {product.productName}
                                                </h3>
                                                    <h3 className="text-sm font-medium line-clamp-2 min-h-[40px]">
                                                    {product.description}
                                                </h3>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-red-600 font-bold text-lg">
                                                        ${product.minPrice}
                                                    </span>
                                                    <span className="text-gray-400 line-through text-xs">
                                                        ${product.maxPrice}
                                                    </span>
                                                </div>
                        
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
            </Carousel>
        </div>
    )
}

export default FlashsaleCarousel