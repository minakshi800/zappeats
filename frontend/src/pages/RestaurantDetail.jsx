import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiStar, 
  FiClock, 
  FiPhone, 
  FiMail, 
  FiMapPin,
  FiArrowLeft,
  FiCamera,
  FiPlus,
  FiShoppingCart
} from 'react-icons/fi'
import Header from '../components/Header'
import {
  getRestaurant,
  getRestaurantReviews,
  createReview,
  getRestaurantMenu,
  bookTable
} from '../services/restaurantService'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'

const RestaurantDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const [activeTab, setActiveTab] = useState('overview')
  const [restaurant, setRestaurant] = useState(null)
  const [reviews, setReviews] = useState([])
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Review form
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  })
  
  // Booking form
  const [bookingForm, setBookingForm] = useState({
    date: '',
    time: '',
    numberOfGuests: 2,
    mealType: 'dinner',
    specialRequests: '',
    contactPhone: ''
  })

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [restaurantRes, reviewsRes, menuRes] = await Promise.all([
        getRestaurant(id),
        getRestaurantReviews(id),
        getRestaurantMenu(id)
      ])
      
      if (restaurantRes.success) setRestaurant(restaurantRes.data)
      if (reviewsRes.success) setReviews(reviewsRes.data)
      if (menuRes.success) setMenu(menuRes.data)
    } catch (error) {
      toast.error('Failed to load restaurant details')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to submit a review')
      navigate('/login')
      return
    }
    
    try {
      const response = await createReview(id, reviewForm)
      if (response.success) {
        toast.success('Review submitted successfully!')
        setReviewForm({ rating: 5, comment: '' })
        fetchData()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    }
  }

  const handleBookTable = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to book a table')
      navigate('/login')
      return
    }
    
    try {
      const response = await bookTable(id, bookingForm)
      if (response.success) {
        toast.success('Table booked successfully!')
        setBookingForm({
          date: '',
          time: '',
          numberOfGuests: 2,
          mealType: 'dinner',
          specialRequests: '',
          contactPhone: ''
        })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book table')
    }
  }

  const handleAddToCart = (item) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      restaurantId: id,
      restaurantName: restaurant?.name
    })
    toast.success(`${item.name} added to cart!`)
  }

  if (loading || !restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-gray-500">Loading restaurant details...</div>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'photos', label: 'Photos' },
    { id: 'menu', label: 'Menu' },
    { id: 'book', label: 'Book a Table' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Image */}
      <div className="relative h-96 overflow-hidden bg-gray-200">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <motion.button
          onClick={() => navigate('/restaurants')}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-gray-700 hover:text-orange-500"
        >
          <FiArrowLeft className="text-xl" />
          <span className="font-semibold">Back</span>
        </motion.button>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 -mt-20 relative z-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{restaurant.name}</h1>
          
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center gap-2">
              <FiStar className="text-yellow-400 fill-current text-xl" />
              <span className="text-xl font-bold">{restaurant.rating || 0}</span>
              <span className="text-gray-600">({restaurant.reviewCount || 0} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FiClock />
              <span>{restaurant.deliveryTime}</span>
            </div>
            {restaurant.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <FiPhone />
                <span>{restaurant.phone}</span>
              </div>
            )}
            {restaurant.location?.address && (
              <div className="flex items-center gap-2 text-gray-600">
                <FiMapPin />
                <span>{restaurant.location.address}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">{restaurant.description}</p>
          
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-semibold">
              {restaurant.cuisine}
            </span>
            <span className="text-gray-600">
              Delivery Fee: ${restaurant.deliveryFee} • Min Order: ${restaurant.minimumOrder}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex flex-wrap border-b border-gray-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-orange-500 border-b-2 border-orange-500'
                    : 'text-gray-600 hover:text-orange-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">About {restaurant.name}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{restaurant.description}</p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">Contact Information</h3>
                    {restaurant.phone && (
                      <p className="text-gray-600 mb-2 flex items-center gap-2">
                        <FiPhone /> {restaurant.phone}
                      </p>
                    )}
                    {restaurant.email && (
                      <p className="text-gray-600 mb-2 flex items-center gap-2">
                        <FiMail /> {restaurant.email}
                      </p>
                    )}
                    {restaurant.location?.address && (
                      <p className="text-gray-600 flex items-center gap-2">
                        <FiMapPin /> {restaurant.location.address}, {restaurant.location.city}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3">Delivery Information</h3>
                    <p className="text-gray-600 mb-2">Delivery Time: {restaurant.deliveryTime}</p>
                    <p className="text-gray-600 mb-2">Delivery Fee: ${restaurant.deliveryFee}</p>
                    <p className="text-gray-600">Minimum Order: ${restaurant.minimumOrder}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Reviews ({reviews.length})
                  </h2>
                </div>

                {/* Add Review Form */}
                {isAuthenticated && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className={`text-3xl ${
                                star <= reviewForm.rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-4">
                        <textarea
                          value={reviewForm.comment}
                          onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          placeholder="Write your review..."
                          rows={4}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                      >
                        Submit Review
                      </button>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No reviews yet</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {review.userId?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-bold text-gray-800">
                                {review.userId?.name || 'Anonymous'}
                              </h4>
                              <div className="flex items-center gap-1">
                                <FiStar className="text-yellow-400 fill-current" />
                                <span className="font-semibold">{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-2">{review.comment}</p>
                            <span className="text-sm text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Photos Tab */}
            {activeTab === 'photos' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Photos</h2>
                {restaurant.photos && restaurant.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {restaurant.photos.map((photo, index) => (
                      <div key={index} className="rounded-xl overflow-hidden">
                        <img
                          src={photo}
                          alt={`${restaurant.name} ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiCamera className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No photos available</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Menu Tab */}
            {activeTab === 'menu' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Menu</h2>
                {menu.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Menu not available</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {['appetizer', 'main', 'dessert', 'beverage', 'salad', 'soup', 'side'].map((category) => {
                      const categoryItems = menu.filter((item) => item.category === category)
                      if (categoryItems.length === 0) return null
                      
                      return (
                        <div key={category}>
                          <h3 className="text-xl font-bold text-gray-800 mb-4 capitalize">
                            {category}
                          </h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {categoryItems.map((item) => (
                              <div
                                key={item._id}
                                className="bg-gray-50 rounded-xl p-4 flex items-center gap-4"
                              >
                                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
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
                                      <FiShoppingCart className="text-3xl text-orange-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-bold text-gray-800 mb-1">{item.name}</h4>
                                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                                  <p className="text-lg font-bold text-orange-500">${item.price.toFixed(2)}</p>
                                </div>
                                <button
                                  onClick={() => handleAddToCart(item)}
                                  className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-shadow flex-shrink-0"
                                >
                                  <FiPlus />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* Book a Table Tab */}
            {activeTab === 'book' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Book a Table</h2>
                {!isAuthenticated ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 text-center">
                    <p className="text-gray-700 mb-4">Please login to book a table</p>
                    <button
                      onClick={() => navigate('/login')}
                      className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold"
                    >
                      Login
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookTable} className="max-w-2xl space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Time
                        </label>
                        <input
                          type="time"
                          value={bookingForm.time}
                          onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Guests
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={bookingForm.numberOfGuests}
                          onChange={(e) => setBookingForm({ ...bookingForm, numberOfGuests: parseInt(e.target.value) })}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Meal Type
                        </label>
                        <select
                          value={bookingForm.mealType}
                          onChange={(e) => setBookingForm({ ...bookingForm, mealType: e.target.value })}
                          required
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        >
                          <option value="breakfast">Breakfast</option>
                          <option value="lunch">Lunch</option>
                          <option value="dinner">Dinner</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        value={bookingForm.contactPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, contactPhone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        placeholder="Any special requests or dietary requirements..."
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-shadow"
                    >
                      Book Table
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDetail

