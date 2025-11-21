import { Metadata } from "next";
import "../globals.css";
import NavBar from "@/components/ui/navbar";
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

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
        <NavBar page="dashboard" />
        <div className='[--header-height:calc(--spacing(18.5))]'>
          <SidebarProvider className="flex flex-col">
            <div className="flex flex-1">
              <DashboardSidebar />
              <SidebarInset>
                <main className="p-4">
                  {children}
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}