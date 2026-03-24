import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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

// Dummy product data — replace with API later
const getDummyProduct = (id) => ({
  id,
  title: 'boAt Rockerz 450 Bluetooth On Ear Headphones with Mic',
  description: 'Experience powerful audio with boAt Rockerz 450 wireless headphones. Enjoy up to 15 hours of playback with superior sound quality and comfortable padded ear cushions.',
  images: [
    'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
  ],
  category: 'Electronics',
  brand: 'boAt',
  rating: 4.2,
  reviews: 23410,
  platforms: [
    {
      platform: 'Amazon',
      price: 1299,
      mrp: 3990,
      discount: 67,
      inStock: true,
      url: 'https://amazon.in',
      delivery: 'Free delivery by tomorrow',
    },
    {
      platform: 'Flipkart',
      price: 1399,
      mrp: 3990,
      discount: 65,
      inStock: true,
      url: 'https://flipkart.com',
      delivery: 'Free delivery in 2 days',
    },
    {
      platform: 'Myntra',
      price: 1499,
      mrp: 3990,
      discount: 62,
      inStock: true,
      url: 'https://myntra.com',
      delivery: 'Delivery in 3-4 days',
    },
    {
      platform: 'Ajio',
      price: 1599,
      mrp: 3990,
      discount: 60,
      inStock: false,
      url: 'https://ajio.com',
      delivery: 'Currently unavailable',
    },
    {
      platform: 'Meesho',
      price: 1199,
      mrp: 3990,
      discount: 70,
      inStock: true,
      url: 'https://meesho.com',
      delivery: 'Delivery in 5-7 days',
    },
  ],
  priceHistory: [
    { date: 'Oct', price: 2200 },
    { date: 'Nov', price: 1999 },
    { date: 'Dec', price: 2100 },
    { date: 'Jan', price: 1800 },
    { date: 'Feb', price: 1500 },
    { date: 'Mar', price: 1299 },
  ],
  specs: [
    { label: 'Battery Life', value: '15 hours' },
    { label: 'Connectivity', value: 'Bluetooth 5.0' },
    { label: 'Driver Size', value: '40mm' },
    { label: 'Weight', value: '220g' },
    { label: 'Warranty', value: '1 Year' },
    { label: 'Color', value: 'Luscious Black' },
  ],
})

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, removeItem, isWishlisted } = useWishlist()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [alertSet, setAlertSet] = useState(false)
// eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const timer = setTimeout(() => {
      if (!cancelled) {
        setProduct(getDummyProduct(id))
        setLoading(false)
      }
    }, 800)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [id])

  const handleWishlist = () => {
    if (!product) return
    const item = {
      id: product.id,
      title: product.title,
      image: product.images[0],
      price: product.platforms[0]?.price,
      platform: product.platforms[0]?.platform,
    }
    if (isWishlisted(product.id)) {
      removeItem(product.id)
      toast.success('Removed from wishlist')
    } else {
      addItem(item)
      toast.success('Added to wishlist!')
    }
  }

  const handleAlert = () => {
    setAlertSet(!alertSet)
    toast.success(alertSet ? 'Price alert removed' : 'Price alert set! We\'ll notify you.')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const bestDeal = product?.platforms
    .filter(p => p.inStock)
    .sort((a, b) => a.price - b.price)[0]

  const maxPrice = product
    ? Math.max(...product.priceHistory.map(p => p.price))
    : 0
  const minPrice = product
    ? Math.min(...product.priceHistory.map(p => p.price))
    : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
            <div className="bg-gray-100 rounded-2xl aspect-square" />
            <div className="space-y-4">
              <div className="h-6 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
              <div className="h-10 bg-gray-100 rounded w-1/3" />
              <div className="h-32 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 
                     hover:text-[#0b0b0b] transition-colors mb-6"
        >
          <ArrowLeft size={15} />
          Back to results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

          {/* ───── LEFT — Images ───── */}
          <div>
            {/* Main image */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square mb-3 
                            border border-gray-100">
              <img
                src={product.images[activeImage]}
                alt={product.title}
                className="w-full h-full object-contain p-8"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'
                }}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                             ${activeImage === i
                      ? 'border-[#0b0b0b]'
                      : 'border-gray-100 hover:border-gray-300'
                    }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ───── RIGHT — Info ───── */}
          <div>

            {/* Brand + Category */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 
                               px-3 py-1 rounded-full">
                {product.brand}
              </span>
              <span className="text-xs text-gray-400 bg-gray-50 border border-gray-100 
                               px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl font-normal text-[#0b0b0b] 
                           leading-snug mb-3 tracking-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200 fill-gray-200'
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-[#0b0b0b] font-medium">{product.rating}</span>
              <span className="text-sm text-gray-400">
                ({product.reviews.toLocaleString()} reviews)
              </span>
            </div>

            {/* Best price */}
            {bestDeal && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-5">
                <p className="text-xs text-gray-400 mb-1">Best price available</p>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-3xl text-[#0b0b0b]">
                    ₹{bestDeal.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    ₹{bestDeal.mrp.toLocaleString()}
                  </span>
                  <span className="text-green-600 text-sm font-medium">
                    {bestDeal.discount}% off
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border 
                                   ${PLATFORM_COLORS[bestDeal.platform]}`}>
                    {bestDeal.platform}
                  </span>
                  <span className="text-xs text-gray-400">{bestDeal.delivery}</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2 mb-6">
              {bestDeal && (
                
                 <a href={bestDeal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 
                             bg-[#0b0b0b] text-white text-sm font-medium rounded-xl 
                             hover:bg-[#222] transition-colors"
                >
                  Buy on {bestDeal.platform}
                  <ExternalLink size={14} />
                </a>
              )}
              <button
                onClick={handleWishlist}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center 
                           transition-all hover:scale-105
                           ${isWishlisted(product.id)
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
              >
                <Heart
                  size={16}
                  className={isWishlisted(product.id)
                    ? 'fill-red-500 text-red-500'
                    : 'text-gray-400'
                  }
                />
              </button>
              <button
                onClick={handleAlert}
                className={`w-11 h-11 rounded-xl border flex items-center justify-center 
                           transition-all hover:scale-105
                           ${alertSet
                    ? 'bg-[#0b0b0b] border-[#0b0b0b]'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
              >
                <Bell
                  size={16}
                  className={alertSet ? 'text-white' : 'text-gray-400'}
                />
              </button>
              <button
                onClick={handleShare}
                className="w-11 h-11 rounded-xl border border-gray-200 bg-white 
                           flex items-center justify-center hover:border-gray-300 
                           transition-all hover:scale-105"
              >
                <Share2 size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-4 py-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <ShieldCheck size={13} className="text-green-500" />
                Secure checkout
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <TrendingDown size={13} className="text-blue-500" />
                Price tracking active
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-500 font-light leading-relaxed mt-2">
              {product.description}
            </p>

          </div>
        </div>

        {/* ───── PRICE COMPARISON TABLE ───── */}
        <section className="mb-12">
          <h2 className="font-serif text-xl font-normal text-[#0b0b0b] mb-5">
            Compare prices across platforms
          </h2>
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Platform
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3 
                                 hidden sm:table-cell">
                    Discount
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3 
                                 hidden md:table-cell">
                    Delivery
                  </th>
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3">
                    Status
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {product.platforms
                  .sort((a, b) => a.price - b.price)
                  .map((p, i) => (
                    <tr
                      key={p.platform}
                      className={`border-b border-gray-50 last:border-0 
                                 ${i === 0 && p.inStock ? 'bg-green-50/30' : ''}`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full border 
                                          font-normal ${PLATFORM_COLORS[p.platform]}`}>
                            {p.platform}
                          </span>
                          {i === 0 && p.inStock && (
                            <span className="text-xs text-green-600 font-medium">
                              Best
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-medium text-[#0b0b0b]">
                            ₹{p.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-400 line-through hidden sm:block">
                            ₹{p.mrp.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-sm text-green-600 font-medium">
                          {p.discount}% off
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-gray-400">{p.delivery}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full 
                                         ${p.inStock
                            ? 'bg-green-50 text-green-600'
                            : 'bg-gray-100 text-gray-400'
                          }`}>
                          {p.inStock ? 'In stock' : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {p.inStock && (
                          
                           <a href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-gray-500 
                                       hover:text-[#0b0b0b] transition-colors whitespace-nowrap"
                          >
                            Buy now
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ───── PRICE HISTORY CHART ───── */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl font-normal text-[#0b0b0b]">
              Price history
            </h2>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Lowest: ₹{minPrice.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                Highest: ₹{maxPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
            <div className="flex items-end gap-3 h-32">
              {product.priceHistory.map((point, i) => {
                const heightPercent = ((point.price - minPrice) / (maxPrice - minPrice)) * 100
                const barHeight = 20 + (heightPercent * 0.8)
                const isLowest = point.price === minPrice
                const isLatest = i === product.priceHistory.length - 1

                return (
                  <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500 font-medium">
                      ₹{(point.price / 1000).toFixed(1)}k
                    </span>
                    <div
                      style={{ height: `${barHeight}px` }}
                      className={`w-full rounded-lg transition-all
                                 ${isLatest
                          ? 'bg-[#0b0b0b]'
                          : isLowest
                            ? 'bg-green-400'
                            : 'bg-gray-200'
                        }`}
                    />
                    <span className="text-xs text-gray-400">{point.date}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ───── SPECS ───── */}
        <section className="mb-12">
          <h2 className="font-serif text-xl font-normal text-[#0b0b0b] mb-5">
            Specifications
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {product.specs.map(spec => (
              <div
                key={spec.label}
                className="bg-gray-50 border border-gray-100 rounded-xl p-4"
              >
                <p className="text-xs text-gray-400 mb-1">{spec.label}</p>
                <p className="text-sm font-medium text-[#0b0b0b]">{spec.value}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-gray-400 text-center font-light">
            © 2026 findSpot. Prices are fetched from respective platforms and may vary.
          </p>
        </div>
      </footer>

    </div>
  )

}