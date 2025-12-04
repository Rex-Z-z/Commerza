'use client'

import "../globals.css";
import NavBar from "@/components/ui/navbar";
import { ScrollProvider } from "../context/scroll-context";
import { usePathname } from 'next/navigation';
// 1. Import the SidebarProvider
import { SidebarProvider } from "@/components/ui/sidebar";

export default function MainLayoutClient({
  children,
  fontClassNames
}: Readonly<{
  children: React.ReactNode;
  fontClassNames: string;
}>) {
  const pathname = usePathname();
  const isSearchPage = pathname === '/search';

  return (
    <body
      className={`${fontClassNames} antialiased`}
    >
      <SidebarProvider defaultOpen={false} className="flex flex-col">
        {isSearchPage ? (
          <>
            <NavBar page="search"/>
            {children}
          </>
        ) : (
          <ScrollProvider>
            <NavBar page="default" login={false} />
            {children}
          </ScrollProvider>
        )}
      </SidebarProvider>
    </body>
  );
}