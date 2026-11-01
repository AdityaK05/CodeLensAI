import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeMap = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div
        className={`${sizeMap[size]} relative rounded-lg bg-[#3A2419] border border-[#4E3224] p-1 flex items-center justify-center transition-colors group-hover:border-[#C89868]`}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-4 h-4 text-[#C89868] transition-colors stroke-[2]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="7" stroke="currentColor" opacity="0.6" strokeDasharray="3 2" />
          <path d="m10 9-3 3 3 3" />
          <path d="m14 9 3 3-3 3" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm tracking-tight text-[#FAF2E8]">
              CodeLens
            </span>
            <span className="px-1 py-0.2 text-[9px] font-bold uppercase tracking-widest rounded bg-[#482D20] border border-[#5C3A29] text-[#FAF2E8]">
              AI
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
