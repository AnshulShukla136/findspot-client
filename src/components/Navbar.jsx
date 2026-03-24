
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Heart, User, Menu, X } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import logoImg from '../assets/findSpot.png'


export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    setSearchQuery('')
  }

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }
  const dropdownRef = useRef(null)

useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false)
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
  return () => document.removeEventListener('mousedown', handleClickOutside)
}, [])

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logoImg} alt="findSpot" className="h-14 w-auto" />
          </Link>

          {/* Search bar - desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl items-center gap-2 
                       bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5
                       focus-within:border-[#0b0b0b] transition-colors"
          >
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands, deals..."
              className="flex-1 bg-transparent outline-none text-sm text-[#0b0b0b] 
                         placeholder-gray-400"
            />
            {searchQuery && (
              <button
                type="submit"
                className="text-xs font-medium text-white bg-[#0b0b0b] 
                           px-3 py-1 rounded-lg hover:bg-[#222] transition-colors"
              >
                Search
              </button>
            )}
          </form>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 
                         rounded-xl hover:bg-gray-50 transition-colors text-gray-600 
                         hover:text-[#0b0b0b]"
            >
              <Heart size={17} />
              <span className="text-sm font-normal">Wishlist</span>
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl 
                             hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0b0b0b] flex items-center 
                                  justify-center text-white text-xs font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 
                    user?.firstName?.charAt(0).toUpperCase() || 
                    user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-sm text-[#0b0b0b] font-normal">
                    {user?.name?.split(' ')[0] || 
                    user?.firstName || 
                    user?.email?.split('@')[0] || 'User'}
                  </span>
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-12 w-44 bg-white border 
                                  border-gray-100 rounded-xl shadow-lg py-1 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm 
                                 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={14} />
                      Profile
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm 
                                 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Heart size={14} />
                      Wishlist
                    </Link>
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm 
                                 text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-[#0b0b0b] 
                             px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-white bg-[#0b0b0b] px-4 py-2 
                             rounded-xl hover:bg-[#222] transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 bg-gray-50 border border-gray-200 
                       rounded-xl px-4 py-2.5 focus-within:border-[#0b0b0b] transition-colors"
          >
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, deals..."
              className="flex-1 bg-transparent outline-none text-sm 
                         text-[#0b0b0b] placeholder-gray-400"
            />
          </form>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm 
                         text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <Heart size={15} />
              Wishlist
            </Link>
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm 
                             text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm 
                             text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}