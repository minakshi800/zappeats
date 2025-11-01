import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiClock, FiSearch, FiFilter, FiArrowLeft } from 'react-icons/fi'
import Header from '../components/Header'
import { getRestaurants } from '../services/restaurantService'
import { toast } from 'react-toastify'

const Restaurants = () => {
  const navigate = useNavigate()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const cuisines = ['all', 'Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'American', 'Thai']

  useEffect(() => {
    fetchRestaurants()
  }, [filter, search])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const filters = {}
      if (filter !== 'all') {
        filters.cuisine = filter
      }
      if (search) {
        filters.search = search
      }
      const response = await getRestaurants(filters)
      if (response.success) {
        setRestaurants(response.data)
      }
    } catch (error) {
      toast.error('Failed to load restaurants')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-0 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-gray-700 hover:text-orange-500 mb-8"
        >
          <FiArrowLeft className="text-xl" />
          <span className="font-semibold">Back</span>
        </motion.button>

        {/* Header Section */}
        <div className="mb-8 mt-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">All Restaurants</h1>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => setFilter(cuisine)}
                  className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
                    filter === cuisine
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Restaurants Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading restaurants...</div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">No restaurants found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className="h-48 overflow-hidden bg-gray-200">
                  <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span className="font-semibold">{restaurant.rating || 0}</span>
                      <span className="text-gray-500 text-sm">({restaurant.reviewCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <FiClock />
                      <span className="text-sm">{restaurant.deliveryTime}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-semibold">
                      {restaurant.cuisine}
                    </span>
                    <span className="text-gray-600 text-sm">${restaurant.deliveryFee} delivery</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Restaurants

