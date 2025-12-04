import { Metadata } from "next";
import "../globals.css";
import NavBar from "@/components/ui/navbar";
import { getCurrentUser } from "@/app/actions/user";

export const metadata: Metadata = {
  title: "E-Commerce App / Signup",
  description: "A modern e-commerce application built with Next.js and Tailwind CSS",
};

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user on the server
  const user = await getCurrentUser();

  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Pass the user object to NavBar */}
      <NavBar user={user} />
      <main className="flex-1">{children}</main>
      {/* Footer... */}
    </div>
  );
}
