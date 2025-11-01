import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import Header from '../components/Header'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getDealDiscount, getCartTotalAfterDeals } = useCart()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // TODO: Navigate to checkout page
    navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-700 hover:text-orange-500 mb-8 transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span className="font-semibold">Back to Home</span>
            </motion.button>

            {/* Empty Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-12 text-center"
            >
              <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8">Add some delicious food to get started!</p>
              <Link to="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
                >
                  Browse Restaurants
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = getCartTotal()
  const dealDiscount = getDealDiscount()
  const subtotalAfterDeals = getCartTotalAfterDeals()
  const deliveryFee = 2.99
  const tax = subtotalAfterDeals * 0.1
  const total = subtotalAfterDeals + deliveryFee + tax

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-700 hover:text-orange-500 mb-8 transition-colors"
          >
            <FiArrowLeft className="text-xl" />
            <span className="font-semibold">Back to Home</span>
          </motion.button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2 space-y-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>
              
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
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

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                      <p className="text-gray-600 mb-4">${item.price?.toFixed(2) || '0.00'}</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 border-2 border-gray-200 rounded-lg px-3 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            <FiMinus />
                          </button>
                          <span className="font-semibold text-gray-800 w-8 text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="text-orange-500 hover:text-orange-600"
                          >
                            <FiPlus />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-500">
                        ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {dealDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Deal Discount</span>
                      <span>-${dealDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleCheckout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-shadow mb-4"
                >
                  Proceed to Checkout
                </motion.button>

                <button
                  onClick={clearCart}
                  className="w-full text-gray-600 hover:text-red-500 py-2 text-sm transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart

