import { Metadata } from "next";
import "../globals.css";
import NavBar from "@/components/ui/navbar";

export const metadata: Metadata = {
  title: "E-Commerce App / Dashboard",
  description: "A modern e-commerce application built with Next.js and Tailwind CSS",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* <NavBar page="dashboard" /> */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}