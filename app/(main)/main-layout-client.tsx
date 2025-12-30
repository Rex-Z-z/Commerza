"use client";

import React from "react";
import NavBar from "@/components/ui/navbar";
import { ScrollProvider } from "@/app/context/scroll-context";
import { Toaster } from "sonner";

interface MainLayoutClientProps {
  children: React.ReactNode;
  user?: any; 
  // fontClassNames removed as it's now used in the parent
}

const MainLayoutClient = ({ 
  children, 
  user 
}: MainLayoutClientProps) => {
  return (
    <ScrollProvider>
       <Toaster richColors position="top-right" />
       
       <div className="relative flex min-h-screen flex-col">
        <NavBar user={user} />
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </ScrollProvider>
  );
};

export default MainLayoutClient;