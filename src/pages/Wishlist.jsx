import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, Trash2, ExternalLink, ShoppingBag } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useWishlist } from '../hooks/useWishlist'
import toast from 'react-hot-toast'

const PLATFORM_COLORS = {
  Amazon: 'bg-orange-50 text-orange-600 border-orange-100',
  Flipkart: 'bg-blue-50 text-blue-600 border-blue-100',
  Myntra: 'bg-pink-50 text-pink-600 border-pink-100',
  Ajio: 'bg-purple-50 text-purple-600 border-purple-100',
  Meesho: 'bg-red-50 text-red-500 border-red-100',
  Nykaa: 'bg-rose-50 text-rose-600 border-rose-100',
}

export default function Wishlist() {
  const navigate = useNavigate()
  const { wishlist, removeItem } = useWishlist()

  const handleRemove = (id, title) => {
    removeItem(id)
    toast.success('Removed from wishlist')
  }

  // Empty state
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center 
                          justify-center mx-auto mb-5">
            <Heart size={24} className="text-gray-300" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#0b0b0b] mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-gray-400 font-light mb-8 max-w-xs mx-auto">
            Save products you love and track their prices over time
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-[#0b0b0b] text-white 
                       text-sm font-medium px-6 py-3 rounded-xl hover:bg-[#222] 
                       transition-colors"
          >
            <ShoppingBag size={15} />
            Start shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-2xl font-normal text-[#0b0b0b] mb-1">
              My Wishlist
            </h1>
            <p className="text-sm text-gray-400 font-light">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map(product => (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden 
                         hover:shadow-md hover:border-gray-200 transition-all group"
            >
              {/* Image */}
              <div
                onClick={() => navigate(`/product/${product.id}`)}
                className="relative bg-gray-50 aspect-square overflow-hidden cursor-pointer"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-4 group-hover:scale-105 
                             transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
                  }}
                />

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(product.id, product.title)
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full 
                             flex items-center justify-center shadow-sm 
                             hover:bg-red-50 transition-colors group/btn"
                >
                  <Trash2
                    size={13}
                    className="text-gray-300 group-hover/btn:text-red-500 transition-colors"
                  />
                </button>
              </div>

              {/* Info */}
              <div className="p-3">
                <p
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-xs text-gray-600 line-clamp-2 mb-2 
                             leading-relaxed cursor-pointer hover:text-[#0b0b0b] 
                             transition-colors"
                >
                  {product.title}
                </p>

                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="font-medium text-[#0b0b0b] text-base">
                    ₹{product.price?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border 
                                   ${PLATFORM_COLORS[product.platform] 
                                     || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                    {product.platform}
                  </span>
                </div>

                {/* View deal button */}
                <button
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 
                             border border-gray-200 rounded-xl text-xs text-gray-600 
                             hover:bg-[#0b0b0b] hover:text-white hover:border-[#0b0b0b] 
                             transition-all"
                >
                  View deals
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-gray-400 text-center font-light">
            © 2026 findSpot. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}