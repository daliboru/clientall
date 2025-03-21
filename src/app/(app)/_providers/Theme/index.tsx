'use client'

import { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextType {
  darkMode: boolean
  toggleDarkMode: (checked: boolean) => void
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setDarkMode(initialDarkMode)
    document.documentElement.setAttribute('data-theme', initialDarkMode ? 'dark' : 'light')
  }, [])

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked)
    document.documentElement.setAttribute('data-theme', checked ? 'dark' : 'light')
    localStorage.setItem('theme', checked ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)