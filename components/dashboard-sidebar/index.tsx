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
    // --- TEAM SECTION (Protected) ---
    {
      title: "Team",
      url: "#",
      icon: Users,
      roles: ["SUPER_ADMIN", "COMPANY_ADMIN"], // Define allowed roles
      items: [
        {
          title: "Manage Members",
          url: "/dashboard/team",
        },
        {
          title: "Add Seller",
          url: "/dashboard/team/create",
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

  // 1. FIXED: Map 'roleName' instead of 'name' to match your Java Role model
  const userRoles: string[] = React.useMemo(() => {
    if (!user) return [];
    
    // Check if user.roles exists (List<Role> from Java)
    if (Array.isArray(user.roles)) {
      return user.roles.map((r: any) => r.roleName || r.name);
    }
    
    // Fallback if role is a single string or object property
    if (user.role) {
      return [typeof user.role === 'string' ? user.role : user.role.roleName || user.role.name];
    }

    return [];
  }, [user]);
  
  const navMain = React.useMemo(() => {
    return baseData.navMain
      .filter((item) => {
        // 2. Filter logic: If item has 'roles', check if user has at least one of them
        if (item.roles && item.roles.length > 0) {
           // Check if any of the user's roles match the allowed roles for this item
           const hasAccess = item.roles.some(allowedRole => userRoles.includes(allowedRole));
           return hasAccess;
        }
        return true; // Show items without role restrictions
      })
      .map((item) => {
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