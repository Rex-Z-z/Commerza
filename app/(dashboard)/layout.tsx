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
import { getCurrentUser } from "@/app/actions/user";

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
  
  // Fetch user for the dashboard navbar
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="antialiased">
        <SidebarProvider defaultOpen={defaultOpen} className="flex flex-col">
          {/* Pass page="dashboard" and the user object */}
          <NavBar page="dashboard" user={user} />
          <div className='[--header-height:calc(--spacing(18))]'>
            <div className="flex flex-1">
              <DashboardSidebar user={user} />
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