"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Store,
  ShoppingCart,
  Heart,
  SidebarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/custom-icon";
import { useScroll } from "@/app/context/scroll-context";
import ProfileButton from "./profile-button";
import NotificationButton from "./notification-button";

interface TopSectionProps {
  page?: "default" | "search" | "dashboard";
  login?: boolean;
  isScrolled?: boolean;
}

const TopSection = ({ page = "default", login = false, isScrolled = false }: TopSectionProps) => {
    const { toggleSidebar } = useSidebar();
    // Safe destructuring in case we are not inside the ScrollProvider (e.g. dashboard)
    const scrollContext = page === "default" ? useScroll() : { isScrolledPastSearch: false };
    const { isScrolledPastSearch } = scrollContext || { isScrolledPastSearch: false };
    
    const isSearchPage = page === "search";

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

            {/* Check if user is logged in */}
            {login ? (
                <div className="flex flex-row items-center gap-2">
                {page !== "default" && (
                    <Button variant="secondary" className="hover:text-primary/90 hover:bg-gray-100">
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
                
                <NotificationButton />

                {page === "default" && (
                    <ProfileButton />
                )}
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