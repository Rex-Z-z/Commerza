import { Metadata } from "next";
import { cookies } from "next/headers";
import "../globals.css";
import NavBar from "@/components/ui/navbar";
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardBreadcrumb } from "@/components/dashboard-breadcrumb"

export const metadata: Metadata = {
  title: "E-Commerce App / Dashboard",
  description: "A modern e-commerce application built with Next.js and Tailwind CSS",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <html lang="en">
      <body className="antialiased">
        <SidebarProvider defaultOpen={defaultOpen} className="flex flex-col">
          <NavBar page="dashboard" login={true} />
          <div className='[--header-height:calc(--spacing(18))]'>
            <div className="flex flex-1">
              <DashboardSidebar />
              <SidebarInset>
                <main className="p-4">
                  <DashboardBreadcrumb />
                  {children}
                </main>
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}