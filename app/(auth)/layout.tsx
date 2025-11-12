import { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "E-Commerce App / Signup",
  description: "A modern e-commerce application built with Next.js and Tailwind CSS",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
