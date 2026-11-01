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
    <header className="h-13 border-b border-[#442B1E] bg-[#2D1C13] sticky top-0 z-30 flex items-center justify-between px-5 select-none">
      {/* Brand */}
      <div className="flex items-center gap-6">
        <Link href="/workspace" className="focus:outline-none">
          <Logo size="sm" />
        </Link>

        {/* Minimalist Navigation Tabs in Mocha Brown */}
        <nav className="flex items-center gap-1 bg-[#3A2419] p-1 rounded-lg border border-[#4E3224]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#FAF2E8] text-[#2D1C13] font-semibold shadow-sm"
                    : "text-[#D7CCC8] hover:text-[#FAF2E8] hover:bg-[#4E3224]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#2D1C13]" : "text-[#D7CCC8]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Minimalist Status Indicator - No model details */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#3A2419] border border-[#4E3224] text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C89868]" />
          <span className="text-[#D7CCC8] text-[11px] font-medium tracking-wide">AI Engine Active</span>
        </div>
      </div>
    </header>
  );
}
