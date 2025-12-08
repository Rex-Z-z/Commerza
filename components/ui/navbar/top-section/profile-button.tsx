"use client";

import React from 'react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../hover-card'
import { Button } from '../../button'
import { Avatar, AvatarFallback, AvatarImage } from '../../avatar'
import { Bell, Heart, LogOut, Settings, ShoppingCart, UserRound } from 'lucide-react'
import { Separator } from '../../separator'
import { DashboardIcon } from '@/components/icons/custom-icon'
import { logoutAction } from '@/app/actions/auth' // Ensure this action exists

interface ProfileButtonProps {
    user?: any;
}

const ProfileButton = ({ user }: ProfileButtonProps) => {
    const firstName = user?.userProfile?.firstName || "User"; 
    const lastName = user?.userProfile?.lastName || "";
    const email = user?.email || "user@example.com";
    const initials = (firstName[0] || "U") + (lastName[0] || "");

    return (
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <Button variant="outline" size="icon" className="text-white bg-transparent border-[#139ED3]/60 hover:bg-[#139ED3]/50 hover:text-white">
                    <UserRound />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent align="end" className='p-2 w-64'>
                <Button variant="ghost" size="lg" className='w-full justify-start py-7' asChild>
                    <a href="/profile" className="flex gap-2 items-center cursor-pointer">
                        <Avatar className="h-10 w-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 rounded-full">
                            <AvatarImage
                                src={user?.userProfile?.profileImage}
                                alt="User"
                            />
                            <AvatarFallback className="bg-gray-200 rounded-lg">
                                <UserRound className='size-4.5 text-gray-400'/>
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                            <span className="truncate text-md font-bold">
                                {firstName} {lastName}
                            </span>
                            <span className="truncate text-xs text-gray-400">
                                {email}
                            </span>
                        </div>
                    </a>
                </Button>

                <Separator className="my-3" />

                <div className='flex flex-col gap-1'>
                    <Button variant="ghost" size="sm" className='justify-start' asChild>
                        <a href="/dashboard">
                            <DashboardIcon className='mr-1.5 mt-[0.8px]'/>
                            Dashboard
                        </a>
                    </Button>

                    <Button variant="ghost" size="sm" className='justify-start' asChild>
                        <a href="/dashboard">
                            <Bell className='mr-1.5 mt-[0.8px]'/>
                            Notification
                        </a>
                    </Button>

                    <Button variant="ghost" size="sm" className='justify-start' asChild>
                        <a href="/dashboard">
                            <ShoppingCart className='mr-1.5 mt-[0.8px]'/>
                            Cart
                        </a>
                    </Button>

                    <Button variant="ghost" size="sm" className='justify-start' asChild>
                        <a href="/products/wishlist">
                            <Heart className='mr-1.5 mt-[0.8px]' />
                            Favorite
                        </a>
                    </Button>

                    <Button variant="ghost" size="sm" className='justify-start' asChild>
                        <a href="/settings">
                            <Settings className='mr-1.5' />
                            Setting
                        </a>
                    </Button>
             {/* logout all devices */}

                    <form action={logoutAction} className="w-full">
                        <Button variant="ghost" size="sm" className='w-full justify-start text-red-600 hover:text-white hover:bg-red-500' type="submit">
                            <LogOut className='mr-1.5'/>
                            Sign out  
                        </Button>
                    </form>
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default ProfileButton



 