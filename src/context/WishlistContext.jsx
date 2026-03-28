/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('findspot_wishlist')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // ✅ Persist to localStorage
  useEffect(() => {
    localStorage.setItem('findspot_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addItem = (product) => {
    if (!product?.id) return

    setWishlist(prev =>
      prev.some(p => p.id === product.id)
        ? prev
        : [
            ...prev,
            {
              id: product.id,
              title: product.title,
              image: product.image,
              price: product.price,
              platform: product.platform,
              url: product.url,
              rating: product.rating || 0,
              reviews: product.reviews || 0,
            },
          ]
    )
  }

  const removeItem = (productId) => {
    setWishlist(prev => prev.filter(p => p.id !== productId))
  }

  const isWishlisted = (productId) =>
    wishlist.some(p => p.id === productId)

  return (
    <WishlistContext.Provider
      value={{ wishlist, addItem, removeItem, isWishlisted }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider')
  return context
}