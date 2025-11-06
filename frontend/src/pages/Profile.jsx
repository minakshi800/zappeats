import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiShoppingBag, 
  FiShoppingCart, 
  FiSettings,
  FiEdit2,
  FiLock,
  FiTrash2,
  FiLogOut,
  FiCamera,
  FiArrowLeft
} from 'react-icons/fi'
import { toast } from 'react-toastify'
import Header from '../components/Header'
import ConfirmModal from '../components/ConfirmModal'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { getMe, updateProfile, updatePassword, deleteAccount } from '../services/authService'
import { getMyOrders } from '../services/orderService'

const Profile = () => {
  const navigate = useNavigate()
  const { user: authUser, logout: authLogout, checkAuth } = useAuth()
  const { cartItems } = useCart()
  const [activeTab, setActiveTab] = useState('account')
  const [user, setUser] = useState(authUser)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  
  // Modal states
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', zipCode: '' }
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!authUser) {
      navigate('/login')
    } else {
      fetchUserData()
      fetchOrders()
    }
  }, [authUser, navigate])

  // Refresh orders when switching to orders tab
  useEffect(() => {
    if (activeTab === 'orders' && authUser) {
      fetchOrders()
    }
  }, [activeTab, authUser])

  const fetchUserData = async () => {
    try {
      const response = await getMe()
      if (response.success) {
        setUser(response.data)
        setProfileForm({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: response.data.address || { street: '', city: '', zipCode: '' }
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await getMyOrders()
      if (response.success) {
        setOrders(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await updateProfile(profileForm)
      if (response.success) {
        toast.success('Profile updated successfully!')
        await checkAuth()
        await fetchUserData()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setLoading(true)
    try {
      const response = await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      })
      if (response.success) {
        toast.success('Password updated successfully!')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      const response = await deleteAccount()
      if (response.success) {
        toast.success('Account deleted successfully')
        authLogout()
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authLogout()
    navigate('/')
    toast.success('Logged out successfully')
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = async () => {
        const avatarUrl = reader.result
        try {
          const response = await updateProfile({ avatar: avatarUrl })
          if (response.success) {
            toast.success('Profile picture updated!')
            await checkAuth()
            await fetchUserData()
          }
        } catch (error) {
          toast.error('Failed to update profile picture')
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const tabs = [
    { id: 'account', label: 'My Account', icon: FiUser },
    { id: 'orders', label: 'My Orders', icon: FiShoppingBag },
    { id: 'cart', label: 'My Cart', icon: FiShoppingCart },
    { id: 'settings', label: 'Settings', icon: FiSettings },
  ]

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 relative">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-0 left-4 z-10"
        >
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all text-gray-700 hover:text-orange-500"
          >
            <FiArrowLeft className="text-xl" />
            <span className="font-semibold">Back</span>
          </motion.button>
        </motion.div>
        
        <div className="mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const parent = e.target.parentElement
                        if (parent && user?.name) {
                          const fallback = document.createElement('span')
                          fallback.textContent = user.name.charAt(0).toUpperCase()
                          parent.appendChild(fallback)
                        }
                      }}
                    />
                  ) : (
                    <span>{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                  <FiCamera className="text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                <p className="text-gray-600 mb-4">{user.email}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-500">
                  {user.phone && <span className="flex items-center gap-1"><FiPhone /> {user.phone}</span>}
                  {user.address?.city && <span className="flex items-center gap-1"><FiMapPin /> {user.address.city}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-6">
            <div className="flex flex-wrap border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                      activeTab === tab.id
                        ? 'text-orange-500 border-b-2 border-orange-500'
                        : 'text-gray-600 hover:text-orange-500'
                    }`}
                  >
                    <Icon />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className="p-8">
              {/* My Account Tab */}
              {activeTab === 'account' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-2xl mx-auto"
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">My Account</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                        <input
                          type="text"
                          value={profileForm.address.street}
                          onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, street: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={profileForm.address.city}
                          onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, city: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                        <input
                          type="text"
                          value={profileForm.address.zipCode}
                          onChange={(e) => setProfileForm({ ...profileForm, address: { ...profileForm.address, zipCode: e.target.value } })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Update Profile'}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* My Orders Tab */}
              {activeTab === 'orders' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-dark-text">My Orders</h2>
                  {orders.length === 0 ? (
                    <div className="text-center py-12">
                      <FiShoppingBag className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-dark-muted mb-4">No orders yet</p>
                      <motion.button
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                      >
                        Browse Restaurants
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const orderDate = new Date(order.createdAt)
                        const statusColors = {
                          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                          confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
                          preparing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
                          out_for_delivery: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
                          delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                          cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }
                        return (
                          <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 border border-gray-200 dark:border-dark-border"
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-bold text-gray-800 dark:text-dark-text">
                                    Order #{order.orderNumber}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || statusColors.pending}`}>
                                    {order.status.replace('_', ' ').toUpperCase()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-dark-muted">
                                  {orderDate.toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-dark-muted mt-1">
                                  {order.deliveryAddress.city}, {order.deliveryAddress.address}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-orange-500">
                                  ${order.total.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-dark-muted">
                                  {order.paymentMethod === 'card' ? 'Paid with Card' : 'Cash on Delivery'}
                                </p>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="border-t border-gray-200 dark:border-dark-border pt-4 mt-4">
                              <h4 className="font-semibold text-gray-700 dark:text-dark-text mb-3">Items:</h4>
                              <div className="space-y-2">
                                {order.items.map((item, index) => (
                                  <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-3">
                                      {item.image && (
                                        <img 
                                          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'} 
                                          alt={item.name}
                                          className="w-12 h-12 rounded-lg object-cover"
                                          onError={(e) => {
                                            e.target.onerror = null
                                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
                                          }}
                                        />
                                      )}
                                      <div>
                                        <p className="font-semibold text-gray-800 dark:text-dark-text">{item.name}</p>
                                        {item.restaurantName && (
                                          <p className="text-xs text-gray-500 dark:text-dark-muted">{item.restaurantName}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold text-gray-800 dark:text-dark-text">
                                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                                      </p>
                                      <p className="text-orange-500 font-bold">
                                        ${(item.price * item.quantity).toFixed(2)}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t border-gray-200 dark:border-dark-border pt-4 mt-4">
                              <div className="flex justify-between text-sm text-gray-600 dark:text-dark-muted mb-1">
                                <span>Subtotal:</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600 dark:text-dark-muted mb-1">
                                <span>Delivery Fee:</span>
                                <span>${order.deliveryFee.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600 dark:text-dark-muted mb-2">
                                <span>Tax:</span>
                                <span>${order.tax.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-bold text-gray-800 dark:text-dark-text pt-2 border-t border-gray-200 dark:border-dark-border">
                                <span>Total:</span>
                                <span className="text-orange-500">${order.total.toFixed(2)}</span>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* My Cart Tab */}
              {activeTab === 'cart' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-dark-text">My Cart</h2>
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <FiShoppingCart className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-dark-muted">Your cart is empty</p>
                      <motion.button
                        onClick={() => navigate('/')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                      >
                        Browse Restaurants
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-4 border border-gray-200 dark:border-dark-border"
                        >
                          <div className="flex gap-4">
                            {/* Item Image */}
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-darker flex-shrink-0">
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
                                  <FiShoppingCart className="text-2xl text-orange-400" />
                                </div>
                              )}
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-gray-800 dark:text-dark-text mb-1 truncate">
                                {item.name}
                              </h3>
                              {item.restaurantName && (
                                <p className="text-sm text-gray-500 dark:text-dark-muted mb-2">
                                  {item.restaurantName}
                                </p>
                              )}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <span className="text-lg font-bold text-orange-500">
                                    ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                                  </span>
                                  <span className="text-sm text-gray-500 dark:text-dark-muted">
                                    Qty: {item.quantity || 1}
                                  </span>
                                </div>
                                <motion.button
                                  onClick={() => navigate('/cart')}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="text-orange-500 hover:text-orange-600 text-sm font-semibold px-4 py-2 rounded-lg border border-orange-500 hover:bg-orange-50 dark:hover:bg-dark-darker transition-colors"
                                >
                                  View in Cart
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      <div className="pt-4 border-t border-gray-200 dark:border-dark-border">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-semibold text-gray-700 dark:text-dark-text">Total:</span>
                          <span className="text-2xl font-bold text-orange-500">
                            ${cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}
                          </span>
                        </div>
                        <motion.button
                          onClick={() => navigate('/cart')}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                        >
                          Go to Cart
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-2xl mx-auto space-y-8"
                >
                  {/* Update Password */}
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Password</h2>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                          required
                          minLength={6}
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </motion.button>
                    </form>
                  </div>

                  {/* Danger Zone */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-bold mb-4 text-red-600">Danger Zone</h3>
                    
                    <div className="space-y-4">
                      <motion.button
                        onClick={() => setShowLogoutModal(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                      >
                        <FiLogOut />
                        Logout
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setShowDeleteModal(true)}
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <FiTrash2 />
                        Delete Account
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone. All your data, orders, and information will be permanently deleted."
        confirmText="Delete Account"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

export default Profile

