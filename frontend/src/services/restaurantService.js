import api from './api'

export const getRestaurants = async (filters = {}) => {
  const response = await api.get('/restaurants', { params: filters })
  return response.data
}

export const getRestaurant = async (id) => {
  const response = await api.get(`/restaurants/${id}`)
  return response.data
}

export const getRestaurantReviews = async (id) => {
  const response = await api.get(`/restaurants/${id}/reviews`)
  return response.data
}

export const createReview = async (restaurantId, reviewData) => {
  const response = await api.post(`/restaurants/${restaurantId}/reviews`, reviewData)
  return response.data
}

export const getRestaurantMenu = async (id) => {
  const response = await api.get(`/restaurants/${id}/menu`)
  return response.data
}

export const bookTable = async (restaurantId, bookingData) => {
  const response = await api.post(`/restaurants/${restaurantId}/book-table`, bookingData)
  return response.data
}

export const searchFood = async (query) => {
  const response = await api.get('/restaurants/search/food', { params: { q: query } })
  return response.data
}

