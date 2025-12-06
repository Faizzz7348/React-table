import React, { useState } from 'react'
import { Menu, X, Table2, Sun, Moon, Waves, Terminal, Home, Settings, Info, FileText, Users, Grid, Edit } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useEditMode } from '../context/EditModeContext'
import './Header.css'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showGridMenu, setShowGridMenu] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { isEditMode, toggleEditMode } = useEditMode()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const themes = [
    { id: 'light', icon: <Sun size={18} />, label: 'Light Mode', color: '#667eea' },
    { id: 'dark', icon: <Moon size={18} />, label: 'Dark Mode', color: '#1a1a2e' },
    { id: 'deepblue', icon: <Waves size={18} />, label: 'Deep Blue', color: '#0f3460' },
    { id: 'terminal', icon: <Terminal size={18} />, label: 'Terminal', color: '#00ff00' }
  ]

  const menuItems = [
    { icon: <Home size={24} />, label: 'Home', href: '#home', color: '#667eea' },
    { icon: <Table2 size={24} />, label: 'Data Table', href: '#table', color: '#764ba2' },
    { icon: <Edit size={24} />, label: 'Edit Mode', action: 'toggleEdit', color: '#ff6b6b', active: isEditMode },
    { icon: <Settings size={24} />, label: 'Settings', href: '#settings', color: '#f093fb' },
    { icon: <Info size={24} />, label: 'About', href: '#about', color: '#4facfe' },
    { icon: <FileText size={24} />, label: 'Reports', href: '#reports', color: '#43e97b' },
    { icon: <Users size={24} />, label: 'Users', href: '#users', color: '#fa709a' }
  ]

  const currentTheme = themes.find(t => t.id === theme)

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Table2 size={28} className="logo-icon" />
          <span className="logo-text">DataTable Pro</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          {/* Grid Menu Button */}
          <button className="grid-menu-btn" onClick={() => setShowGridMenu(true)}>
            <Grid size={20} />
            <span>Menu</span>
          </button>

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
                  animationDelay: `${index * 0.1}s`,
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

      {/* Grid Menu Overlay */}
      {showGridMenu && (
        <>
          <div className="menu-overlay" onClick={() => setShowGridMenu(false)}>
            <div className="menu-grid-container" onClick={(e) => e.stopPropagation()}>
              <div className="menu-grid-header">
                <h2>Menu</h2>
                <button className="close-grid-btn" onClick={() => setShowGridMenu(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="menu-grid">
                {menuItems.map((item, index) => (
                  item.action === 'toggleEdit' ? (
                    <button
                      key={index}
                      className={`menu-grid-item ${item.active ? 'active-mode' : ''}`}
                      onClick={() => {
                        toggleEditMode()
                        setShowGridMenu(false)
                      }}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                        '--item-color': item.color
                      }}
                    >
                      <div className="menu-item-icon">{item.icon}</div>
                      <div className="menu-item-label">
                        {item.label}
                        {item.active && <span className="mode-badge">ON</span>}
                      </div>
                    </button>
                  ) : (
                    <a
                      key={index}
                      href={item.href}
                      className="menu-grid-item"
                      onClick={() => setShowGridMenu(false)}
                      style={{
                        animationDelay: `${index * 0.05}s`,
                        '--item-color': item.color
                      }}
                    >
                      <div className="menu-item-icon">{item.icon}</div>
                      <div className="menu-item-label">{item.label}</div>
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        </>
      )}

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
