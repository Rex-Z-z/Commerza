import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const FlashsaleCarousel = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold">Flash Sale</h2>
                <Button variant="link" asChild>
                    <a href="/"> View All </a>
                </Button>
            </div>
            <Carousel
            opts={{
                align: "start",
            }}
            className="w-full"
            >
                <CarouselContent>
                    {Array.from({ length: 10 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-1/6">
                        <div className="p-1">
                        <Card>
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                            <span className="text-3xl font-semibold">{index + 1}</span>
                            </CardContent>
                        </Card>
                        </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    )
}

export default FlashsaleCarousel
