import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import MainLayoutClient from "./main-layout-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "E-Commerce App",
  description: "A modern e-commerce application built with Next.js and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontClassNames = `${geistSans.variable} ${geistMono.variable}`;
  
  return (
    <html lang="en">
      {/* The <body> tag is now in your client component.
        We just render the client component here and pass the
        children (your pages) and font classes to it.
      */}
      <MainLayoutClient fontClassNames={fontClassNames}>
        {children}
      </MainLayoutClient>
    </html>
  );
}