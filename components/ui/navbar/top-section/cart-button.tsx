import { useState } from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../hover-card'
import { Button } from '../../button'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar'
import { Separator } from '../../separator'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from '../../input'
import { NumberField, NumberFieldScrubArea } from '../../base-number-field'

const cartData = [
    {
        id: 1,
        name: "Wireless Headset",
        variant: "Color Black",
        price: "$ 2,000",
        image: "https://hyperx.com/cdn/shop/files/hyperx_cloud_iii_black_66x0048_main_1_a504d45d-2b50-46f5-8dec-844d5daa353f.jpg?v=1764246358",
    },
    {
        id: 2,
        name: "Wireless Headset",
        variant: "Color Black",
        price: "$ 2,000",
        image: "https://hyperx.com/cdn/shop/files/hyperx_cloud_iii_black_66x0048_main_1_a504d45d-2b50-46f5-8dec-844d5daa353f.jpg?v=1764246358",
    },
    {
        id: 3,
        name: "Gaming Mouse",
        variant: "Color White",
        price: "$ 150",
        image: "https://hyperx.com/cdn/shop/files/hyperx_cloud_iii_black_66x0048_main_1_a504d45d-2b50-46f5-8dec-844d5daa353f.jpg?v=1764246358",
    },
    {
        id: 4,
        name: "Wireless Headset",
        variant: "Color Black",
        price: "$ 2,000",
        image: "https://hyperx.com/cdn/shop/files/hyperx_cloud_iii_black_66x0048_main_1_a504d45d-2b50-46f5-8dec-844d5daa353f.jpg?v=1764246358",
    }
]

const CartButton = () => {
    const [value, setValue] = useState(1)

    const decrease = () => setValue((v) => Math.max(0, v - 1))
    const increase = () => setValue((v) => v + 1)

    return (
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button variant="outline" size="icon" className="text-white bg-transparent border-[#139ED3]/60 hover:bg-[#139ED3]/50 hover:text-white">
                    <ShoppingCart />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent align="end" className='w-120 p-2'>
                <div className='p-2'>
                    <span className='text-xl font-semibold'>Your Cart</span>
                </div>

                <Separator className='my-1.5'/>

                <ScrollArea className="h-72">
                    <div className='flex flex-col gap-1.5 pr-3'>
                        {cartData.map((item) => (
                            <a key={item.id} href='#' className='flex flex-row justify-between p-1.5 hover:bg-gray-100/50 rounded-md transition-colors'>
                                <div className='flex flex-row gap-2'>
                                    <Avatar className="h-20 w-20 rounded-sm">
                                        <AvatarImage
                                            src={item.image}
                                            alt={item.name}
                                        />
                                        <AvatarFallback className="rounded-lg">P</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col py-2 gap-0.5'>
                                        <span className='text-[15px] font-medium'>{item.name}</span>
                                        <span className='text-xs text-gray-400 mb-0.5'>{item.variant}</span>
                                        <span className='text-sm font-medium text-gray-700'>{item.price}</span>
                                    </div>
                                </div>
                                <div className='flex items-center mr-2.5'>
                                    <div className="space-y-2">
                                        <NumberField size="sm" className="mx-auto" defaultValue={1} min={0} max={100}>
                                            <NumberFieldScrubArea></NumberFieldScrubArea>
                                        </NumberField>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </ScrollArea>

                <Separator className='my-2.5'/>

                <div className='flex flex-row justify-between'>
                    <Button variant="outline" size="sm">
                        <a href="#">Continue Shopping</a>
                    </Button>
                    
                    <Button variant="default" size="sm" className='font-normal' asChild>
                        <a href="#">
                            <ShoppingCart />
                            Checkout
                        </a>
                    </Button>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default CartButton
