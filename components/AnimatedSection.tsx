import React from "react";
import { useEffect, useState } from "react"

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

export function TypewriterMessage({ content, speed = 20 }: { content: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(content.slice(0, i + 1))
      i++
      if (i >= content.length) clearInterval(interval)
    }, speed) // vitesse d’écriture (ms par caractère)

    return () => clearInterval(interval)
  }, [content, speed])

  return (
    <div className="whitespace-pre-line relative animate-fadeInUp">
      {displayed}
    </div>
  )
}
