import api from './api'

export const validateCoupon = async (code, cartItems, subtotal) => {
  try {
    const response = await api.post('/coupons/validate', {
      code,
      cartItems: cartItems.map(item => ({
        id: item.id,
        restaurantId: item.restaurantId,
        price: item.price,
        quantity: item.quantity || 1
      })),
      subtotal
    })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to validate coupon' }
  }
}

export const getCoupons = async () => {
  try {
    const response = await api.get('/coupons')
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch coupons' }
  }
}

