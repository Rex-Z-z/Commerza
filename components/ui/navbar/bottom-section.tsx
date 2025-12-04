"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import CategoriesMenu from "./categories-menu";
import MarketPlace from "./market-place";
import HelpCenter from "./help-center";
import {
  Store,
  ShoppingBasket,
  MessageCircleQuestionMark,
  Menu,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

interface BottomSectionProps {
  page?: "default" | "search" | "dashboard";
  isScrolled: boolean;
}

const BottomSection = ({ page = "default", isScrolled }: BottomSectionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSearchPage = page === "search";

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
    }, 200);
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
    }, 200);
  };

  const handleLinkEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveIndex(null);
  };

  const menuContentMap: { [key: string]: React.ComponentType } = {
    categories: CategoriesMenu,
    marketplace: MarketPlace,
    help: HelpCenter,
  };

  const activeMenuId = activeIndex !== null ? menuItems[activeIndex]?.id : null;

  return (
    <>
      <div
        className={cn(
          `block px-4`,
          isScrolled ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0",
          page === "dashboard" && "hidden"
        )}
      >
        <Separator className="bg-[#139ED3]" />
      </div>

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
    </>
  );
};

export default BottomSection;