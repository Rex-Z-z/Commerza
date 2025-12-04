"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import CategoriesMenu from "./categories-menu";
import MarketPlace from "./market-place";
import HelpCenter from "./help-center";
import {
  MapPin,
  Store,
  ShoppingBasket,
  MessageCircleQuestionMark,
  Menu,
  SidebarIcon,
  ShoppingCart,
  Heart,
  Bell,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "../separator";
import { useScroll } from "@/app/context/scroll-context";
import { SearchBar } from "@/components/ui/search-bar";
import { useSidebar } from "../sidebar";
import { Logo } from "@/components/icons/custom-icon";

const menuItems = [
  {
    id: "categories",
    label: "All Categories",
    icon: <Menu className="size-4 mr-2" />,
  },
  {
    id: "marketplace",
    label: "Marketplace",
    icon: <ShoppingBasket className="size-4 mr-2" />,
  },
  {
    id: "seller",
    label: "Became a Supplier",
    icon: <Store className="size-4 mr-2" />,
    align: "right",
    href: "/become-supplier",
  },
  {
    id: "help",
    label: "Help Center",
    icon: <MessageCircleQuestionMark className="size-4 mr-2" />,
    align: "right",
  },
];

const borderBottomStyle =
  "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100";
const borderBottomLinkStyle =
  "flex items-center py-5 px-4 text-sm font-medium text-white cursor-pointer relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-white after:scale-x-0 after:origin-center after:transition-transform after:duration-300 after:ease-in-out";

// --- Main Component ---
const NavBar = ({
  page = "default",
  login = false,
}: {
  page?: "default" | "search" | "dashboard";
  login?: boolean;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const isSearchPage = page === "search";
  const { toggleSidebar } = useSidebar();

  const { isScrolledPastSearch = false } =
    page === "default" ? useScroll() : {};

  const handleTriggerEnter = (menuId: string) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    const newIndex = menuItems.findIndex((item) => item.id === menuId);
    setActiveIndex(newIndex);
  };

  const handleTriggerLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveIndex(null);
    }, 200); // 200ms delay
  };

  const handleDropdownEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleDropdownLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveIndex(null);
    }, 200); // 200ms delay
  };

  const menuContentMap: { [key: string]: React.ComponentType } = {
    categories: CategoriesMenu,
    marketplace: MarketPlace,
    help: HelpCenter,
  };

  const handleLinkEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveIndex(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeMenuId = activeIndex !== null ? menuItems[activeIndex]?.id : null;

  // --- Main Render ---
  return (
    <div
      className={cn(
        `flex flex-col bg-[#35B9EC] border-b border-transparent sticky top-0 z-20`,
        isScrolled ? "shadow-md" : "",
        page === "dashboard" ? "" : "h-(--header-height)"
      )}
    >
      {/* Top Section */}
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
          <div  className={cn("flex flex-row items-center gap-2",isScrolledPastSearch || isSearchPage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none")}>
            <SearchBar className="md:w-lg w-[200px]" />
            <Button variant="secondary" size="lg" className="rounded-full hover:text-primary/90 hover:bg-gray-100">
              <MapPin className="size-4" /> Location
            </Button>
          </div>
        )}

        {page === "dashboard" && <div className="grow" />}

        {/* Check if user is logged in */}
        {login ? (
          // Show user profile and other button
          <div className="flex flex-row items-center gap-2">
            {page !== "default" && (
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

            {page === "default" && (
              <Button variant="outline" size="icon" className="text-white bg-transparent border-[#139ED3]/60 hover:bg-[#139ED3]/50 hover:text-white">
                <UserRound />
              </Button>
            )}
          </div>
        ):(
          // Show sign up and login buttons
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

      <div
        className={cn(
          `block px-4`,
          isScrolled ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0",
          page === "dashboard" && "hidden"
        )}
      >
        <Separator className="bg-[#139ED3]" />
      </div>

      {/* Bottom Section */}
      <div
        onMouseLeave={handleTriggerLeave}
        className={cn(
          "transition-all duration-300 ease-in-out overflow-hidden",
          isScrolled || isSearchPage || page === "dashboard"
            ? "max-h-0 opacity-0"
            : "max-h-20 opacity-100"
        )}
      >
        <div className="flex items-center justify-between w-full">
          {/* Left-aligned triggers */}
          <div className="flex items-center">
            {menuItems
              .filter((item) => item.align !== "right")
              .map((item) =>
                item.href ? (
                  <a
                    key={item.id}
                    href={item.href}
                    onMouseEnter={handleLinkEnter}
                    className={cn(borderBottomStyle)}
                  >
                    {item.icon} {item.label}
                  </a>
                ) : (
                  <div
                    key={item.id}
                    onMouseEnter={() => handleTriggerEnter(item.id)}
                    className={cn(
                      borderBottomLinkStyle,
                      activeMenuId === item.id && "after:scale-x-100"
                    )}
                  >
                    {item.icon} {item.label}
                  </div>
                )
              )}
          </div>

          {/* Right-aligned triggers */}
          <div className="flex items-center">
            {menuItems
              .filter((item) => item.align === "right")
              .map((item) =>
                item.href ? (
                  <a
                    key={item.id}
                    href={item.href}
                    onMouseEnter={handleLinkEnter}
                    className={cn(borderBottomStyle)}
                  >
                    {item.icon} {item.label}
                  </a>
                ) : (
                  <div
                    key={item.id}
                    onMouseEnter={() => handleTriggerEnter(item.id)}
                    className={cn(
                      borderBottomLinkStyle,
                      activeMenuId === item.id && "after:scale-x-100"
                    )}
                  >
                    {item.icon} {item.label}
                  </div>
                )
              )}
          </div>
        </div>

        {/* --- Full-Width Animated Dropdown Container --- */}
        <div
          className={cn(
            "absolute left-0 top-full w-full transition-all duration-300 ease-in-out",
            activeIndex !== null
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          )}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <div className="w-full relative h-[300px] overflow-hidden">
            {menuItems.map((item, index) => {
              if (item.href) return null;

              const MenuContent = menuContentMap[item.id];
              if (!MenuContent) return null;

              const isActive = index === activeIndex;

              let positionClasses = "";
              if (activeIndex === null) {
                positionClasses = "opacity-0 translate-x-0 pointer-events-none";
              } else if (index < activeIndex) {
                positionClasses =
                  "opacity-0 -translate-x-full pointer-events-none";
              } else if (index > activeIndex) {
                positionClasses =
                  "opacity-0 translate-x-full pointer-events-none";
              } else {
                positionClasses = "opacity-100 translate-x-0";
              }

              return (
                <div
                  key={item.id}
                  className={cn(
                    "absolute top-0 left-0 w-full transition-all duration-300 ease-in-out",
                    positionClasses
                  )}
                >
                  <MenuContent />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;