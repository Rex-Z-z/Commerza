'use client'

import "../globals.css";
import NavBar from "@/components/ui/navbar";
import { ScrollProvider } from "../context/scroll-context";
import { usePathname } from 'next/navigation';

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
      {isSearchPage ? (
        <>
          <NavBar page="search" />
          {children}
        </>
      ) : (
        <ScrollProvider>
          <NavBar page="default" />
          {children}
        </ScrollProvider>
      )}
    </body>
  );
}