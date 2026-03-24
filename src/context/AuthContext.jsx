/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
  const token = localStorage.getItem('findspot_token')

  if (!token) {
    setLoading(false)
    return
  }

  try {
    const res = await getMe()
    const userData = res.data.user

    // Ensure name is always set
    const userWithName = {
      ...userData,
      name: userData.name || 
            `${userData.firstName} ${userData.lastName}`.trim() || 
            userData.email,
    }

    setUser(userWithName)
  } catch (err) {
    console.log('Session expired — logging out')
    localStorage.removeItem('findspot_token')
    localStorage.removeItem('findspot_user')
    setUser(null)
  } finally {
    setLoading(false)
  }
}

    initAuth()
  }, [])

  const login = (userData, token) => {
  // Ensure name is always available
  const userWithName = {
    ...userData,
    name: userData.name || 
          `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 
          userData.email,
  }
  localStorage.setItem('findspot_token', token)
  localStorage.setItem('findspot_user', JSON.stringify(userWithName))
  setUser(userWithName)
}

  const logout = () => {
    localStorage.removeItem('findspot_token')
    localStorage.removeItem('findspot_user')
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#0b0b0b] border-t-transparent 
                          rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-light">Loading findSpot...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}