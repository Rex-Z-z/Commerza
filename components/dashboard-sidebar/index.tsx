"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
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

// Define the base data structure with correct URLs
const baseData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
      items: [
        {
          title: "All Products",
          url: "/products",
        },
        {
          title: "Order",
          url: "/products/order", // Assumed path based on standard structure
        },
        {
          title: "Wishlist",
          url: "/products/wishlist", // Assumed path
        },
      ],
    },
    {
      title: "Finances",
      url: "/finance",
      icon: DollarSign,
    },
    {
      title: "Notifications",
      url: "/notification",
      icon: Bell,
    },
  ],
  navFooter: [
    {
      title: "Support",
      url: "/support",
      icon: Headset
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings
    },
  ],
}

export function DashboardSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const navMain = React.useMemo(() => {
    return baseData.navMain.map((item) => {
      const isChildActive = item.items?.some(
        (subItem) => subItem.url === pathname
      );
      
      const isActive = item.url === pathname || isChildActive;

      return {
        ...item,
        isActive, // Parent active state (expands menu)
        items: item.items?.map((subItem) => ({
          ...subItem,
          isActive: subItem.url === pathname,
        })),
      };
    });
  }, [pathname]);

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! text-gray-600 shadow-md"
      {...props}
    >
      {/* Profile */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="py-8">
              <Avatar className="h-12 w-12 rounded-full">
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
        <NavMain items={navMain} />
      </SidebarContent>
      
      {/* Footer */}
      <SidebarFooter className="px-0">
        <NavFooter items={baseData.navFooter} />
      </SidebarFooter>
    </Sidebar>
  )
}