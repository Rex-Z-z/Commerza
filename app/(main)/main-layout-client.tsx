"use client";

import React from "react";
import NavBar from "@/components/ui/navbar";
// Import the ScrollProvider
import { ScrollProvider } from "@/app/context/scroll-context";

// If you have a Footer component, import it here:
// import Footer from "@/components/ui/footer"; 

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
       {/* Wrap the content with ScrollProvider so useScroll() works in Page and NavBar */}
       <ScrollProvider>
         <div className="relative flex min-h-screen flex-col">
          {/* Pass user to NavBar */}
          <NavBar user={user} />
          
          <main className="flex-1">
            {children}
          </main>
          
          {/* <Footer /> */}
        </div>
      </ScrollProvider>
    </body>
  );
};

export default MainLayoutClient;