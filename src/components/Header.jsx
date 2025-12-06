import React, { useState } from 'react'
import { Menu, X, Home, Table2, Settings, Info, Sun, Moon, Waves, Terminal } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const themes = [
    { id: 'light', icon: <Sun size={18} />, label: 'Light Mode', color: '#667eea' },
    { id: 'dark', icon: <Moon size={18} />, label: 'Dark Mode', color: '#1a1a2e' },
    { id: 'deepblue', icon: <Waves size={18} />, label: 'Deep Blue', color: '#0f3460' },
    { id: 'terminal', icon: <Terminal size={18} />, label: 'Terminal', color: '#00ff00' }
  ]

  const currentTheme = themes.find(t => t.id === theme)

  const menuItems = [
    { icon: <Home size={20} />, label: 'Home', href: '#home' },
    { icon: <Table2 size={20} />, label: 'Data Table', href: '#table' },
    { icon: <Settings size={20} />, label: 'Settings', href: '#settings' },
    { icon: <Info size={20} />, label: 'About', href: '#about' }
  ]

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Table2 size={28} className="logo-icon" />
          <span className="logo-text">DataTable Pro</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="nav-link"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
          
          {/* Theme Switcher */}
          <div className="theme-switcher">
            <button 
              className="theme-toggle"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
            >
              {currentTheme.icon}
              <span>{currentTheme.label}</span>
            </button>
            
            {showThemeMenu && (
              <div className="theme-menu">
                {themes.map((t, index) => (
                  <button
                    key={t.id}
                    className={`theme-option ${theme === t.id ? 'active' : ''}`}
                    onClick={() => {
                      toggleTheme(t.id)
                      setShowThemeMenu(false)
                    }}
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      '--theme-color': t.color
                    }}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile ${isMenuOpen ? 'open' : ''}`}>
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="nav-link-mobile"
              onClick={() => setIsMenuOpen(false)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.icon}
              <span>{item.label}</span>
            </a>
          ))}
          
          {/* Mobile Theme Switcher */}
          <div className="theme-section-mobile">
            <div className="theme-label">Theme</div>
            {themes.map((t, index) => (
              <button
                key={t.id}
                className={`theme-option-mobile ${theme === t.id ? 'active' : ''}`}
                onClick={() => {
                  toggleTheme(t.id)
                  setIsMenuOpen(false)
                }}
                style={{ 
                  animationDelay: `${(index + 4) * 0.1}s`,
                  '--theme-color': t.color
                }}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Overlay */}
      {(isMenuOpen || showThemeMenu) && (
        <div className="overlay" onClick={() => {
          setIsMenuOpen(false)
          setShowThemeMenu(false)
        }}></div>
      )}
    </header>
  )
}

export default Header
