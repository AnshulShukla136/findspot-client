import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Heart, Star, ExternalLink, ChevronDown, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useWishlist } from '../hooks/useWishlist'
import toast from 'react-hot-toast'
import { searchProducts } from '../services/api'
const PLATFORMS = ['All', 'Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Meesho', 'Nykaa']

const SORT_OPTIONS = [
  { label: 'Best Match', value: 'match' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Highest Discount', value: 'discount' },
  { label: 'Best Rating', value: 'rating' },
]

const PLATFORM_COLORS = {
  Amazon: 'bg-orange-50 text-orange-600 border-orange-100',
  Flipkart: 'bg-blue-50 text-blue-600 border-blue-100',
  Myntra: 'bg-pink-50 text-pink-600 border-pink-100',
  Ajio: 'bg-purple-50 text-purple-600 border-purple-100',
  Meesho: 'bg-red-50 text-red-500 border-red-100',
  Nykaa: 'bg-rose-50 text-rose-600 border-rose-100',
}

// Dummy data — replace with real API later
const generateResults = (query) => [
  {
    id: '1', title: `${query} - Premium Edition`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 1299, mrp: 3990, discount: 67,
    platform: 'Amazon', rating: 4.2, reviews: 2341,
    url: 'https://amazon.in',
  },
  {
    id: '2', title: `${query} - Standard Pack`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 999, mrp: 2499, discount: 60,
    platform: 'Flipkart', rating: 4.0, reviews: 1820,
    url: 'https://flipkart.com',
  },
  {
    id: '3', title: `${query} - Pro Max`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 2199, mrp: 4999, discount: 56,
    platform: 'Myntra', rating: 4.5, reviews: 980,
    url: 'https://myntra.com',
  },
  {
    id: '4', title: `${query} - Classic Series`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 1599, mrp: 2999, discount: 47,
    platform: 'Ajio', rating: 3.9, reviews: 540,
    url: 'https://ajio.com',
  },
  {
    id: '5', title: `${query} - Lite Version`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 799, mrp: 1499, discount: 47,
    platform: 'Meesho', rating: 3.7, reviews: 310,
    url: 'https://meesho.com',
  },
  {
    id: '6', title: `${query} - Special Edition`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 3499, mrp: 6999, discount: 50,
    platform: 'Amazon', rating: 4.6, reviews: 4210,
    url: 'https://amazon.in',
  },
  {
    id: '7', title: `${query} - Budget Pick`,
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 599, mrp: 1299, discount: 54,
    platform: 'Flipkart', rating: 4.1, reviews: 760,
    url: 'https://flipkart.com',
  },
  {
    id: '8', title: `${query} - Luxury Range`,
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 5999, mrp: 9999, discount: 40,
    platform: 'Nykaa', rating: 4.7, reviews: 1230,
    url: 'https://nykaa.com',
  },
]

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const { addItem, removeItem, isWishlisted } = useWishlist()

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [activePlatform, setActivePlatform] = useState('All')
  const [sortBy, setSortBy] = useState('match')
  const [sortOpen, setSortOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 10000])
// eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
  if (!query) return

  let cancelled = false
  setLoading(true)
  setResults([])
  setActivePlatform('All')

  const fetchResults = async () => {
    try {
      const res = await searchProducts(query)
      if (!cancelled) {
        setResults(res.data.products)
        setLoading(false)
      }
    } catch (err) {
      if (!cancelled) {
        console.error('Search failed:', err.message)
        // Fallback to dummy data if API fails
        setResults(generateResults(query))
        setLoading(false)
      }
    }
  }

  fetchResults()

  return () => { cancelled = true }
}, [query])

  const filtered = results
    .filter(r => activePlatform === 'All' || r.platform === activePlatform)
    .filter(r => r.price >= priceRange[0] && r.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'discount') return b.discount - a.discount
      if (sortBy === 'rating') return b.rating - a.rating
      return 0
    })

  const handleWishlist = (e, product) => {
    e.stopPropagation()
    if (isWishlisted(product.id)) {
      removeItem(product.id)
      toast.success('Removed from wishlist')
    } else {
      addItem(product)
      toast.success('Added to wishlist!')
    }
  }

  const currentSort = SORT_OPTIONS.find(s => s.value === sortBy)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ───── HEADER ───── */}
        <div className="mb-6">
          {loading ? (
            <div className="h-6 w-64 bg-gray-100 rounded-lg animate-pulse" />
          ) : (
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-medium text-[#0b0b0b]">
                Results for
              </h1>
              <span className="font-serif text-xl text-[#0b0b0b] italic">
                "{query}"
              </span>
              <span className="text-sm text-gray-400 font-light">
                — {filtered.length} products found
              </span>
            </div>
          )}
        </div>

        {/* ───── PLATFORM TABS ───── */}
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {PLATFORMS.map(platform => (
            <button
              key={platform}
              onClick={() => setActivePlatform(platform)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-normal 
                         transition-all border
                         ${activePlatform === platform
                ? 'bg-[#0b0b0b] text-white border-[#0b0b0b]'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-[#0b0b0b]'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>

        {/* ───── SORT & FILTER BAR ───── */}
        <div className="flex items-center justify-between mb-6 gap-3">

          {/* Filter button */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 
                       rounded-xl text-sm text-gray-600 hover:border-gray-300 
                       hover:text-[#0b0b0b] transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 
                         rounded-xl text-sm text-gray-600 hover:border-gray-300 
                         transition-colors"
            >
              Sort: {currentSort?.label}
              <ChevronDown size={14} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-11 w-52 bg-white border 
                              border-gray-100 rounded-xl shadow-lg py-1 z-20">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                               ${sortBy === opt.value
                        ? 'text-[#0b0b0b] font-medium bg-gray-50'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ───── FILTER PANEL ───── */}
        {filtersOpen && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#0b0b0b]">Price Range</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-gray-400 hover:text-[#0b0b0b]"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min price</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="form-input"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max price</label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="form-input"
                  placeholder="10000"
                />
              </div>
              <button
                onClick={() => setPriceRange([0, 10000])}
                className="text-xs text-gray-400 hover:text-[#0b0b0b] mt-4 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* ───── LOADING SKELETON ───── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="bg-gray-100 aspect-square" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ───── RESULTS GRID ───── */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-gray-300 mb-2">No results found</p>
            <p className="text-sm text-gray-400">Try a different search or platform</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden 
                           hover:shadow-md hover:border-gray-200 transition-all 
                           cursor-pointer group relative"
              >
                {/* Wishlist button */}
                <button
                  onClick={(e) => handleWishlist(e, product)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full 
                             flex items-center justify-center shadow-sm 
                             hover:scale-110 transition-transform"
                >
                  <Heart
                    size={14}
                    className={isWishlisted(product.id)
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-300'
                    }
                  />
                </button>

                {/* Image */}
                <div className="relative bg-gray-50 aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 
                               transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
                    }}
                  />
                  <span className="absolute top-2 left-2 bg-red-500 text-white 
                                   text-xs font-medium px-2 py-1 rounded-lg">
                    {product.discount}% off
                  </span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                    {product.title}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="font-medium text-[#0b0b0b] text-base">
                      ₹{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.mrp.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-normal
                                     ${PLATFORM_COLORS[product.platform] 
                                       || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                      {product.platform}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs text-gray-400">{product.rating}</span>
                    </div>
                  </div>

                  {/* Buy button */}
                  
                   <a href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="mt-3 w-full flex items-center justify-center gap-1.5 
                               py-2 border border-gray-200 rounded-xl text-xs 
                               text-gray-600 hover:bg-[#0b0b0b] hover:text-white 
                               hover:border-[#0b0b0b] transition-all"
                  >
                    View deal
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}