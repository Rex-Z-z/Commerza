"use client";

import React, { useContext } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  MapPin,
  Store,
  ShoppingCart,
  Heart,
  Bell,
  SidebarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/custom-icon";
import { ScrollContext } from "@/app/context/scroll-context"; 
import { useScroll } from "@/app/context/scroll-context";
import ProfileButton from "./profile-button";
import NotificationButton from "./notification-button";
import WishlistButton from "./wishlist-button";
import CartButton from "./cart-button";

// Isolated Component for Sidebar Trigger (Prevents useSidebar error)
const DashboardSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button 
      className="hover:bg-accent/20" 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar}
    >
      <SidebarIcon className="text-white size-5" />
    </Button>
  );
};

interface TopSectionProps {
  page?: "default" | "search" | "dashboard";
  user?: any;
  isScrolled?: boolean;
}

const TopSection = ({ page = "default", user = null, isScrolled = false }: TopSectionProps) => {
    // FIX: Use useContext instead of useScroll. 
    // This allows it to return null gracefully instead of throwing an error if provider is missing.
    const scrollContext = useContext(ScrollContext);
    
    // Only use the scroll state if we are in "default" mode AND the context exists
    const isScrolledPastSearch = (page === "default" && scrollContext) 
        ? scrollContext.isScrolledPastSearch 
        : false;
    
    const isSearchPage = page === "search";
    const isLoggedIn = !!user;

    return (
        <div className="px-4 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex flex-row gap-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Logo />
                </Link>

                {/* Only render Sidebar Trigger if we are on the Dashboard */}
                {page === "dashboard" && <DashboardSidebarTrigger />}
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

            {/* Check if user is logged in */}
            {isLoggedIn ? (
                <div className="flex flex-row items-center gap-2">
                {page !== "default" && (
                    <Button variant="secondary" className="hover:text-primary/90 hover:bg-gray-100">
                        Start Selling
                        <Store />
                    </Button>
                )}
                
                <CartButton />
                
                <WishlistButton />
                
                <NotificationButton />

                <ProfileButton user={user} />
                </div>
            ) : (
                <div className="flex flex-row items-center gap-2">
                    <Button variant="ghost" size="lg" className="text-white hover:text-white hover:bg-accent/20" asChild>
                        <a href="/signup"> Sign Up </a>
                    </Button>
                    <Button variant="secondary" size="lg" className="hover:text-primary/90 hover:bg-gray-100" asChild>
                        <a href="/login"> Login </a>
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TopSection;