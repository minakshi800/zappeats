import api from './api'

export const createPaymentIntent = async (amount, metadata = {}) => {
  const response = await api.post('/payments/create-intent', {
    amount,
    currency: 'usd',
    metadata
  })
  return response.data
}

export const createOrderWithPayment = async (orderData, paymentIntentId = null) => {
  const response = await api.post('/payments/create-order', {
    ...orderData,
    paymentIntentId
  })
  return response.data
}

export const verifyPayment = async (paymentIntentId, orderId = null) => {
  const response = await api.post('/payments/verify', {
    paymentIntentId,
    orderId
  })
  return response.data
}

