import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Zap, ArrowRight, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import logoImg from '../assets/findSpot.png'
import { searchProducts } from '../services/api'

const TRENDING = [
  'iPhone 15', 'Nike Air Max', 'Samsung TV', 'Boat Earbuds',
  "Levi's Jeans", 'MacBook Air', 'OnePlus 12', 'Puma Shoes'
]

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: 'bg-blue-50 hover:bg-blue-100' },
  { name: 'Fashion', icon: '👗', color: 'bg-pink-50 hover:bg-pink-100' },
  { name: 'Home & Kitchen', icon: '🏠', color: 'bg-orange-50 hover:bg-orange-100' },
  { name: 'Beauty', icon: '✨', color: 'bg-purple-50 hover:bg-purple-100' },
  { name: 'Sports', icon: '⚽', color: 'bg-green-50 hover:bg-green-100' },
  { name: 'Books', icon: '📚', color: 'bg-yellow-50 hover:bg-yellow-100' },
  { name: 'Toys', icon: '🧸', color: 'bg-red-50 hover:bg-red-100' },
  { name: 'Grocery', icon: '🛒', color: 'bg-teal-50 hover:bg-teal-100' },
]

const PLATFORM_COLORS = {
  Amazon: 'bg-orange-50 text-orange-600',
  Flipkart: 'bg-blue-50 text-blue-600',
  Myntra: 'bg-pink-50 text-pink-600',
  Ajio: 'bg-purple-50 text-purple-600',
  Meesho: 'bg-red-50 text-red-500',
  Nykaa: 'bg-rose-50 text-rose-600',
}

const PLATFORMS = [
  { name: 'Amazon', bg: 'bg-orange-50' },
  { name: 'Flipkart', bg: 'bg-blue-50' },
  { name: 'Myntra', bg: 'bg-pink-50' },
  { name: 'Ajio', bg: 'bg-purple-50' },
  { name: 'Meesho', bg: 'bg-red-50' },
  { name: 'Nykaa', bg: 'bg-rose-50' },
  { name: 'Snapdeal', bg: 'bg-yellow-50' },
]

// Fallback deals if API fails
const FALLBACK_DEALS = [
  {
    id: 1,
    title: 'boAt Rockerz 450 Bluetooth Headphones',
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 1299, mrp: 3990, discount: 67,
    platform: 'Amazon', rating: 4.2,
    url: 'https://amazon.in',
  },
  {
    id: 2,
    title: 'Samsung 43" Crystal 4K TV',
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 28999, mrp: 54900, discount: 47,
    platform: 'Amazon', rating: 4.4,
    url: 'https://amazon.in',
  },
  {
    id: 3,
    title: 'Apple AirPods Pro 2nd Gen',
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 19900, mrp: 26900, discount: 26,
    platform: 'Amazon', rating: 4.7,
    url: 'https://amazon.in',
  },
  {
    id: 4,
    title: 'OnePlus Nord CE 3 Lite 5G',
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 14999, mrp: 19999, discount: 25,
    platform: 'Amazon', rating: 4.2,
    url: 'https://amazon.in',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
 const [deals, setDeals] = useState(FALLBACK_DEALS) // shows instantly

  // Fetch real deals on page load
  useEffect(() => {
  let cancelled = false

  const fetchDeals = async () => {
    try {
      // Check localStorage cache first
      const cached = localStorage.getItem('findspot_deals')
      const cacheTime = localStorage.getItem('findspot_deals_time')
      const cacheAge = Date.now() - Number(cacheTime)
      const thirtyMinutes = 30 * 60 * 1000

      // Use cache if less than 30 minutes old
      if (cached && cacheAge < thirtyMinutes) {
        console.log('Using cached deals')
        setDeals(JSON.parse(cached))
        return
      }

      // Fetch real deals from API
      const res = await searchProducts('best deals electronics', {
        sort: 'discount'
      })

      if (!cancelled && res.data?.products?.length > 0) {
        const topDeals = res.data.products
          .filter(p => p.discount > 0)
          .sort((a, b) => b.discount - a.discount)
          .slice(0, 4)

        setDeals(topDeals)

        // Save to cache for 30 minutes
        localStorage.setItem('findspot_deals', JSON.stringify(topDeals))
        localStorage.setItem('findspot_deals_time', String(Date.now()))
      }
    } catch (err) {
      // Keep fallback deals silently
      console.error('Deals fetch failed:', err.message)
    }
  }

  fetchDeals()
  return () => { cancelled = true }
}, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ───── HERO ───── */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 overflow-hidden">

        {/* Background logo watermark */}

        <div className="text-center max-w-3xl mx-auto relative z-10">

          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200
                          rounded-full px-4 py-1.5 mb-6">
            <Zap size={12} className="text-[#0b0b0b]" />
            <span className="text-xs text-gray-600 font-normal">
              Compare prices across 7+ platforms instantly
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl font-normal text-[#0b0b0b]
                         leading-tight mb-5 tracking-tight">
            Find the best deal,<br />
            <em className="text-gray-400">every time.</em>
          </h1>

          <p className="text-gray-500 text-base font-light leading-relaxed mb-10 max-w-xl mx-auto">
            Search once and instantly compare prices from Amazon, Flipkart,
            Myntra, Ajio and more — all in one place.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-5">
            <div className="flex items-center gap-3 bg-white border-2 border-gray-200
                            rounded-2xl px-5 py-4 focus-within:border-[#0b0b0b]
                            transition-colors shadow-sm">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Try "iPhone 15", "Nike shoes", "Samsung TV"...'
                className="flex-1 outline-none text-base text-[#0b0b0b]
                           placeholder-gray-300 bg-transparent"
              />
              <button
                type="submit"
                className="bg-[#0b0b0b] text-white text-sm font-medium px-5 py-2.5
                           rounded-xl hover:bg-[#222] transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Trending */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <TrendingUp size={12} />
              Trending:
            </span>
            {TRENDING.map(term => (
              <button
                key={term}
                onClick={() => navigate(`/search?q=${encodeURIComponent(term)}`)}
                className="text-xs text-gray-500 bg-gray-50 hover:bg-gray-100
                           border border-gray-200 px-3 py-1.5 rounded-full
                           transition-colors hover:text-[#0b0b0b]"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </section>    

      {/* ───── STATS ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '7+', label: 'Platforms covered' },
            { value: '1M+', label: 'Products tracked' },
            { value: '₹500', label: 'Avg. savings per order' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center"
            >
              <p className="font-serif text-3xl font-normal text-[#0b0b0b] mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 font-light">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───── TODAY'S DEALS ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-normal text-[#0b0b0b]">
              Today's top deals
            </h2>
            <span className="bg-red-50 text-red-500 text-xs px-2.5 py-1 rounded-full
                             font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block" />
              Live
            </span>
          </div>
          <button
            onClick={() => navigate('/search?q=deals')}
            className="flex items-center gap-1 text-sm text-gray-500
                       hover:text-[#0b0b0b] transition-colors"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>

        {/* Loading skeleton */}
        

        {/* Real deals */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {deals.map((deal, i) => (
              <div
                key={deal.id || deal.asin || i}
                onClick={() => deal.url
                  ? window.open(deal.url, '_blank')
                  : navigate(`/product/${deal.id}`)
                }
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden
                           hover:shadow-md hover:border-gray-200 transition-all
                           cursor-pointer group"
              >
                {/* Image */}
                <div className="relative bg-gray-50 aspect-square overflow-hidden">
                  <img
                    src={deal.image}
                    alt={deal.title || deal.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105
                               transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
                    }}
                  />
                  {deal.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white
                                     text-xs font-medium px-2 py-1 rounded-lg">
                      {deal.discount}% off
                    </span>
                  )}
                  {deal.badge && (
                    <span className="absolute top-2 right-2 bg-orange-400 text-white
                                     text-xs font-medium px-2 py-1 rounded-lg">
                      {deal.badge}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                    {deal.title || deal.name}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-medium text-[#0b0b0b] text-base">
                      ₹{Number(deal.price).toLocaleString()}
                    </span>
                    {deal.mrp > deal.price && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{Number(deal.mrp).toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-normal
                                     ${PLATFORM_COLORS[deal.platform] || 'bg-gray-100 text-gray-600'}`}>
                      {deal.platform}
                    </span>
                    {deal.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-400">{deal.rating}</span>
                      </div>
                    )}
                  </div>
                  {deal.salesVolume && (
                    <p className="text-xs text-gray-400 mt-1">{deal.salesVolume}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
      </section>

      {/* ───── CATEGORIES ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-7">
          <h2 className="font-serif text-2xl font-normal text-[#0b0b0b]">
            Browse categories
          </h2>
          <span className="text-xs text-gray-400">8 categories</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat.name}
              onClick={() => navigate(`/search?q=${encodeURIComponent(cat.name)}`)}
              className={`${cat.color} rounded-2xl p-4 flex flex-col items-center
                         gap-2 transition-all duration-200 cursor-pointer
                         hover:scale-105 hover:shadow-sm`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-xs text-gray-600 font-normal text-center leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>
      
      {/* ───── HOW IT WORKS ───── */}
      <section className="bg-[#0b0b0b] relative overflow-hidden">
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full
                        overflow-hidden opacity-[0.04] pointer-events-none">
          <img src={logoImg} alt="" className="w-full h-full object-contain scale-125" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <h2 className="font-serif text-2xl font-normal text-white text-center mb-12">
            How findSpot works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Search anything',
                desc: "Type any product name, brand or category you're looking for."
              },
              {
                step: '02',
                title: 'We scan all platforms',
                desc: 'findSpot instantly searches Amazon, Flipkart, Myntra, Ajio and more.'
              },
              {
                step: '03',
                title: 'Pick the best deal',
                desc: 'Compare prices, discounts and ratings — then buy directly.'
              },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10
                                flex items-center justify-center mx-auto mb-4">
                  <span className="font-serif text-sm text-white">{item.step}</span>
                </div>
                <h3 className="font-medium text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA BANNER ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-1 w-64 h-64 rounded-full
                          overflow-hidden opacity-[0.05] pointer-events-none">
            <img src={logoImg} alt="" className="w-full h-full object-contain scale-125" />
          </div>
          <h2 className="font-serif text-3xl font-normal text-[#0b0b0b] mb-3">
            Never overpay again.
          </h2>
          <p className="text-gray-400 text-sm font-light mb-7 max-w-md mx-auto">
            Join thousands of smart shoppers who save money every day using findSpot.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="bg-[#0b0b0b] text-white text-sm font-medium px-6 py-3
                         rounded-xl hover:bg-[#222] transition-colors"
            >
              Get started — it's free
            </button>
            <button
              onClick={() => navigate('/search?q=deals')}
              className="bg-white border border-gray-200 text-[#0b0b0b] text-sm
                         font-medium px-6 py-3 rounded-xl hover:border-gray-300
                         transition-colors"
            >
              Browse deals
            </button>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400 font-light">
              © 2026 findSpot. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              
               <a href="https://www.termsfeed.com/live/4122d31f-15fd-4d28-a76a-c503df800931"
                className="text-xs text-gray-400 hover:text-[#0b0b0b] transition-colors"
              >
                Privacy
              </a>
              
               <a href="https://www.termsfeed.com/live/8c4c0dc1-092e-4ae5-93e3-0f79a853d0e2"
                className="text-xs text-gray-400 hover:text-[#0b0b0b] transition-colors"
              >
                Terms
              </a>
              
                <a href="/contact.html"
                className="text-xs text-gray-400 hover:text-[#0b0b0b] transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
