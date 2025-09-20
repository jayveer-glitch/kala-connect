'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('English')

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
    { code: 'ja', name: '日本語' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ar', name: 'العربية' }
  ]

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language)
    setIsLanguageOpen(false)
  }

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-charcoal">
              KalaConnect
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/results" className="text-charcoal hover:text-terracotta transition-colors duration-300">
                Results Dashboard
              </Link>
              <Link href="/story/demo-story-123" className="text-charcoal hover:text-terracotta transition-colors duration-300">
                Public Story Page
              </Link>
              <Link href="#" className="text-charcoal hover:text-terracotta transition-colors duration-300">
                About
              </Link>
              <Link href="#" className="text-charcoal hover:text-terracotta transition-colors duration-300">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">


            {/* Product Code Display */}
            <div className="px-3 py-1 bg-gray-100 rounded-md">
              <span className="text-sm font-mono font-medium text-gray-600">Code: 425</span>
            </div>
            

            
            {/* Language Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center space-x-2 text-charcoal hover:text-terracotta transition-colors duration-300 cursor-pointer"
              >
                <svg 
                  width="18" 
                  height="18" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className="text-gray-600"
                >
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="m4.93 4.93 4.24 4.24"/>
                  <path d="m14.83 9.17 4.24-4.24"/>
                  <path d="m14.83 14.83 4.24 4.24"/>
                  <path d="m9.17 14.83-4.24 4.24"/>
                </svg>
                <span className="font-medium">{selectedLanguage}</span>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none"
                  className={`transform transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`}
                >
                  <path 
                    d="M2 4L6 8L10 4" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              
              {/* Dropdown */}
              {isLanguageOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.name)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between ${
                        selectedLanguage === language.name ? 'bg-gray-50 font-medium' : ''
                      }`}
                    >
                      <span className="text-charcoal">{language.name}</span>
                      {selectedLanguage === language.name && (
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 16 16" 
                          fill="none"
                          className="text-terracotta"
                        >
                          <path 
                            d="M13 4L6 11L3 8" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="w-px h-6 bg-gray-300"></div>
            
            <button className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300">
              Log in
            </button>
          </div>
        </div>
      </div>
      
      {/* Overlay to close dropdown */}
      {isLanguageOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsLanguageOpen(false)}
        />
      )}
    </nav>
  )
}