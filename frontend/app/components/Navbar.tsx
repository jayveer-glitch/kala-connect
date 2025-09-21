'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Upload', href: '/upload', icon: '📤' },
    { name: 'Gallery', href: '/gallery', icon: '🎨' }
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <nav className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg border-b border-charcoal/10 shadow-lg' 
          : 'bg-white/80 backdrop-blur-md border-b border-charcoal/5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <Link href="/" className="group flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <img 
                      src="https://res.cloudinary.com/dlspc4akf/image/upload/v1758462061/Screenshot_2025-09-21_125102_lferqv.png" 
                      alt="KalaConnect Logo" 
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-amber-500 rounded-full opacity-0 group-hover:opacity-20 blur-sm transition-opacity duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-charcoal group-hover:text-cobalt transition-colors duration-300">
                    KalaConnect
                  </h1>
                  <p className="text-xs text-charcoal/60 font-medium">
                    Artisan Stories
                  </p>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-cobalt/10 text-cobalt'
                      : 'text-charcoal/70 hover:text-cobalt hover:bg-cobalt/5'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cobalt rounded-full"></div>
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cobalt/5 to-terracotta/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              
              {/* CTA Button */}
              <button 
                onClick={() => router.push('/upload')}
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-cobalt to-terracotta text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span className="text-sm">✨</span>
                <span className="text-sm">Create Story</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-charcoal/5 hover:bg-charcoal/10 transition-colors duration-300"
                aria-label="Toggle menu"
              >
                <div className="relative w-5 h-5">
                  <span className={`absolute h-0.5 w-full bg-charcoal transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 top-2' : 'top-1'
                  }`}></span>
                  <span className={`absolute h-0.5 w-full bg-charcoal top-2 transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}></span>
                  <span className={`absolute h-0.5 w-full bg-charcoal transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 top-2' : 'top-3'
                  }`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-charcoal/10 shadow-2xl">
            <div className="px-4 py-6 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-cobalt/10 text-cobalt'
                      : 'text-charcoal/70 hover:text-cobalt hover:bg-cobalt/5'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                  {isActive(item.href) && (
                    <div className="ml-auto w-2 h-2 bg-cobalt rounded-full"></div>
                  )}
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-4 border-t border-charcoal/10">
                <button 
                  onClick={() => {
                    router.push('/upload')
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-cobalt to-terracotta text-white px-6 py-3 rounded-xl font-medium shadow-lg"
                >
                  <span>✨</span>
                  <span>Create Your Story</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}