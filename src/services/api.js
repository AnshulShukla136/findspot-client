import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('findspot_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle responses
api.interceptors.response.use(
  (response) => {
    // If server sends new token — save it
    const newToken = response.headers['x-new-token']
    if (newToken) {
      localStorage.setItem('findspot_token', newToken)
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear and redirect to login
      localStorage.removeItem('findspot_token')
      localStorage.removeItem('findspot_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ──
export const loginUser = (data) => api.post('/auth/login', data)
export const registerUser = (data) => api.post('/auth/register', data)
export const sendOtp = (email) => api.post('/auth/send-otp', { email, isLogin: false })
export const sendOtpLogin = (email) => api.post('/auth/send-otp', { email, isLogin: true })
export const verifyOtp = (email, otp) => api.post('/auth/verify-otp', { email, otp })
export const getMe = () => api.get('/auth/me')
export const googleAuth = (accessToken) => api.post('/auth/google', { accessToken })

// ── Search ──
export const searchProducts = (query, filters = {}) =>
  api.get('/search', { params: { q: query, ...filters } })

// ── Products ──
export const getProductById = (id) => api.get(`/products/${id}`)

// ── Wishlist ──
export const getWishlist = () => api.get('/wishlist')
export const addToWishlist = (productId) => api.post('/wishlist', { productId })
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`)

export default api