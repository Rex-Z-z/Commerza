import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import MainLayoutClient from "./main-layout-client";
import { getCurrentUser } from "@/app/actions/user"; // Import the fetcher

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 1. Fetch the user on the server
  const user = await getCurrentUser();
  
  const fontClassNames = `${geistSans.variable} ${geistMono.variable}`;
  
  return (
    <html lang="en">
      {/* 2. Pass the user object to the client component */}
      <MainLayoutClient fontClassNames={fontClassNames} user={user}>
        {children}
      </MainLayoutClient>
    </html>
  );
}