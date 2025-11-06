import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiPercent, 
  FiTag, 
  FiClock, 
  FiArrowLeft, 
  FiStar, 
  FiShoppingCart,
  FiPlus,
  FiShoppingBag
} from 'react-icons/fi'
import Header from '../components/Header'
import { getDeal, getDealItems } from '../services/dealService'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'

const DealDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [deal, setDeal] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('restaurants')

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [dealRes, itemsRes] = await Promise.all([
        getDeal(id),
        getDealItems(id)
      ])
      
      if (dealRes.success) setDeal(dealRes.data)
      if (itemsRes.success) {
        setRestaurants(itemsRes.data.restaurants || [])
        setMenuItems(itemsRes.data.menuItems || [])
      }
    } catch (error) {
      toast.error('Failed to load deal details')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatDiscount = (deal) => {
    if (!deal) return ''
    if (deal.discountType === 'percentage') {
      return `${deal.discountValue}% OFF`
    } else if (deal.discountType === 'fixed') {
      return `$${deal.discountValue} OFF`
    } else if (deal.discountType === 'buy_one_get_one') {
      return 'Buy 1 Get 1'
    } else if (deal.discountType === 'free_delivery') {
      return 'Free Delivery'
    }
    return 'Special Offer'
  }

  const handleAddToCart = (item, restaurantName) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: item.restaurantId?._id || item.restaurantId,
      restaurantName: restaurantName,
      dealId: deal._id,
      dealDiscount: deal.discountValue,
      dealType: deal.discountType
    })
    toast.success(`${item.name} added to cart with deal!`)
  }

  if (loading || !deal) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-gray-500">Loading deal details...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Deal Hero */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500">
        <div className="absolute inset-0 bg-black/20" />
        {(() => {
          // Get appropriate fallback image based on deal title/type
          const getFallbackImage = () => {
            const title = (deal.title || '').toLowerCase()
            if (title.includes('chinese') || title.includes('asian')) {
              return 'https://images.unsplash.com/photo-1552568043-0b5c02c30a48?w=800'
            } else if (title.includes('dessert') || title.includes('sweet')) {
              return 'https://images.unsplash.com/photo-1563805042-7688c019e175?w=800'
            } else if (title.includes('pizza')) {
              return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800'
            } else if (title.includes('burger')) {
              return 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800'
            } else if (title.includes('chicken')) {
              return 'https://images.unsplash.com/photo-1626087927381-6c0f5e5e6b9f?w=800'
            } else if (title.includes('delivery') || title.includes('free')) {
              return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'
            }
            return 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=800'
          }
          const imageUrl = deal.image && deal.image.trim() ? deal.image : getFallbackImage()
          return (
            <img
              src={imageUrl}
              alt={deal.title}
              className="w-full h-full object-cover opacity-30"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = getFallbackImage()
              }}
            />
          )
        })()}
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <motion.button
              onClick={() => navigate('/deals')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 hover:bg-white/30 transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span className="font-semibold">Back to Deals</span>
            </motion.button>
            
            <h1 className="text-5xl font-bold mb-4">{deal.title}</h1>
            <p className="text-xl mb-4">{deal.description}</p>
            <div className="flex items-center gap-6">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span className="font-bold text-2xl">{formatDiscount(deal)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTag />
                <span>Code: {deal.code}</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock />
                <span>Valid until {new Date(deal.validUntil).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'restaurants'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Restaurants ({restaurants.length})
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'menu'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 hover:text-orange-500'
              }`}
            >
              Menu Items ({menuItems.length})
            </button>
          </div>

          <div className="p-8">
            {/* Restaurants Tab */}
            {activeTab === 'restaurants' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {restaurants.length === 0 ? (
                  <div className="text-center py-12">
                    <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No restaurants available for this deal</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant, index) => (
                      <motion.div
                        key={restaurant._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                        className="bg-gray-50 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
                      >
                        <div className="h-40 overflow-hidden bg-gray-200">
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
                          <div className="flex items-center gap-2 mb-2">
                            <FiStar className="text-yellow-400 fill-current" />
                            <span className="font-semibold">{restaurant.rating || 0}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">{restaurant.cuisine}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{restaurant.deliveryTime}</span>
                            <span className="text-sm text-gray-500">${restaurant.deliveryFee} delivery</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Menu Items Tab */}
            {activeTab === 'menu' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {menuItems.length === 0 ? (
                  <div className="text-center py-12">
                    <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No menu items available for this deal</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200 hover:border-orange-500 transition-colors"
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
                        {item.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <span className="text-lg font-bold text-orange-500">
                              ${item.price.toFixed(2)}
                            </span>
                            {deal.discountType === 'percentage' && (
                              <span className="ml-2 text-sm text-green-600 line-through">
                                ${(item.price / (1 - deal.discountValue / 100)).toFixed(2)}
                              </span>
                            )}
                          </div>
                          {item.restaurantId?.name && (
                            <span className="text-xs text-gray-500">{item.restaurantId.name}</span>
                          )}
                        </div>
                        <motion.button
                          onClick={() => handleAddToCart(item, item.restaurantId?.name || 'Restaurant')}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                        >
                          <FiPlus />
                          Add to Cart
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="text-center mt-8">
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

export default DealDetail

