"use client";

import Link from "next/link";

interface GanheButtonProps {
  size?: "sm" | "md" | "lg";
  position?: "relative" | "fixed";
  className?: string;
}

export default function GanheButton({ size = "md", position = "relative", className = "" }: GanheButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-2 text-xs gap-1",
    md: "px-4 py-3 text-sm gap-2",
    lg: "px-6 py-4 text-base gap-3",
  };

  const positionClasses = position === "fixed" ? "fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6" : "relative";

  return (
    <Link href="/cadastro">
      <div className={`${positionClasses} ${className}`}>
        <button
          className={`${sizeClasses[size]} bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse hover:animate-none border-2 border-white/20 backdrop-blur-sm`}
        >
          <span className="text-lg md:text-2xl">💰</span>
          <div className="flex flex-col items-start gap-0">
            <span className="font-extrabold leading-none">GANHE 100%</span>
            <span className="text-[10px] md:text-xs font-semibold opacity-90">Calcule seu lucro</span>
          </div>
        </button>
      </div>
    </Link>
  );
}
