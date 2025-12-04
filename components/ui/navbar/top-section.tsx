"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Store,
  ShoppingCart,
  Heart,
  Bell,
  SidebarIcon,
  LogOut,
  User as UserIcon,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/custom-icon";
import { useScroll } from "@/app/context/scroll-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/app/actions/auth";

interface TopSectionProps {
  page?: "default" | "search" | "dashboard";
  user?: any; // We accept the user object here
  isScrolled?: boolean;
}

const TopSection = ({ page = "default", user, isScrolled = false }: TopSectionProps) => {
  const { toggleSidebar } = useSidebar();
  const scrollContext = page === "default" ? useScroll() : { isScrolledPastSearch: false };
  const { isScrolledPastSearch } = scrollContext || { isScrolledPastSearch: false };
  
  const isSearchPage = page === "search";

  // Helper to get initials
  const getInitials = () => {
    if (!user?.userProfile) return "U";
    const { firstName, lastName } = user.userProfile;
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <div className="px-4 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="flex flex-row gap-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Logo />
        </a>

        {page === "dashboard" && (
          <Button className="hover:bg-accent/20" variant="ghost" size="icon" onClick={toggleSidebar}>
            <SidebarIcon className="text-white size-5" />
          </Button>
        )}
      </div>

      {page !== "dashboard" && (
        <div className={cn("flex flex-row items-center gap-2", (isScrolledPastSearch || isSearchPage) ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none")}>
          <SearchBar className="md:w-lg w-[200px]" />
          <Button variant="secondary" size="lg" className="rounded-full hover:text-primary/90 hover:bg-gray-100">
            <MapPin className="size-4" /> Location
          </Button>
        </div>
      )}

      {page === "dashboard" && <div className="grow" />}

      {/* User Actions */}
      <div className="flex flex-row items-center gap-2">
        {user ? (
          <>
             {/* Only show these if not on dashboard or if you want them everywhere */}
            {page !== "default" && page !== "dashboard" && (
              <Button
                variant="secondary"
                className="hover:text-primary/90 hover:bg-gray-100"
              >
                Start Selling
                <Store />
              </Button>
            )}
            
            <Button variant="outline" size="icon" className="text-white bg-transparent border-[#139ED3]/60 hover:bg-[#139ED3]/50 hover:text-white">
              <ShoppingCart />
            </Button>
            
            <Button variant="outline" size="icon" className="text-white bg-transparent border-[#139ED3]/60 hover:bg-[#139ED3]/50 hover:text-white">
              <Heart />
            </Button>
            
            <Button variant="outline" size="icon" className="text-white bg-transparent border-[#139ED3]/60 hover:bg-[#139ED3]/50 hover:text-white">
              <Bell />
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-white/20">
                    <AvatarImage src={user.userProfile?.profileUrl} alt="Profile" />
                    <AvatarFallback className="bg-[#139ED3] text-white">
                        {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.userProfile?.firstName} {user.userProfile?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <a href="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        Profile
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                    className="text-red-600 cursor-pointer"
                    onClick={() => logoutAction()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          /* Guest View */
          <>
            <Button variant="ghost" size="lg" className="text-white hover:text-white hover:bg-accent/20" asChild>
              <a href="/signup"> Sign Up </a>
            </Button>
            <Button variant="secondary" size="lg" className="hover:text-primary/90 hover:bg-gray-100" asChild>
              <a href="/login"> Login </a>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TopSection;