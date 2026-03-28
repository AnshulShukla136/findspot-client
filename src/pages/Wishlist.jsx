import { useNavigate } from 'react-router-dom'
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

  const handleRemove = (id) => {
    removeItem(id)
    toast.success('Removed from wishlist')
  }

  // Empty state
  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Heart size={24} className="text-gray-300" />
          </div>
          <h2 className="text-2xl mb-2">Your wishlist is empty</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            <ShoppingBag size={15} /> Start shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">

        <h1 className="text-2xl mb-6">
          My Wishlist ({wishlist.length})
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

          {wishlist.map(product => (
            <div
              key={product.id}
              className="border rounded-xl overflow-hidden hover:shadow-md"
            >

              {/* Image */}
              <div
                onClick={() =>
                  navigate(`/product/${product.id}`, { state: product })
                }
                className="cursor-pointer bg-gray-50"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 object-contain"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300'
                  }}
                />
              </div>

              {/* Info */}
              <div className="p-3">

                <p
                  onClick={() =>
                    navigate(`/product/${product.id}`, { state: product })
                  }
                  className="text-sm cursor-pointer"
                >
                  {product.title}
                </p>

                <p className="font-semibold mt-1">
                  ₹{product.price?.toLocaleString()}
                </p>

                <span className={`text-xs px-2 py-1 rounded ${PLATFORM_COLORS[product.platform] || ''}`}>
                  {product.platform}
                </span>

                {/* Buttons */}
                <div className="mt-3 flex gap-2">

                  <button
                    onClick={() =>
                      navigate(`/product/${product.id}`, { state: product })
                    }
                    className="flex-1 border py-2 text-xs rounded"
                  >
                    View Deals
                  </button>

                  <button
                    onClick={() => handleRemove(product.id)}
                    className="w-10 flex items-center justify-center border rounded"
                  >
                    <Trash2 size={14} />
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  )
}