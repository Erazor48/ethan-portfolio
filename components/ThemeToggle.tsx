'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const html = document.documentElement
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const dark = saved === 'dark' || (!saved && prefersDark)
    html.classList.toggle('dark', dark)
    setIsDark(dark)
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    const nowDark = !isDark
    html.classList.toggle('dark', nowDark)
    localStorage.setItem('theme', nowDark ? 'dark' : 'light')
    setIsDark(nowDark)
  }

  if (!mounted) return null // empêche un flash d'icône mal synchronisée

  return (
    <button
    onClick={toggleTheme}
    className="p-2 rounded hover:bg-navbar-emphasis transition-colors group"
    aria-label="Toggle theme"
    >
      <span className={`inline-block ${isDark ? 'group-hover:animate-spin' : ''} transition-transform duration-500 `}>
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  )
}
