import { useNavigate, useLocation } from 'react-router-dom'
import { Heart, ExternalLink, Star, ArrowLeft } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useWishlist } from '../hooks/useWishlist'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addItem, removeItem, isWishlisted } = useWishlist()

  const p = location?.state

  const product = p
    ? {
        id: p.asin || p.url,
        title: p.product_title || p.title || 'No title',
        image: p.product_photo || p.image || 'https://via.placeholder.com/300',
        price: p.price || 0,
        platform: p.platform || 'Unknown',
        url: p.url || '#',
        rating: p.rating || 0,
        reviews: p.reviews || 0,
      }
    : null

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    )
  }

  const handleWishlist = () => {
    if (isWishlisted(product.id)) {
      removeItem(product.id)
      toast.success('Removed from wishlist')
    } else {
      addItem(product)
      toast.success('Added to wishlist')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-sm"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">

          {/* Image */}
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-80 object-contain"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300'
            }}
          />

          {/* Info */}
          <div>
            <h1 className="text-xl font-bold mb-2">{product.title}</h1>

            <p className="text-lg font-semibold mb-2">
              ₹{product.price.toLocaleString()}
            </p>

            <p className="text-sm text-gray-500 mb-3">
              {product.platform}
            </p>

            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-yellow-500" />
              <span>{product.rating}</span>
              <span className="text-gray-400 text-sm">
                ({product.reviews})
              </span>
            </div>

            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-black text-white px-4 py-2 rounded mb-3 text-center"
            >
              Buy Now <ExternalLink size={14} className="inline ml-1" />
            </a>

            <button
              onClick={handleWishlist}
              className="border px-4 py-2 rounded w-full"
            >
              <Heart size={16} className="inline mr-1" />
              {isWishlisted(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}