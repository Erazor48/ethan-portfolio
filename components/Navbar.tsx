// components/Navbar.tsx
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { personalData } from "@/lib/data/personal-data";

export default function Navbar() {
  return (
    <nav className="w-full px-4 py-3 flex justify-between items-center bg-primary shadow-md text-primary-fg">
      <span className="text-xl font-bold text-secondary-fg">{personalData.personal.name}</span>
      <div className="space-x-2 text-sm">
        <ThemeToggle></ThemeToggle>
        <Link href="/" className="p-2 rounded hover:bg-navbar-emphasis transition-colors">Home</Link>
        <Link href="/about" className="p-2 rounded hover:bg-navbar-emphasis transition-colors">About</Link>
        <Link href="/projects" className="p-2 rounded hover:bg-navbar-emphasis transition-colors">Projects</Link>
        <Link href="/contact" className="p-2 rounded hover:bg-navbar-emphasis transition-colors">Contact</Link>
      </div>
    </nav>
  );
}
