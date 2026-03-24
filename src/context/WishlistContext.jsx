/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])

  const addItem = (product) => {
    setWishlist(prev =>
      prev.find(p => p.id === product.id) ? prev : [...prev, product]
    )
  }

  const removeItem = (productId) => {
    setWishlist(prev => prev.filter(p => p.id !== productId))
  }

  const isWishlisted = (productId) => wishlist.some(p => p.id === productId)

  return (
    <WishlistContext.Provider value={{ wishlist, addItem, removeItem, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider')
  return context
}