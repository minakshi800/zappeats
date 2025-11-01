import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { searchFood } from '../services/restaurantService'
import { useCart } from '../context/CartContext'

const SearchBar = () => {
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
    <div className="relative" ref={searchRef}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="hidden lg:flex items-center bg-gray-100 dark:bg-dark-card rounded-full px-4 py-2 gap-2 w-64 border border-gray-200 dark:border-dark-border focus-within:border-orange-500 dark:focus-within:border-orange-500 transition-colors"
      >
        <FiSearch className="text-gray-500 dark:text-dark-muted flex-shrink-0" />
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
          className="bg-transparent outline-none flex-1 text-sm text-gray-700 dark:text-dark-text placeholder-gray-500 dark:placeholder-dark-muted"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('')
              setSearchResults([])
              setShowResults(false)
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-text"
          >
            <FiX className="text-sm" />
          </button>
        )}
      </motion.div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-dark-card rounded-xl shadow-2xl border border-gray-200 dark:border-dark-border z-50 max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-500 dark:text-dark-muted">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-dark-muted">
                No food items found
              </div>
            ) : (
              <div className="py-2">
                {searchResults.map((item) => (
                  <motion.div
                    key={item._id}
                    whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
                    className="p-3 hover:bg-orange-50 dark:hover:bg-dark-darker cursor-pointer border-b border-gray-100 dark:border-dark-border last:border-b-0"
                    onClick={() => handleItemClick(item, item.restaurantName, item.restaurantId)}
                  >
                    <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-darker flex-shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiSearch className="text-gray-400 text-xl" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-800 dark:text-dark-text truncate text-sm">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-dark-muted truncate">
                          {item.restaurantName}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-bold text-orange-500">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewRestaurant(item.restaurantId)
                            }}
                            className="text-xs text-orange-500 hover:underline px-2 py-1"
                          >
                            View
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
    </div>
  )
}

export default SearchBar

