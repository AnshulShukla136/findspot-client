import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Heart, ExternalLink, Star, ArrowLeft,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { useWishlist } from '../hooks/useWishlist'
import toast from 'react-hot-toast'
import { getProductById } from '../services/api'

const PLATFORM_COLORS = {
  Amazon: 'bg-orange-50 text-orange-600 border-orange-100',
  Flipkart: 'bg-blue-50 text-blue-600 border-blue-100',
  Myntra: 'bg-pink-50 text-pink-600 border-pink-100',
  Ajio: 'bg-purple-50 text-purple-600 border-purple-100',
  Meesho: 'bg-red-50 text-red-500 border-red-100',
  Nykaa: 'bg-rose-50 text-rose-600 border-rose-100',
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, removeItem, isWishlisted } = useWishlist()

  const [product, setProduct] = useState(null)
  const [priceHistory, setPriceHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    let cancelled = false

    const fetchProduct = async () => {
      try {
        const res = await getProductById(id)

        if (!cancelled) {
          setProduct(res.data.product)
          setPriceHistory(res.data.priceHistory || [])
          setLoading(false)
        }
      } catch (err) {
        console.error('❌ Product fetch failed:', err.message)
        setLoading(false)
      }
    }

    fetchProduct()

    return () => { cancelled = true }
  }, [id])

  const handleWishlist = () => {
    if (!product) return

    const item = {
      id: product._id,
      title: product.title,
      image: product.images?.[0],
      price: product.platforms?.[0]?.price,
      platform: product.platforms?.[0]?.platform,
    }

    if (isWishlisted(product._id)) {
      removeItem(product._id)
      toast.success('Removed from wishlist')
    } else {
      addItem(item)
      toast.success('Added to wishlist!')
    }
  }

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  const bestDeal = product.platforms
    ?.filter(p => p.inStock)
    .sort((a, b) => a.price - b.price)[0]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Back */}
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Images */}
          <div>
            <img
              src={product.images?.[activeImage]}
              alt=""
              className="w-full h-[400px] object-contain"
            />

            <div className="flex gap-2 mt-3">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImage(i)}
                  className="w-16 h-16 object-contain border cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div>

            <h1 className="text-2xl font-semibold mb-2">
              {product.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <Star size={14} className="text-yellow-500" />
              {product.rating} ({product.reviews})
            </div>

            {/* Best Deal */}
            {bestDeal && (
              <div className="border p-4 rounded-xl mb-4">
                <p className="text-sm text-gray-500">Best Price</p>
                <h2 className="text-2xl font-bold">
                  ₹{bestDeal.price}
                </h2>

                <p className="text-sm text-green-600">
                  {bestDeal.discount}% OFF
                </p>

                <span className={`text-xs px-2 py-1 rounded border ${PLATFORM_COLORS[bestDeal.platform]}`}>
                  {bestDeal.platform}
                </span>

                <a
                  href={bestDeal.url}
                  target="_blank"
                  className="block mt-3 bg-black text-white text-center py-2 rounded"
                >
                  Buy Now <ExternalLink size={14} />
                </a>
              </div>
            )}

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="border px-4 py-2 rounded"
            >
              <Heart size={16} />
            </button>

            {/* Description */}
            <p className="mt-4 text-gray-600">
              {product.description}
            </p>
          </div>
        </div>

        {/* Platform Comparison */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3">
            Compare Prices
          </h2>

          {product.platforms?.map(p => (
            <div key={p.platform} className="flex justify-between border p-3 mb-2 rounded">
              <span>{p.platform}</span>
              <span>₹{p.price}</span>
              <a href={p.url} target="_blank">Buy</a>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}