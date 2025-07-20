"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="animate-fadeInUp" key={pathname}>
      {children}
    </div>
  );
} 