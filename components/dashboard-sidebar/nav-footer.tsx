"use client"

import React, { type ElementType } from 'react'
import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const NavFooter = ({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: ElementType
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) => {
  return (
    <SidebarGroup className='px-0 group-data-[collapsible=icon]:p-2'>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className="py-5 rounded-none group-data-[collapsible=icon]:rounded-md" asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </SidebarGroup>
  )
}

export default NavFooter