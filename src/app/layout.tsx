import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "CodeLens AI",
  description: "Minimalist Code Intelligence and Analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full">
      <body className="antialiased bg-[#211426] text-[#FDF8F8] h-screen flex flex-col font-sans overflow-hidden selection:bg-[#4D2C59] selection:text-[#FDF8F8]">
        <Navigation />
        <main className="flex-1 min-h-0 flex flex-col relative overflow-hidden">{children}</main>
      </body>
    </html>
  );
}