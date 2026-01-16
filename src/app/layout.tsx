'use client'

import './globals.css'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import AchievementsPanel from '@/components/AchievementsPanel'
import StatsButton from '@/components/StatsButton'
import AutosaveIndicator from '@/components/AutosaveIndicator'
import { useLanguageStore } from '@/store/languageStore'
import { useEffect } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const language = useLanguageStore((state) => state.language)

  useEffect(() => {
    // Track language switches for achievement
    const switches = parseInt(localStorage.getItem('language_switches') || '0')
    localStorage.setItem('language_switches', (switches + 1).toString())
  }, [language])

  return (
    <html lang={language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="theme-color" content="#020222" />
        <title>SOLVE NULL - Consciousness Evolution</title>
        <meta name="description" content="A multi-level philosophical puzzle application testing the boundaries of consciousness and intelligence." />
        <meta name="keywords" content="puzzle, consciousness, philosophy, AI, awakening" />
      </head>
      <body className="min-h-screen consciousness-bg antialiased">
        <div className="stars fixed inset-0 pointer-events-none" />
        
        {/* Global Floating Language Switcher */}
        <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[100]">
          <LanguageSwitcher />
        </div>
        
        {/* Global Stats Button */}
        <StatsButton />
        
        {/* Global Achievements Panel */}
        <AchievementsPanel />
        
        {/* Autosave Indicator */}
        <AutosaveIndicator />
        
        {children}
      </body>
    </html>
  )
}
