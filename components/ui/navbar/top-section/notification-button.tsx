import React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../hover-card'
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area" // Import ScrollArea
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Button } from '../../button'
import { Bell, ShieldAlertIcon, InfoIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar'
import { Separator } from '../../separator'

const notificationData = [
    {
        id: 1,
        title: "Security Alert",
        description: "New login detected from unknown device.",
        icon: <ShieldAlertIcon />,
    },
    {
        id: 2,
        title: "System Update",
        description: "Commerza has been updated to version 2.0. Please update now.",
        icon: <InfoIcon />,
    },
    {
        id: 3,
        title: "Security Alert",
        description: "Password changed successfully.",
        icon: <ShieldAlertIcon />,
    },
    {
        id: 4,
        title: "System Update",
        description: "Commerza has been updated to version 2.0.",
        icon: <InfoIcon />,
    },
    {
        id: 5,
        title: "Security Alert",
        description: "New login detected from unknown device.",
        icon: <ShieldAlertIcon />,
    }
]

const messageData = [
    {
        id: 1,
        name: "Chou Seangly",
        message: "Hello, how are you?",
        avatar: "https://github.com/shadcn.png",
        initials: "CS",
        time: "2 hours ago"
    },
    {
        id: 2,
        name: "Sarah Chen",
        message: "How's it going?",
        avatar: "",
        initials: "SC",
        time: "5 hours ago"
    },
    {
        id: 3,
        name: "John Doe",
        message: "Please check your email.",
        avatar: "",
        initials: "JD",
        time: "1 day ago"
    },
    {
        id: 4,
        name: "Jonathan Smith",
        message: "Could you send me the invoice? Shouldn't be too hard.",
        avatar: "",
        initials: "JS",
        time: "2 days ago"
    },
    {
        id: 5,
        name: "Henry Johnson",
        message: "Please check your email.",
        avatar: "",
        initials: "HJ",
        time: "3 day ago"
    },
    {
        id: 6,
        name: "Emily Davis",
        message: "Could you send me the invoice?",
        avatar: "",
        initials: "ED",
        time: "7 days ago"
    }
]

const NotificationButton = () => {
    return (
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button variant="outline" size="icon" className="text-white bg-transparent border-[#139ED3]/60 hover:bg-[#139ED3]/50 hover:text-white">
                    <Bell />
                </Button>
            </HoverCardTrigger>
            
            <HoverCardContent align="end" className='w-96 p-0'>
                <Tabs defaultValue="notification" className="flex flex-col w-full">
                    <div className="p-2 border-b">
                        <TabsList className='w-full'>
                            <TabsTrigger value="notification" className="flex-1">Notification</TabsTrigger>
                            <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
                        </TabsList>
                    </div>
                    
                    {/* Notification */}
                    <TabsContent value="notification" className='flex-1 overflow-hidden mt-0'>
                        <div className="flex justify-end items-center">
                            <Button variant="link" size="sm" className='px-0 py-0 mr-4'>Mark read all</Button>
                        </div>
                        
                        <ScrollArea className="h-[300px]">
                            <div className="flex flex-col gap-1.5 p-2">
                                {notificationData.map((item) => (
                                    <a href="/notification" key={item.id}>
                                        <Item variant="muted" className='hover:bg-gray-200/60 p-2'>
                                            <ItemMedia variant="icon" className='mt-0.5'>
                                                {item.icon}
                                            </ItemMedia>
                                            <ItemContent>
                                                <ItemTitle className='text-sm'>{item.title}</ItemTitle>
                                                <ItemDescription className='text-xs line-clamp-1'>
                                                    {item.description}
                                                </ItemDescription>
                                            </ItemContent>
                                        </Item>
                                    </a>
                                ))}
                            </div>
                        </ScrollArea>
                        
                        <Separator className='my-1'/>
                        
                        <div className="pb-1.5">
                            <Button variant="link" className="w-full">See all notifications</Button>
                        </div>
                    </TabsContent>
                    
                    {/* Messages */}
                    <TabsContent value="messages" className='flex-1 overflow-hidden mt-0'>
                        <div className="flex justify-end items-center">
                            <Button variant="link" size="sm" className='px-0 py-0 mr-4'>Mark read all</Button>
                        </div>
                        
                        <ScrollArea className="h-[300px]">
                            <div className='flex flex-col gap-1 p-3'>
                                {messageData.map((msg) => (
                                    <div key={msg.id} className='flex flex-row hover:bg-gray-200/60 rounded-md p-2 transition-colors'>
                                        <a href='/notification' className='w-full flex flex-row gap-2'>
                                            <Avatar className="h-10 w-10 rounded-full">
                                                <AvatarImage src={msg.avatar} alt={msg.name} />
                                                <AvatarFallback className="rounded-lg">{msg.initials}</AvatarFallback>
                                            </Avatar>
                                            <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                                                <span className="truncate text-md font-medium">{msg.name}</span>
                                                <span className="truncate text-xs text-gray-400 max-w-[210px]">"{msg.message}"</span>
                                            </div>
                                        </a>
                                        <div className='flex items-center justify-end min-w-[60px]'>
                                            <span className='text-xs text-gray-400 whitespace-nowrap'>{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        
                        <Separator className='my-1'/>

                        <div className="pb-1.5">
                            <Button variant="link" className="w-full">See all notifications</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </HoverCardContent>
        </HoverCard>
    )
}

export default NotificationButton