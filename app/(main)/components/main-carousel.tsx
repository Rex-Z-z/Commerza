import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const MainCarousel = () => {
    return (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
            <CarouselContent>
                <CarouselItem className="basis-full">
                    <div className="p-1">
                        <Card className="p-0 overflow-hidden">
                        <CardContent className="p-0 h-[500px]">
                            <img 
                            src="https://ui.shadcn.com/placeholder.svg" 
                            alt="Image" 
                            className="w-full h-full object-cover block"
                            />
                        </CardContent>
                        </Card>
                    </div>
                </CarouselItem>

                <CarouselItem className="basis-full">
                    <div className="p-1">
                        <Card className="p-0 overflow-hidden">
                        <CardContent className="p-0 h-[500px]">
                            <img 
                            src="https://ui.shadcn.com/placeholder.svg" 
                            alt="Image" 
                            className="w-full h-full object-cover"
                            />
                        </CardContent>
                        </Card>
                    </div>
                </CarouselItem>

                <CarouselItem className="basis-full">
                    <div className="p-1">
                        <Card className="p-0 overflow-hidden">
                        <CardContent className="p-0 h-[500px]">
                            <img 
                            src="https://ui.shadcn.com/placeholder.svg" 
                            alt="Image" 
                            className="w-full h-full object-cover"
                            />
                        </CardContent>
                        </Card>
                    </div>
                </CarouselItem>

                <CarouselItem className="basis-full">
                    <div className="p-1">
                        <Card className="p-0 overflow-hidden">
                        <CardContent className="p-0 h-[500px]">
                            <img
                            src="https://ui.shadcn.com/placeholder.svg"
                            alt="Image"
                            className="w-full h-full object-cover"
                            />
                        </CardContent>
                        </Card>
                    </div>
                </CarouselItem>

                <CarouselItem className="basis-full">
                    <div className="p-1">
                        <Card className="p-0 overflow-hidden">
                        <CardContent className="p-0 h-[500px]">
                            <img 
                            src="https://ui.shadcn.com/placeholder.svg" 
                            alt="Image" 
                            className="w-full h-full object-cover"
                            />
                        </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}

export default MainCarousel
