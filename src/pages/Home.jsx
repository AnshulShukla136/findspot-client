import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Zap, ArrowRight, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import logoImg from '../assets/findSpot.png'

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

const DEALS = [
  {
    id: 1,
    name: 'boAt Rockerz 450 Bluetooth Headphones',
    image: 'https://m.media-amazon.com/images/I/71NTwRABB0L._SX679_.jpg',
    price: 1299, mrp: 3990, discount: 67,
    platform: 'Amazon', rating: 4.2,
  },
  {
    id: 2,
    name: "Levi's Men's 511 Slim Fit Jeans",
    image: 'https://image.hm.com/assets/hm/b5/1b/b51b2ef4f41f2f0de730c56fca3a6d34f0dbf0f8.jpg',
    price: 1799, mrp: 3999, discount: 55,
    platform: 'Flipkart', rating: 4.5,
  },
  {
    id: 3,
    name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    image: 'https://m.media-amazon.com/images/I/71V1BE3CVJL._SX679_.jpg',
    price: 6999, mrp: 12999, discount: 46,
    platform: 'Amazon', rating: 4.6,
  },
  {
    id: 4,
    name: "Nike Men's Running Shoes",
    image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/eda8ef94-a23a-440b-b35e-7afdf2913e02/custom-nike-air-force-1-mid-07-by-you-shoes.png',
    price: 3499, mrp: 6999, discount: 50,
    platform: 'Myntra', rating: 4.3,
  },
]

const PLATFORM_COLORS = {
  Amazon: 'bg-orange-50 text-orange-600',
  Flipkart: 'bg-blue-50 text-blue-600',
  Myntra: 'bg-pink-50 text-pink-600',
  Ajio: 'bg-purple-50 text-purple-600',
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

export default function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

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

        {/* Background logo watermark — same as Login/Register */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full overflow-hidden opacity-[0.04] pointer-events-none">
          <img src={logoImg} alt="" className="w-full h-full object-contain scale-125" />
        </div>

        <div className="text-center max-w-3xl mx-auto relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200
                          rounded-full px-4 py-1.5 mb-6">
            <Zap size={12} className="text-[#0b0b0b]" />
            <span className="text-xs text-gray-600 font-normal">
              Compare prices across 7+ platforms instantly
            </span>
          </div>

          {/* Heading */}
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

          {/* Trending searches */}
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

      {/* ───── PLATFORMS STRIP ───── */}
      <section className="border-y border-gray-100 bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 mr-2">We search across:</span>
            {PLATFORMS.map(p => (
              <span
                key={p.name}
                className={`${p.bg} text-xs font-medium px-3 py-1.5 rounded-full text-gray-700`}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: '7+', label: 'Platforms covered', bg: 'bg-gray-50' },
            { value: '1M+', label: 'Products tracked', bg: 'bg-gray-50' },
            { value: '₹500', label: 'Avg. savings per order', bg: 'bg-gray-50' },
          ].map(stat => (
            <div
              key={stat.label}
              className={`${stat.bg} border border-gray-100 rounded-2xl p-6 text-center`}
            >
              <p className="font-serif text-3xl font-normal text-[#0b0b0b] mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 font-light">{stat.label}</p>
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

      {/* ───── TODAY'S DEALS ───── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-normal text-[#0b0b0b]">
              Today's top deals
            </h2>
            <span className="bg-red-50 text-red-500 text-xs px-2.5 py-1 rounded-full font-medium
                             flex items-center gap-1">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {DEALS.map(deal => (
            <div
              key={deal.id}
              onClick={() => navigate(`/product/${deal.id}`)}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden
                         hover:shadow-md hover:border-gray-200 transition-all
                         cursor-pointer group"
            >
              {/* Image */}
              <div className="relative bg-gray-50 aspect-square overflow-hidden">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-105
                             transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'
                  }}
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs
                                 font-medium px-2 py-1 rounded-lg">
                  {deal.discount}% off
                </span>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                  {deal.name}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-medium text-[#0b0b0b] text-base">
                    ₹{deal.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{deal.mrp.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-normal
                                   ${PLATFORM_COLORS[deal.platform] || 'bg-gray-100 text-gray-600'}`}>
                    {deal.platform}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs text-gray-400">{deal.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="bg-[#0b0b0b] relative overflow-hidden">
        {/* Background logo watermark */}
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
                desc: 'Compare prices, discounts and ratings — then buy directly from the platform.'
              },
            ].map((item, i) => (
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

          {/* Background logo */}
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full
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
            <img src={logoImg} alt="findSpot" className="h-7 w-auto" />
            <p className="text-xs text-gray-400 font-light">
              © 2026 findSpot. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-gray-400 hover:text-[#0b0b0b] transition-colors">
                Privacy
              </a>
              <a href="#" className="text-xs text-gray-400 hover:text-[#0b0b0b] transition-colors">
                Terms
              </a>
              <a href="#" className="text-xs text-gray-400 hover:text-[#0b0b0b] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
