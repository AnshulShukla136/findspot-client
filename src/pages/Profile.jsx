import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Bell, Shield, LogOut, ChevronRight, Heart, Mail as MailIcon } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../hooks/useAuth'
import { useWishlist } from '../hooks/useWishlist'
import logoImg from '../assets/findSpot.png'
import toast from 'react-hot-toast'
import { updateProfile } from '../services/api'
export default function Profile() {
  const navigate = useNavigate()
  const { user, logout, login } = useAuth()
  const { wishlist } = useWishlist()

  const [notifications, setNotifications] = useState({
    priceDrops: true,
    deals: true,
    newsletter: false,
  })

  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const [phoneInput, setPhoneInput] = useState('')
  const [savingPhone, setSavingPhone] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/')
  }

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Preference updated')
  }


const handleSavePhone = async () => {
  if (!phoneInput || phoneInput.length < 10) {
    toast.error('Enter a valid phone number')
    return
  }
  setSavingPhone(true)
  try {
    const res = await updateProfile({ phone: phoneInput })
    // Update user in context
    login(res.data.user, localStorage.getItem('findspot_token'))
    toast.success('Phone number saved!')
    setShowPhoneInput(false)
  } catch (err) {
    toast.error('Failed to save phone number')
  } finally {
    setSavingPhone(false)
  }
}

  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    if (user?.firstName) {
      return (user.firstName[0] + (user.lastName?.[0] || '')).toUpperCase()
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const displayName =
    user?.name ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    user?.email?.split('@')[0] ||
    'User'

  const firstName = user?.firstName || user?.name?.split(' ')[0] || 'there'
  const phone = user?.phone || null

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ───── PROFILE HEADER ───── */}
        <div className="flex items-center gap-5 mb-8 p-6 bg-gray-50
                        border border-gray-100 rounded-2xl relative overflow-hidden">
          <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full
                          overflow-hidden opacity-[0.06] pointer-events-none">
            <img src={logoImg} alt="" className="w-full h-full object-contain" />
          </div>

          <div className="w-16 h-16 rounded-full bg-[#0b0b0b] flex items-center
                          justify-center text-white font-serif text-xl flex-shrink-0
                          select-none">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              getInitials()
            )}
          </div>

          <div className="flex-1 min-w-0 z-10">
            <p className="text-xs text-gray-400 font-light mb-0.5">
              Hey, {firstName} 👋
            </p>
            <h1 className="font-serif text-xl font-normal text-[#0b0b0b] mb-0.5">
              {displayName}
            </h1>
            <p className="text-sm text-gray-400 font-light truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* ───── STATS ───── */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div
            onClick={() => navigate('/wishlist')}
            className="bg-gray-50 border border-gray-100 rounded-2xl p-5
                       cursor-pointer hover:border-gray-200 transition-colors"
          >
            <div className="flex items-center gap-2 mb-2">
              <Heart size={15} className="text-red-400" />
              <span className="text-xs text-gray-400">Wishlist</span>
            </div>
            <p className="font-serif text-2xl text-[#0b0b0b]">{wishlist.length}</p>
            <p className="text-xs text-gray-400 font-light mt-0.5">saved items</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={15} className="text-blue-400" />
              <span className="text-xs text-gray-400">Alerts</span>
            </div>
            <p className="font-serif text-2xl text-[#0b0b0b]">0</p>
            <p className="text-xs text-gray-400 font-light mt-0.5">price alerts set</p>
          </div>
        </div>

        {/* ───── ACCOUNT INFO ───── */}
        <div className="mb-6">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-1">
            Account
          </h2>
          <div className="border border-gray-100 rounded-2xl overflow-hidden">

            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
              <User size={15} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Full name</p>
                <p className="text-sm text-[#0b0b0b] truncate">{displayName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
              <Mail size={15} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Email address</p>
                <p className="text-sm text-[#0b0b0b] truncate">{user?.email}</p>
              </div>
            </div>

            {/* Phone row */}
            <div className="flex items-center gap-3 px-5 py-4">
              <Phone size={15} className="text-gray-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">Phone number</p>
                {phone ? (
                  <p className="text-sm text-[#0b0b0b]">{phone}</p>
                ) : showPhoneInput ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      maxLength={10}
                      autoFocus
                      className="border border-gray-200 rounded-lg px-3 py-1.5 
                                 text-sm text-[#0b0b0b] outline-none flex-1
                                 focus:border-[#0b0b0b] transition-colors"
                    />
                    <button
                      onClick={handleSavePhone}
                      disabled={savingPhone}
                      className="text-xs bg-[#0b0b0b] text-white px-3 py-1.5
                                 rounded-lg font-medium hover:bg-[#222]
                                 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {savingPhone ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => {
                        setShowPhoneInput(false)
                        setPhoneInput('')
                      }}
                      className="text-xs text-gray-400 hover:text-[#0b0b0b] 
                                 transition-colors whitespace-nowrap"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-300">Not added yet</p>
                )}
              </div>
              {!phone && !showPhoneInput && (
                <button
                  onClick={() => setShowPhoneInput(true)}
                  className="text-xs text-[#0b0b0b] font-medium hover:underline 
                             flex-shrink-0"
                >
                  Add
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ───── NOTIFICATIONS ───── */}
        <div className="mb-6">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-1">
            Notifications
          </h2>
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            {[
              {
                key: 'priceDrops',
                label: 'Price drop alerts',
                desc: 'Get notified when wishlisted items drop in price',
                icon: <Bell size={14} className="text-blue-400" />,
              },
              {
                key: 'deals',
                label: 'Daily deals',
                desc: 'Receive top deals every morning',
                icon: <Heart size={14} className="text-red-400" />,
              },
              {
                key: 'newsletter',
                label: 'Newsletter',
                desc: 'Weekly roundup of best savings',
                icon: <Mail size={14} className="text-purple-400" />,
              },
            ].map((item, i, arr) => (
              <div
                key={item.key}
                className={`flex items-center gap-4 px-5 py-4
                           ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="flex-shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#0b0b0b] mb-0.5">{item.label}</p>
                  <p className="text-xs text-gray-400 font-light">{item.desc}</p>
                </div>

                {/* ✅ Fixed toggle */}
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative w-11 h-6 rounded-full transition-all duration-200 
                              flex-shrink-0 border-2
                              ${notifications[item.key]
                                ? 'bg-white border-[#0b0b0b]'
                                : 'bg-gray-100 border-gray-300'
                              }`}
                >
                  <span
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full
                                transition-all duration-200
                                ${notifications[item.key]
                                  ? 'bg-[#0b0b0b] translate-x-5'
                                  : 'bg-gray-400 translate-x-1'
                                }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ───── MORE ───── */}
        <div className="mb-8">
          <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 px-1">
            More
          </h2>
          <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-3 px-5 py-4
                               border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <Shield size={15} className="text-gray-400" />
              <span className="flex-1 text-left text-sm text-[#0b0b0b]">
                Privacy & Security
              </span>
              <ChevronRight size={14} className="text-gray-300" />
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4
                         hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} className="text-red-400" />
              <span className="flex-1 text-left text-sm text-red-500">
                Sign out
              </span>
            </button>
          </div>
        </div>

      </div>

      <footer className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-gray-400 text-center font-light">
            © 2026 findSpot. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}