"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  DollarSign,
  Bell,
  Settings,
  Headset,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NavFooter from "./nav-footer";
import { NavMain } from "./nav-main";
import {
  DashboardIcon,
  DollarIcon,
  VerifyIdentityIcon,
} from "../icons/custom-icon";

const baseData = {
  navMain: [
    {
      title: "Verify",
      url: "/verify-company",
      icon: VerifyIdentityIcon,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
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
          url: "/products/order",
        },
        {
          title: "Wishlist",
          url: "/products/wishlist",
        },
      ],
    },
    {
      title: "Finances",
      url: "/finance",
      icon: DollarIcon,
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
      icon: Headset,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const navMain = React.useMemo(() => {
    return baseData.navMain.map((item) => {
      const isChildActive = item.items?.some(
        (subItem) => subItem.url === pathname
      );

      const isActive = item.url === pathname || isChildActive;

      return {
        ...item,
        isActive,
        items: item.items?.map((subItem) => ({
          ...subItem,
          isActive: subItem.url === pathname,
        })),
      };
    });
  }, [pathname]);

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-r border-[#E5E5E7] text-gray-600 shadow-xs"
      collapsible="icon"
      {...props}
    >
      {/* Profile */}
      <SidebarHeader className="bg-white">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="py-8 hover:bg-gray-50"
              asChild
            >
              <a
                href="/profile"
                className="flex gap-3 items-center cursor-pointer"
              >
                <Avatar className="h-12 w-12 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 rounded-full">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Chou Seangly"
                  />
                  <AvatarFallback className="rounded-lg">CS</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                  <span className="truncate text-md font-bold">
                    Chou Seangly
                  </span>
                  <span className="truncate text-xs text-gray-400">
                    seangly@example.com
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="bg-white">
        <NavMain items={navMain} />
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-0 bg-white">
        <NavFooter items={baseData.navFooter} />
      </SidebarFooter>
    </Sidebar>
  );
}
