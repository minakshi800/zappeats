import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiStar, FiClock, FiArrowLeft, FiShoppingCart } from 'react-icons/fi'
import Header from '../components/Header'
import { getRestaurants, getRestaurantMenu } from '../services/restaurantService'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'

const Category = () => {
  const { categoryName } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  const categoryToCuisine = {
    'pizza': 'Italian',
    'burgers': 'American',
    'desserts': 'American',
    'drinks': 'American',
    'chicken': 'American',
    'asian': ['Chinese', 'Japanese']
  }

  const cuisine = categoryToCuisine[categoryName?.toLowerCase()] || categoryName

  useEffect(() => {
    fetchRestaurants()
  }, [categoryName])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      // If cuisine is an array, send multiple requests or handle it differently
      let response
      if (Array.isArray(cuisine)) {
        // Fetch all cuisines in the array
        const promises = cuisine.map(c => getRestaurants({ cuisine: c }))
        const results = await Promise.all(promises)
        // Combine all results
        const allRestaurants = results.flatMap(r => r.success ? r.data : [])
        response = { success: true, data: allRestaurants }
      } else {
        response = await getRestaurants({ cuisine })
      }
      if (response.success) {
        setRestaurants(response.data)
      }
    } catch (error) {
      toast.error('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  const handleViewMenu = async (restaurantId, restaurantName) => {
    try {
      const response = await getRestaurantMenu(restaurantId)
      if (response.success) {
        setSelectedRestaurant({ id: restaurantId, name: restaurantName })
        setMenu(response.data)
        setShowMenu(true)
      }
    } catch (error) {
      toast.error('Failed to load menu')
    }
  }

  const handleAddToCart = (item, restaurantName) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: selectedRestaurant.id,
      restaurantName: restaurantName
    })
    toast.success(`${item.name} added to cart!`)
  }

  if (showMenu) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <motion.button
            onClick={() => setShowMenu(false)}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-500 mb-8 transition-colors"
          >
            <FiArrowLeft className="text-xl" />
            <span className="font-semibold">Back to {categoryName}</span>
          </motion.button>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{selectedRestaurant.name}</h1>
            <p className="text-gray-600 mb-8">Browse our menu and add items to your cart</p>
          </div>

          {menu.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <p className="text-gray-500">Menu not available</p>
            </div>
          ) : (
            <div className="space-y-8">
              {['appetizer', 'main', 'dessert', 'beverage', 'salad', 'soup', 'side'].map((cat) => {
                const categoryItems = menu.filter((item) => item.category === cat)
                if (categoryItems.length === 0) return null

                return (
                  <div key={cat} className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 capitalize">{cat}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryItems.map((item) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-2 border-gray-200 rounded-xl p-4 hover:border-orange-500 transition-colors"
                        >
                          <div className="h-40 mb-4 rounded-lg overflow-hidden bg-gray-200">
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
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100">
                                <FiShoppingCart className="text-4xl text-orange-400" />
                              </div>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-orange-500">
                              ${item.price.toFixed(2)}
                            </span>
                            <motion.button
                              onClick={() => handleAddToCart(item, selectedRestaurant.name)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                            >
                              +
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <motion.button
              onClick={() => navigate('/cart')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-shadow"
            >
              Proceed to Checkout
            </motion.button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-gray-700 hover:text-orange-500 mb-8 transition-colors"
        >
          <FiArrowLeft className="text-xl" />
          <span className="font-semibold">Back to Home</span>
        </motion.button>

        {/* Category Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 capitalize">
            {categoryName} Restaurants
          </h1>
          <p className="text-gray-600">
            Discover delicious {categoryName} from top restaurants
          </p>
        </div>

        {/* Restaurants Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading restaurants...</div>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-500 text-xl">No restaurants found in this category</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all"
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
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <FiClock />
                      <span>{restaurant.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 border-2 border-orange-500 text-orange-500 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
                    >
                      View Details
                    </motion.button>
                    <motion.button
                      onClick={() => handleViewMenu(restaurant._id, restaurant.name)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                    >
                      View Menu
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Checkout Button (if items in cart) */}
        <div className="text-center mt-8">
          <motion.button
            onClick={() => navigate('/cart')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-shadow"
          >
            Go to Cart
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default Category

