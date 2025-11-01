import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCreditCard, FiMapPin, FiPhone, FiMail, FiLock, FiTag, FiX, FiShoppingCart } from 'react-icons/fi'
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js'
import stripePromise from '../config/stripe'
import Header from '../components/Header'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { createOrderWithPayment, createPaymentIntent, verifyPayment } from '../services/paymentService'
import { validateCoupon } from '../services/couponService'
import StripeCardElement from '../components/StripeCardElement'

const CheckoutContent = () => {
  const navigate = useNavigate()
  const stripe = useStripe()
  const elements = useElements()
  const { cartItems, getCartTotal, clearCart, getDealDiscount, getCartTotalAfterDeals } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)
  const [paymentIntentId, setPaymentIntentId] = useState(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'card',
    cardName: '',
    deliveryInstructions: ''
  })

  const subtotal = getCartTotal()
  const dealDiscount = getDealDiscount()
  const subtotalAfterDeals = getCartTotalAfterDeals()
  const couponDiscount = appliedCoupon?.discountAmount || 0
  const deliveryFee = appliedCoupon?.discountType === 'free_delivery' ? 0 : 2.99
  const taxableAmount = Math.max(0, subtotalAfterDeals - couponDiscount)
  const tax = taxableAmount * 0.1
  const total = taxableAmount + deliveryFee + tax

  // Handle coupon validation
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code')
      return
    }

    setCouponLoading(true)
    try {
      const response = await validateCoupon(couponCode.trim(), cartItems, subtotalAfterDeals)
      if (response.success) {
        setAppliedCoupon(response.data)
        toast.success('Coupon applied successfully!')
      }
    } catch (error) {
      toast.error(error.message || 'Invalid coupon code')
      setAppliedCoupon(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    toast.info('Coupon removed')
  }

  // Create payment intent when component mounts and payment method is card
  useEffect(() => {
    if (formData.paymentMethod === 'card' && total > 0 && !clientSecret) {
      const createIntent = async () => {
        try {
          const response = await createPaymentIntent(total)
          if (response.success) {
            setClientSecret(response.clientSecret)
            setPaymentIntentId(response.paymentIntentId)
          }
        } catch (error) {
          console.error('Error creating payment intent:', error)
          toast.error('Failed to initialize payment. Please check your Stripe configuration.')
        }
      }
      createIntent()
    } else if (formData.paymentMethod === 'cash') {
      // Reset payment intent when switching to cash
      setClientSecret(null)
      setPaymentIntentId(null)
    }
  }, [formData.paymentMethod, total, clientSecret])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      toast.error('Please fill in all required fields')
      setLoading(false)
      return
    }

    try {
      const orderData = {
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image || '',
          restaurantName: item.restaurantName || 'Unknown Restaurant'
        })),
        subtotal: subtotalAfterDeals,
        deliveryFee,
        tax,
        total,
        dealDiscount,
        couponCode: appliedCoupon?.code || null,
        couponDiscount,
        totalDiscount: dealDiscount + couponDiscount,
        deliveryAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          deliveryInstructions: formData.deliveryInstructions
        },
        paymentMethod: formData.paymentMethod
      }

      // Handle payment based on method
      if (formData.paymentMethod === 'card') {
        // Process card payment with Stripe
        if (!stripe || !elements || !clientSecret) {
          toast.error('Payment system not ready. Please try again.')
          setLoading(false)
          return
        }

        const cardElement = elements.getElement('card')
        if (!cardElement) {
          toast.error('Card details not found')
          setLoading(false)
          return
        }

        // Confirm payment with Stripe
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.cardName || formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.zipCode,
              }
            }
          }
        })

        if (stripeError) {
          toast.error(stripeError.message || 'Payment failed. Please try again.')
          setLoading(false)
          return
        }

        if (paymentIntent.status === 'succeeded') {
          // Payment succeeded, create order with payment
          const response = await createOrderWithPayment(orderData, paymentIntent.id)
          
          if (response.success) {
            toast.success('Order placed successfully!')
            clearCart()
            navigate('/order-success')
          } else {
            toast.error(response.message || 'Failed to place order')
            setLoading(false)
          }
        } else {
          toast.error('Payment was not completed. Please try again.')
          setLoading(false)
        }
      } else {
        // Cash on delivery - no payment processing needed
        const response = await createOrderWithPayment(orderData, null)
        
        if (response.success) {
          toast.success('Order placed successfully!')
          clearCart()
          navigate('/order-success')
        } else {
          toast.error(response.message || 'Failed to place order')
          setLoading(false)
        }
      }
    } catch (error) {
      console.error('Order error:', error)
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.')
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <motion.button
              onClick={() => navigate('/cart')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-700 dark:text-dark-text hover:text-orange-500 mb-8 transition-colors"
            >
              <FiArrowLeft className="text-xl" />
              <span className="font-semibold">Back to Cart</span>
            </motion.button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-12 text-center"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-dark-text mb-4">Your cart is empty</h2>
              <p className="text-gray-500 dark:text-dark-muted mb-8">Add some items to your cart before checkout!</p>
              <motion.button
                onClick={() => navigate('/cart')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow"
              >
                Go to Cart
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.button
            onClick={() => navigate('/cart')}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-700 dark:text-dark-text hover:text-orange-500 mb-8 transition-colors"
          >
            <FiArrowLeft className="text-xl" />
            <span className="font-semibold">Back to Cart</span>
          </motion.button>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-6 flex items-center gap-2">
                  <FiMapPin className="text-orange-500" />
                  Delivery Information
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker text-gray-800 dark:text-dark-text focus:border-orange-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker text-gray-800 dark:text-dark-text focus:border-orange-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker text-gray-800 dark:text-dark-text focus:border-orange-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker text-gray-800 dark:text-dark-text focus:border-orange-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker text-gray-800 dark:text-dark-text focus:border-orange-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                        Zip Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker text-gray-800 dark:text-dark-text focus:border-orange-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker text-gray-800 dark:text-dark-text focus:border-orange-500 focus:outline-none transition-colors resize-none"
                        placeholder="Any special instructions for delivery?"
                      />
                    </div>
                  </div>
                </form>
              </motion.div>

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-6 flex items-center gap-2">
                  <FiCreditCard className="text-orange-500" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-dark-border rounded-xl cursor-pointer hover:border-orange-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-orange-500"
                      />
                      <span className="font-semibold text-gray-800 dark:text-dark-text">Credit/Debit Card</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-dark-border rounded-xl cursor-pointer hover:border-orange-500 transition-colors">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-orange-500"
                      />
                      <span className="font-semibold text-gray-800 dark:text-dark-text">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
                    {clientSecret ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                            Cardholder Name *
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            required={formData.paymentMethod === 'card'}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker text-gray-800 dark:text-dark-text focus:border-orange-500 focus:outline-none transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 dark:text-dark-text mb-2">
                            Card Details *
                          </label>
                          <StripeCardElement />
                          <p className="text-xs text-gray-500 dark:text-dark-muted mt-2">
                            Your card details are securely processed by Stripe
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500 dark:text-dark-muted">Initializing secure payment...</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Coupon Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-6 flex items-center gap-2">
                  <FiTag className="text-orange-500" />
                  Apply Coupon
                </h2>
                
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-dark-border bg-white dark:bg-dark-darker text-gray-800 dark:text-dark-text focus:border-orange-500 focus:outline-none transition-colors"
                    />
                    <motion.button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-500">
                    <div className="flex items-center gap-2">
                      <FiTag className="text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-semibold text-green-700 dark:text-green-300">
                          {appliedCoupon.code}
                        </p>
                        {appliedCoupon.description && (
                          <p className="text-sm text-green-600 dark:text-green-400">
                            {appliedCoupon.description}
                          </p>
                        )}
                        <p className="text-sm font-bold text-green-600 dark:text-green-400 mt-1">
                          {appliedCoupon.discountType === 'percentage' 
                            ? `${appliedCoupon.discountValue}% off`
                            : appliedCoupon.discountType === 'free_delivery'
                            ? 'Free delivery'
                            : `$${appliedCoupon.discountValue} off`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="p-2 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                    >
                      <FiX className="text-green-700 dark:text-green-300" />
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-6 sticky top-24"
              >
                <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-6">Order Summary</h2>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-dark-border last:border-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-darker flex-shrink-0">
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
                            <FiShoppingCart className="text-xl text-orange-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-dark-text truncate">{item.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-dark-muted">Qty: {item.quantity || 1}</p>
                        <p className="text-sm font-bold text-orange-500 mt-1">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-4 mb-6 pt-4 border-t border-gray-200 dark:border-dark-border">
                  <div className="flex justify-between text-gray-600 dark:text-dark-muted">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {dealDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Deal Discount</span>
                      <span>-${dealDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Coupon Discount</span>
                      <span>-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600 dark:text-dark-muted">
                    <span>Delivery Fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-dark-muted">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-dark-border pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-dark-text">
                      <span>Total</span>
                      <span className="text-orange-500">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-muted mb-6">
                  <FiLock className="text-orange-500" />
                  <span>Secure payment processing</span>
                </div>

                {/* Place Order Button */}
                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FiLock />
                      <span>Place Order</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  )
}

export default Checkout

