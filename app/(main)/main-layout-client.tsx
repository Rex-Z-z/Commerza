"use client";

import React from "react";
import NavBar from "@/components/ui/navbar";
// If you have a Footer component, import it here:
// import Footer from "@/components/ui/footer"; 

interface MainLayoutClientProps {
  children: React.ReactNode;
  fontClassNames: string;
  user?: any; // Add user to interface
}

const MainLayoutClient = ({ 
  children, 
  fontClassNames, 
  user 
}: MainLayoutClientProps) => {
  return (
    <body className={`${fontClassNames} antialiased`}>
       <div className="relative flex min-h-screen flex-col">
        {/* Pass user to NavBar so it knows to show Profile instead of Login */}
        <NavBar user={user} />
        
        <main className="flex-1">
          {children}
        </main>
        
        {/* <Footer /> */}
      </div>
    </body>
  );
};

export default MainLayoutClient;