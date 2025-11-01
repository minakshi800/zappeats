import api from './api'

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData)
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token)
  }
  return response.data
}

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData)
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token)
  }
  return response.data
}

export const getMe = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData)
  return response.data
}

export const updatePassword = async (passwordData) => {
  const response = await api.put('/auth/update-password', passwordData)
  return response.data
}

export const deleteAccount = async () => {
  const response = await api.delete('/auth/delete-account')
  return response.data
}

