"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Package,
  DollarSign,
  User,
  Bell,
} from "lucide-react"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  { title: "Products", href: "/products", icon: Package },
  { title: "Finance", href: "/finance", icon: DollarSign },
  { title: "Profile", href: "/profile", icon: User },
  { title: "Notification", href: "/notification", icon: Bell },
]

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-[var(--header-height)] h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={item.isActive}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}