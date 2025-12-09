"use client";

import React from "react";
import NavBar from "@/components/ui/navbar";
import { ScrollProvider } from "@/app/context/scroll-context";
import { Toaster } from "sonner"; // <--- ADD THIS IMPORT

interface MainLayoutClientProps {
  children: React.ReactNode;
  fontClassNames: string;
  user?: any; 
}

const MainLayoutClient = ({ 
  children, 
  fontClassNames, 
  user 
}: MainLayoutClientProps) => {
  return (
    <body className={`${fontClassNames} antialiased`}>
       <ScrollProvider>
         {/* <--- ADD THIS TOASTER COMPONENT */}
         <Toaster richColors position="top-right" />
         
         <div className="relative flex min-h-screen flex-col">
          <NavBar user={user} />
          
          <main className="flex-1">
            {children}
          </main>
        </div>
      </ScrollProvider>
    </body>
  );
};

export default MainLayoutClient;