"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  Package,
  Bell,
  Settings,
  Headset,
  UserRound,
  Users,
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
} from "../icons/custom-icon";

interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: any;
}

const baseData = {
  navMain: [
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
          title: "Cart",
          url: "/products/cart",
        },
        {
          title: "Wishlist",
          url: "/products/wishlist",
        },
      ],
    },
    // --- TEAM SECTION ---
    {
      title: "Team",
      url: "#",
      icon: Users,
      roles: ["super_admin", "admin_company"], 
      items: [
        {
          title: "Manage Members",
          url: "/team",
          roles: ["super_admin", "admin_company"], // Both can see this
        },
        {
          title: "Company Admins", // Renamed for clarity
          url: "/team/company-admin",
          roles: ["super_admin"], // HIDDEN from admin_company
        },
      ],
    },
    // -------------------------
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
  user,
  ...props
}: DashboardSidebarProps) {
  const pathname = usePathname();

  // 1. Get User Roles safely
  const userRoles: string[] = React.useMemo(() => {
    if (!user) return [];
    if (Array.isArray(user.roles)) {
      return user.roles.map((r: any) => r.roleName || r.name);
    }
    if (user.role) {
      if (typeof user.role === 'string') return [user.role];
      return [user.role.roleName || user.role.name];
    }
    return [];
  }, [user]);
  
  const navMain = React.useMemo(() => {
    return baseData.navMain
      .filter((item) => {
        // Filter Main Group
        if (item.roles && item.roles.length > 0) {
           const hasAccess = item.roles.some(allowedRole => userRoles.includes(allowedRole));
           if (!hasAccess) return false;
        }
        return true;
      })
      .map((item) => {
        // Filter Sub-Items
        const filteredItems = item.items?.filter((subItem: any) => {
            if (subItem.roles && subItem.roles.length > 0) {
                return subItem.roles.some((r: string) => userRoles.includes(r));
            }
            return true;
        }) || [];

        const isChildActive = filteredItems.some(
          (subItem) => subItem.url === pathname
        );

        const isActive = item.url === pathname || isChildActive;

        return {
          ...item,
          isActive,
          items: filteredItems.map((subItem) => ({
            ...subItem,
            isActive: subItem.url === pathname,
          })),
        };
      });
  }, [pathname, userRoles]);

  const firstName = user?.userProfile?.firstName || "User"; 
  const lastName = user?.userProfile?.lastName || "";
  const email = user?.email || "user@example.com";

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]! border-r border-[#E5E5E7] text-gray-600 shadow-xs"
      collapsible="icon"
      {...props}
    >
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
                    src={user?.userProfile?.profileImage}
                    alt={`${firstName} ${lastName}`}
                  />
                  <AvatarFallback className="bg-gray-200 rounded-lg">
                      <UserRound className='size-6 text-gray-400'/>
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
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter className="px-0 bg-white">
        <NavFooter items={baseData.navFooter} />
      </SidebarFooter>
    </Sidebar>
  );
}