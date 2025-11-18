"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Bell,
  Settings,
  Headset,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import NavFooter from "./nav-footer"
import { NavMain } from "./nav-main"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "#",
      icon: Package,
      items: [
        {
          title: "Products",
          url: "#",
        },
        {
          title: "Order",
          url: "#",
        },
        {
          title: "Wishlist",
          url: "#",
        },
      ],
    },
    {
      title: "Finances",
      url: "#",
      icon: DollarSign,
    },
    {
      title: "Notifications",
      url: "#",
      icon: Bell,
    },
  ],
  navFooter: [
    {
      title: "Support",
      url: "#",
      icon: Headset
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings
    },
  ],
}

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      {/* Profile */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="Chou Seangly" />
                <AvatarFallback className="rounded-lg">CS</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Chou Seangly</span>
                <span className="truncate text-xs">seangly@example.com</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      
      {/* Footer */}
      <SidebarFooter>
        <NavFooter items={data.navFooter} />
      </SidebarFooter>
    </Sidebar>
  )
}