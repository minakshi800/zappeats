import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPercent, FiTag, FiClock, FiArrowRight, FiArrowLeft } from 'react-icons/fi'
import Header from '../components/Header'
import { getDeals } from '../services/dealService'
import { toast } from 'react-toastify'

const Deals = () => {
  const navigate = useNavigate()
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      const response = await getDeals()
      if (response.success) {
        setDeals(response.data)
      }
    } catch (error) {
      toast.error('Failed to load deals')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const formatDiscount = (deal) => {
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

  const formatValidUntil = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6 sm:py-8 relative">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/')}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-0 left-2 sm:left-4 z-10 flex items-center gap-1 sm:gap-2 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-gray-700 dark:text-dark-text hover:text-orange-500 mb-8"
        >
          <FiArrowLeft className="text-lg sm:text-xl" />
          <span className="font-semibold text-sm sm:text-base">Back</span>
        </motion.button>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 mt-12 sm:mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-dark-text mb-2 sm:mb-4">Exclusive Deals</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-dark-muted">Save big on your favorite food</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading deals...</div>
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-gray-500 text-xl">No deals available at the moment</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {deals.map((deal, index) => (
              <motion.div
                key={deal._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => navigate(`/deals/${deal._id}`)}
                className="bg-white dark:bg-dark-card rounded-xl sm:rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all border border-gray-200 dark:border-dark-border"
              >
                {/* Deal Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-200">
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
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = getFallbackImage()
                        }}
                      />
                    )
                  })()}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-lg shadow-lg">
                      {formatDiscount(deal)}
                    </div>
                  </div>
                </div>

                {/* Deal Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">{deal.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-dark-muted mb-3 sm:mb-4 line-clamp-2">{deal.description}</p>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 dark:text-dark-muted">
                    <div className="flex items-center gap-1">
                      <FiTag />
                      <span>Code: {deal.code}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiClock />
                      <span>Valid until {formatValidUntil(deal.validUntil)}</span>
                    </div>
                  </div>

                  {deal.minOrderAmount > 0 && (
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-muted mb-3 sm:mb-4">
                      Min order: ${deal.minOrderAmount}
                    </p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-2 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    View Offer
                    <FiArrowRight />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Deals

