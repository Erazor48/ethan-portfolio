import React from "react";

export default function AnimatedSection({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-fadeInUp ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
} 