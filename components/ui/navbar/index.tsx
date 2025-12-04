"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import TopSection from "./top-section";
import BottomSection from "./bottom-section";

const NavBar = ({
  page = "default",
  user = null, // Changed from login boolean to user object
}: {
  page?: "default" | "search" | "dashboard";
  user?: any; // Receive user data
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={cn(`flex flex-col bg-[#35B9EC] border-b border-transparent sticky top-0 z-20`, isScrolled ? "shadow-md" : "", page === "dashboard" ? "" : "h-(--header-height)")}
    >
      <TopSection page={page} user={user} isScrolled={isScrolled} />
      <BottomSection page={page} isScrolled={isScrolled} />
    </div>
  );
};

export default NavBar;