import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { School, Menu, X, Sun, Moon, Zap, Bell } from 'lucide-react'
import { AuthModal } from '../auth/AuthModal'

interface AppHeaderProps {
  variant?: 'guest' | 'user'
  className?: string
}

export function AppHeader({ variant = 'guest', className = '' }: AppHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => (typeof window !== 'undefined' && document.documentElement.classList.contains('dark')))
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
    setIsMobileMenuOpen(false)
  }

  // Initialize theme from system or local storage
  useEffect(() => {
    // no-op
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const navLinks = [
    { to: '/learning', label: 'Learning' },
    { to: '/creation', label: 'Creation' },
    { to: '/community', label: 'Community' },
  ]

  // Add Home link for user variant
  const links = navLinks

  return (
    <div className={`layout-container flex w-full flex-col border-b border-[#e8e8f3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark sticky top-0 z-50 ${className}`}>
      <header className="flex items-center justify-between whitespace-nowrap px-4 py-3 max-w-[1280px] mx-auto w-full lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4 text-text-main dark:text-white cursor-pointer">
          <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
            <School className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">AGISchool</h2>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-9">
            {links.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                activeProps={{ className: 'text-primary dark:text-primary' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {variant === 'guest' ? (
              <div className="flex gap-3">
                <button 
                  onClick={() => openAuth('login')}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-bold transition-colors text-gray-900 dark:text-white"
                >
                  <span className="truncate">Log In</span>
                </button>
                <button 
                  onClick={() => openAuth('register')}
                  className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold transition-colors shadow-soft"
                >
                  <span className="truncate">Sign Up</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button className="size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
                  <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                </button>
                
                <Link to="/dashboard" className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Zap className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">Level 4</span>
                  </div>
                  <div className="flex flex-col items-end hidden lg:flex">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">Alex Chen</span>
                  </div>
                  <div 
                    className="size-9 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700 shadow-sm" 
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAm5pd4gNnKD9Aw4UVXe8S0VaVi-pTKwyyYcFRl6MRoJR4YtlAWEhc4clzqO7XgIuUG8RigDqaN_2hT1WqC4sjx3xQN8FxPXhVtopFRm9-0yfEkl5uXcnXYAo1yZZyKwNxEvVN-58QT8a56aFhdUCpbbxuHCOfD9CdHi-pYyIVt4moMJkoKsreG33hwOpRUBlefMmqH83nMQqnOvvbg7yOjjzw-U3UnHVoxv6wvlsplcmH3o2N3jNT--ZDBnweKb4VN-Essb96osXc")' }}
                  ></div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Icon */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button 
            className="flex items-center justify-center p-2 text-text-main dark:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface-light dark:bg-surface-dark border-b border-[#e8e8f3] dark:border-gray-800 p-4 shadow-lg animate-in slide-in-from-top-5">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link 
                key={link.to} 
                to={link.to} 
                className="text-base font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {variant === 'guest' ? (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button 
                  onClick={() => openAuth('login')} 
                  className="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-background-light dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white"
                >
                  Log In
                </button>
                <button 
                  onClick={() => openAuth('register')} 
                  className="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Link to="/dashboard" className="flex items-center gap-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  <div 
                    className="size-8 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700" 
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAm5pd4gNnKD9Aw4UVXe8S0VaVi-pTKwyyYcFRl6MRoJR4YtlAWEhc4clzqO7XgIuUG8RigDqaN_2hT1WqC4sjx3xQN8FxPXhVtopFRm9-0yfEkl5uXcnXYAo1yZZyKwNxEvVN-58QT8a56aFhdUCpbbxuHCOfD9CdHi-pYyIVt4moMJkoKsreG33hwOpRUBlefMmqH83nMQqnOvvbg7yOjjzw-U3UnHVoxv6wvlsplcmH3o2N3jNT--ZDBnweKb4VN-Essb96osXc")' }}
                  ></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">Alex Chen</span>
                    <span className="text-xs text-primary">Level 4</span>
                  </div>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialMode={authMode} 
      />
    </div>
  )
}
