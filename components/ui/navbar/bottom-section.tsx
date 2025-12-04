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

const BottomSection = ({
  page = "default",
  login = false,
}: {
  page?: "default" | "search" | "dashboard";
  login?: boolean;
}) => {
    return (
        <div>
        
        </div>
    )
}

export default BottomSection
