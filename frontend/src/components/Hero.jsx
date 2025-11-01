import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch } from 'react-icons/fi'
import { searchFood } from '../services/restaurantService'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'
import Food3DBackground from './Food3DBackground'

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const { addToCart } = useCart()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery])

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setLoading(true)
    try {
      const response = await searchFood(query)
      if (response.success) {
        setSearchResults(response.data)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleItemClick = (item, restaurantName, restaurantId) => {
    if (!restaurantId) {
      toast.error('Restaurant information not available')
      return
    }
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: restaurantId,
      restaurantName: restaurantName || 'Unknown Restaurant'
    })
    toast.success(`${item.name} added to cart!`)
    setShowResults(false)
    setSearchQuery('')
    navigate('/cart')
  }

  const handleViewRestaurant = (restaurantId) => {
    if (!restaurantId) {
      toast.error('Restaurant information not available')
      return
    }
    setShowResults(false)
    setSearchQuery('')
    navigate(`/restaurants/${restaurantId}`)
  }

  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 dark:from-orange-600 dark:via-pink-600 dark:to-purple-600">
      {/* 3D Food Background */}
      <Food3DBackground />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-300 opacity-10 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight px-4"
          >
            Delicious Food
            <br />
            <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
              Delivered Fast
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8 font-light px-4"
          >
            Order from your favorite restaurants and get it delivered in minutes.
            <br className="hidden sm:block" />
            <span className="block sm:inline">Over 1000+ restaurants to choose from.</span>
          </motion.p>

          {/* Food Search Container with 3D Effect */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
            ref={searchRef}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex flex-col sm:flex-row items-center bg-white dark:bg-dark-card/95 rounded-2xl sm:rounded-full shadow-2xl overflow-hidden p-2 md:p-2 mx-4 sm:mx-0 border border-gray-200 dark:border-dark-border"
            >
              <div className="flex items-center flex-1 w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4">
                <FiSearch className="text-orange-500 dark:text-orange-400 text-lg sm:text-xl mr-2 sm:mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search for food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) {
                      setShowResults(true)
                    }
                  }}
                  className="flex-1 outline-none text-gray-700 dark:text-dark-text text-sm sm:text-base md:text-lg placeholder-gray-500 dark:placeholder-dark-muted bg-transparent"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (searchQuery.trim()) {
                    performSearch(searchQuery)
                  }
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-full font-semibold hover:shadow-lg transition-shadow mt-2 sm:mt-0"
              >
                <FiSearch className="text-lg sm:text-xl" />
                <span className="text-sm sm:text-base">Find Food</span>
              </motion.button>
            </motion.div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-gray-200 dark:border-dark-border z-50 max-h-96 overflow-y-auto"
                >
                  {loading ? (
                    <div className="p-6 text-center text-gray-500 dark:text-dark-muted">
                      Searching...
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-dark-muted">
                      No food items found. Try a different search term.
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-dark-border">
                        <h3 className="font-bold text-gray-800 dark:text-dark-text">Search Results ({searchResults.length})</h3>
                      </div>
                      {searchResults.map((item) => (
                        <motion.div
                          key={item._id}
                          whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
                          className="p-4 hover:bg-orange-50 dark:hover:bg-dark-darker cursor-pointer border-b border-gray-100 dark:border-dark-border last:border-b-0"
                          onClick={() => handleItemClick(item, item.restaurantName, item.restaurantId)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-darker flex-shrink-0 flex items-center justify-center">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null
                                    e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-900/20 dark:to-pink-900/20">
                                  <FiSearch className="text-orange-400 text-2xl" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-800 dark:text-dark-text text-base mb-1">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-dark-muted mb-2">
                                {item.restaurantName}
                              </p>
                              {item.description && (
                                <p className="text-xs text-gray-600 dark:text-dark-muted line-clamp-1 mb-2">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-orange-500">
                                  ${item.price.toFixed(2)}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewRestaurant(item.restaurantId)
                                  }}
                                  className="text-sm text-orange-500 hover:underline px-3 py-1 rounded-lg hover:bg-orange-50 dark:hover:bg-dark-darker transition-colors"
                                >
                                  View Restaurant
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating food icons */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-8 -left-8 text-5xl"
            >
              🍕
            </motion.div>
            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute -bottom-8 -right-8 text-5xl"
            >
              🍔
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Wave Effect */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 fill-white">
          <path d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </section>
  )
}

export default Hero

