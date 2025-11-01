import api from './api'

export const getDeals = async () => {
  const response = await api.get('/deals')
  return response.data
}

export const getDeal = async (id) => {
  const response = await api.get(`/deals/${id}`)
  return response.data
}

export const getDealItems = async (id) => {
  const response = await api.get(`/deals/${id}/items`)
  return response.data
}

