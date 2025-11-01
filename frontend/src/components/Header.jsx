import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import ThemeToggle from './ThemeToggle'

const Header = () => {
  const { isAuthenticated, user } = useAuth()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
    }
  }, [mobileMenuOpen])

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <header className="bg-white dark:bg-dark-darker shadow-lg sticky top-0 z-[100] backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 relative border-b border-gray-200 dark:border-dark-border">
      <div className="flex items-center justify-between py-3 md:py-4 min-h-[70px] px-2 md:px-4">
        {/* Left Side - Mobile Menu Button & Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu Button - Top Left */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 text-gray-700 dark:text-dark-text"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </motion.button>

          {/* Logo */}
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent cursor-pointer px-2 md:px-4 py-2"
            >
              🍕 ZappEats
            </motion.div>
          </Link>

          {/* Theme Toggle - Desktop */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Cart Icon - Next to Theme Toggle */}
          <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="hidden md:block">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative cursor-pointer"
            >
              <FiShoppingCart className="text-xl md:text-2xl text-gray-700 dark:text-dark-text" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </motion.div>
          </Link>
        </div>

        {/* Right Side - Navigation, Search, Profile */}
        <div className="flex items-center gap-2 md:gap-4">


          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6 mr-4">
            <Link 
              to="/" 
              className={`font-semibold transition-all relative ${
                isActive('/') 
                  ? 'text-orange-500 dark:text-orange-400' 
                  : 'text-gray-700 dark:text-dark-text hover:text-orange-500 dark:hover:text-orange-400'
              }`}
            >
              {isActive('/') && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative ${isActive('/') ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : ''}`}>
                Home
              </span>
            </Link>
            <Link 
              to="/restaurants" 
              className={`font-semibold transition-all relative ${
                isActive('/restaurants') 
                  ? 'text-orange-500 dark:text-orange-400' 
                  : 'text-gray-700 dark:text-dark-text hover:text-orange-500 dark:hover:text-orange-400'
              }`}
            >
              {isActive('/restaurants') && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative ${isActive('/restaurants') ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : ''}`}>
                Restaurants
              </span>
            </Link>
            <Link 
              to="/deals" 
              className={`font-semibold transition-all relative ${
                isActive('/deals') 
                  ? 'text-orange-500 dark:text-orange-400' 
                  : 'text-gray-700 dark:text-dark-text hover:text-orange-500 dark:hover:text-orange-400'
              }`}
            >
              {isActive('/deals') && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative ${isActive('/deals') ? 'drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]' : ''}`}>
                Deals
              </span>
            </Link>
          </nav>

          {/* Desktop Profile/Auth */}
          {isAuthenticated ? (
            <Link to="/profile" className="hidden md:block">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold cursor-pointer shadow-lg hover:shadow-xl transition-shadow mr-4"
              >
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name || 'User'} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : user?.name ? (
                  <span className="text-lg font-bold">{user.name.charAt(0).toUpperCase()}</span>
                ) : (
                  <FiUser className="text-xl" />
                )}
              </motion.div>
            </Link>
          ) : (
            <div className="hidden md:flex items-center gap-3 mr-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-full font-semibold hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Sign In
                </motion.button>
              </Link>
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-lg transition-shadow"
                >
                  Sign Up
                </motion.button>
              </Link>
            </div>
          )}

          {/* Theme Toggle - Mobile (visible when menu is closed) */}
          {!mobileMenuOpen && (
            <div className="md:hidden">
              <ThemeToggle />
            </div>
          )}
        </div>

      {/* Mobile Menu - Slide in from left - Rendered via Portal */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 md:hidden"
                style={{ 
                  zIndex: 99999,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
              />
              {/* Menu Panel */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed md:hidden overflow-y-auto"
                style={{ 
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '85%',
                  maxWidth: '384px',
                  backgroundColor: '#ffffff',
                  color: '#1f2937',
                  borderRight: '2px solid #d1d5db',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  zIndex: 100000,
                  paddingTop: '70px',
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6" style={{ color: '#1f2937', backgroundColor: '#ffffff' }}>
                  {/* Profile Section */}
                  {isAuthenticated ? (
                    <div className="pb-4 sm:pb-6 border-b-2 border-gray-300 dark:border-dark-border">
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-darker transition-colors"
                        style={{ color: '#1f2937' }}
                      >
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                          {user?.avatar ? (
                            <img 
                              src={user.avatar} 
                              alt={user.name || 'User'} 
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                            />
                          ) : user?.name ? (
                            <span className="text-lg sm:text-xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
                          ) : (
                            <FiUser className="text-xl sm:text-2xl text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-gray-800 dark:text-dark-text truncate" style={{ color: '#1f2937' }}>{user?.name || 'User'}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted truncate" style={{ color: '#4b5563' }}>{user?.email}</p>
                        </div>
                      </Link>
                    </div>
                  ) : null}

                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-semibold text-base transition-colors ${
                        isActive('/')
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                          : 'text-gray-800 bg-gray-50 hover:bg-gray-100 dark:text-dark-text dark:bg-dark-darker dark:hover:bg-dark-bg'
                      }`}
                      style={!isActive('/') ? { color: '#1f2937', backgroundColor: '#f9fafb' } : {}}
                    >
                      <span className="text-xl">🏠</span>
                      <span className="font-semibold">Home</span>
                    </Link>
                    <Link
                      to="/restaurants"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-semibold text-base transition-colors ${
                        isActive('/restaurants')
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                          : 'text-gray-800 bg-gray-50 hover:bg-gray-100 dark:text-dark-text dark:bg-dark-darker dark:hover:bg-dark-bg'
                      }`}
                      style={!isActive('/restaurants') ? { color: '#1f2937', backgroundColor: '#f9fafb' } : {}}
                    >
                      <span className="text-xl">🍽️</span>
                      <span className="font-semibold">Restaurants</span>
                    </Link>
                    <Link
                      to="/deals"
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-semibold text-base transition-colors ${
                        isActive('/deals')
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                          : 'text-gray-800 bg-gray-50 hover:bg-gray-100 dark:text-dark-text dark:bg-dark-darker dark:hover:bg-dark-bg'
                      }`}
                      style={!isActive('/deals') ? { color: '#1f2937', backgroundColor: '#f9fafb' } : {}}
                    >
                      <span className="text-xl">🎁</span>
                      <span className="font-semibold">Deals</span>
                    </Link>
                  </nav>

                  {/* Profile Options (if authenticated) */}
                  {isAuthenticated && (
                    <div className="pt-3 sm:pt-4 border-t-2 border-gray-300 dark:border-dark-border space-y-2">
                      <h4 className="px-3 sm:px-4 text-xs font-bold text-gray-600 dark:text-dark-muted uppercase tracking-wider" style={{ color: '#4b5563' }}>Profile</h4>
                      <Link
                        to="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-semibold text-base bg-gray-50 hover:bg-gray-100 dark:bg-dark-darker dark:hover:bg-dark-bg transition-colors"
                        style={{ color: '#1f2937', backgroundColor: '#f9fafb' }}
                      >
                        <FiUser className="text-xl flex-shrink-0" style={{ color: '#1f2937' }} />
                        <span className="font-semibold">My Account</span>
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 sm:px-4 py-3 rounded-xl font-semibold text-base bg-gray-50 hover:bg-gray-100 dark:bg-dark-darker dark:hover:bg-dark-bg transition-colors"
                        style={{ color: '#1f2937', backgroundColor: '#f9fafb' }}
                      >
                        <FiShoppingCart className="text-xl flex-shrink-0" style={{ color: '#1f2937' }} />
                        <span className="flex-1 font-semibold">My Cart</span>
                        {cartCount > 0 && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold flex-shrink-0">{cartCount}</span>
                        )}
                      </Link>
                    </div>
                  )}

                  {/* Auth Buttons (if not authenticated) */}
                  {!isAuthenticated && (
                    <div className="space-y-3 pt-3 sm:pt-4 border-t-2 border-gray-300 dark:border-dark-border">
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-3 border-2 border-orange-500 text-orange-500 rounded-xl font-bold text-base hover:bg-orange-500 hover:text-white transition-colors"
                          style={{ borderColor: '#f97316', color: '#f97316' }}
                        >
                          Sign In
                        </motion.button>
                      </Link>
                      <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="block">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold text-base hover:shadow-lg transition-shadow"
                          style={{ backgroundColor: '#f97316' }}
                        >
                          Sign Up
                        </motion.button>
                      </Link>
                    </div>
                  )}

                  {/* Logout Button (if authenticated) */}
                  {isAuthenticated && (
                    <div className="pt-3 sm:pt-4 border-t-2 border-gray-300 dark:border-dark-border">
                      <motion.button
                        onClick={() => {
                          // Navigate to profile page where logout is handled
                          navigate('/profile')
                          setMobileMenuOpen(false)
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full px-4 py-3 bg-gray-700 dark:bg-gray-600 text-white rounded-xl font-bold text-base hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#374151', color: 'white' }}
                      >
                        <span>🚪</span>
                        <span>Logout (from Profile)</span>
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
      </div>
    </header>
  )
}

export default Header

