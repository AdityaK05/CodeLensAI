"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { Code2, History, Settings } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: "Workspace", href: "/workspace", icon: Code2 },
    { label: "History", href: "/history", icon: History },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <header className="h-13 border-b border-[#3D2545] bg-[#211426] sticky top-0 z-30 flex items-center justify-between px-5 select-none">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <Link href="/workspace" className="focus:outline-none">
          <Logo size="sm" />
        </Link>

        {/* Minimalist Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#2C1933] p-1 rounded-lg border border-[#44284F]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#C99591] text-[#211426] font-semibold shadow-sm"
                    : "text-[#D6BFD9] hover:text-[#FDF8F8] hover:bg-[#3D2347]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#211426]" : "text-[#D6BFD9]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Minimalist Status Indicator - No model details */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#2C1933] border border-[#44284F] text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C99591]" />
          <span className="text-[#D6BFD9] text-[11px] font-medium tracking-wide">AI Engine Active</span>
        </div>
      </div>
    </header>
  );
}
