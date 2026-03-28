import { useNavigate, useLocation } from 'react-router-dom'
import {
  Heart, ExternalLink, Star, ArrowLeft,
  TrendingDown, Bell, Share2, ShieldCheck
} from 'lucide-react'
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

export default function ProductDetail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { addItem, removeItem, isWishlisted } = useWishlist()

  const p = location?.state

  const product = p
    ? {
        id: p.asin || p.url,
        title: p.product_title || p.title,
        images: [p.product_photo || p.image],
        price: p.price,
        mrp: p.mrp || p.price,
        discount: p.discount || 0,
        platform: p.platform,
        url: p.url,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
      }
    : null

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>
  }

  const handleWishlist = () => {
    if (isWishlisted(product.id)) {
      removeItem(product.id)
      toast.success('Removed from wishlist')
    } else {
      addItem({
  id: product.id,
  title: product.title,
  image: product.image || product.images?.[0] || product.product_photo,
  price: product.price,
  platform: product.platform,
  url: product.url,
  rating: product.rating,
  reviews: product.reviews,
})
      toast.success('Added to wishlist')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* IMAGE */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <img
              src={product.images[0]}
              className="w-full h-96 object-contain"
            />
          </div>

          {/* INFO */}
          <div>

            <h1 className="text-2xl font-semibold mb-3">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-yellow-500" />
              {product.rating} ({product.reviews})
            </div>

            {/* PRICE */}
            <div className="mb-5">
              <span className="text-3xl font-bold">
                ₹{product.price}
              </span>
              <span className="ml-2 line-through text-gray-400">
                ₹{product.mrp}
              </span>
              <span className="ml-2 text-green-600">
                {product.discount}% off
              </span>
            </div>

            {/* PLATFORM */}
            <span className={`px-3 py-1 rounded-full text-sm ${PLATFORM_COLORS[product.platform]}`}>
              {product.platform}
            </span>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-6">

              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-black text-white py-3 rounded-xl text-center"
              >
                Buy Now <ExternalLink size={14} className="inline ml-1" />
              </a>

              <button
                onClick={handleWishlist}
                className="w-12 border rounded-xl flex items-center justify-center"
              >
                <Heart />
              </button>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}