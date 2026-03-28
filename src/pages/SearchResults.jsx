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

  useEffect(() => {
    if (!query) return

    let cancelled = false
    setLoading(true)

    const fetchResults = async () => {
      try {
        const res = await searchProducts(query)
        if (!cancelled) {
          setResults(res.data.products || [])
          setLoading(false)
        }
      } catch (err) {
        console.error('Search failed:', err.message)
        setLoading(false)
      }
    }

    fetchResults()
    return () => { cancelled = true }
  }, [query])

  const filtered = results
    .filter(r => activePlatform === 'All' || r.platform === activePlatform)
    .filter(r => r.price >= priceRange[0] && r.price <= priceRange[1])

  const handleWishlist = (e, product) => {
    e.stopPropagation()
    const id = product.asin || product.url

    if (isWishlisted(id)) {
      removeItem(id)
      toast.success('Removed from wishlist')
    } else {
      addItem({ ...product, id })
      toast.success('Added to wishlist!')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">

        <h1 className="mb-6 text-lg">
          Results for "{query}" — {filtered.length}
        </h1>

        {loading && <p>Loading...</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <div
              key={product.asin || product.url}
              onClick={() =>
                navigate(`/product/${product.asin || product.url}`, {
                  state: product
                })
              }
              className="border rounded-xl p-3 cursor-pointer"
            >
              <img
                src={product.image}
                className="w-full h-40 object-contain"
              />

              <p className="text-sm mt-2">{product.title}</p>

              <p className="font-bold">₹{product.price}</p>

              <span className="text-xs">{product.platform}</span>

              <button
                onClick={(e) => handleWishlist(e, product)}
                className="block mt-2"
              >
                <Heart size={14} />
              </button>

              <a
                href={product.url}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                View Deal
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}