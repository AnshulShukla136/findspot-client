import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logoImg from '../assets/findSpot.png'
import toast from 'react-hot-toast'
import { sendOtpLogin, verifyOtp, loginUser, googleAuth } from '../services/api'
import { useGoogleLogin } from '@react-oauth/google'


export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [step, setStep] = useState(1) // 1 = email, 2 = otp
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)

  const startTimer = () => {
    setOtpTimer(30)
    const interval = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) { clearInterval(interval); return 0 }
        return prev - 1
      })
    }, 1000)
  }
const handleSendOtp = async (e) => {
  e.preventDefault()
  if (!email) {
    toast.error('Please enter your email')
    return
  }
  setLoading(true)
  try {
    await sendOtpLogin(email)
    setStep(2)
    startTimer()
    toast.success(`OTP sent to ${email}!`)
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to send OTP')
  } finally {
    setLoading(false)
  }
}
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`login-otp-${index + 1}`)?.focus()
    }
  }
  const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      setLoading(true)
      const res = await googleAuth(tokenResponse.access_token)
      login(res.data.user, res.data.token)
      toast.success('Welcome to findSpot!')
      navigate('/')
    } catch (err) {
      toast.error('Google login failed')
    } finally {
      setLoading(false)
    }
  },
  onError: () => toast.error('Google login failed')
})

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`login-otp-${index - 1}`)?.focus()
    }
  }

  const handleVerifyOtp = async (e) => {
  e.preventDefault()
  const otpValue = otp.join('')
  if (otpValue.length < 6) {
    toast.error('Please enter the complete OTP')
    return
  }
  setLoading(true)
  try {
    // Step 1 — verify OTP
    await verifyOtp(email, otpValue)

    // Step 2 — login (no OTP needed, already verified)
    const res = await loginUser({ email })
    login(res.data.user, res.data.token)
    toast.success('Welcome back!')
    navigate('/')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Invalid OTP')
  } finally {
    setLoading(false)
  }
}

const handleResend = async () => {
  try {
    await sendOtpLogin(email)
    startTimer()
    setOtp(['', '', '', '', '', ''])
    toast.success('New OTP sent!')
  } catch (err) {
    toast.error('Failed to resend OTP')
  }
}

  return (
    <div className="min-h-screen w-full flex">

      {/* ───── LEFT PANEL ───── */}
      <div className="hidden lg:flex w-[42%] bg-[#0b0b0b] flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full border border-white/5" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full border border-white/5" />

        <div className="z-10">
          <h2 className="font-serif text-white text-4xl leading-snug font-normal mb-4">
            Every deal,<br />
            <em className="text-[#b8f56a]">one spot.</em><br />
            All platforms.
          </h2>
          <p className="text-white/40 text-sm font-light leading-relaxed">
            Search once, compare everywhere. findSpot scans Amazon,
            Flipkart, Myntra, Ajio and more — instantly.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 z-10">
          {['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Meesho', 'Nykaa', 'Snapdeal'].map(p => (
            <span
              key={p}
              className="text-white/50 text-xs border border-white/10 bg-white/5 px-3 py-1.5 rounded-full"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* ───── RIGHT PANEL ───── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-16 py-12 bg-white relative overflow-hidden">

        {/* Big circular logo decoration */}
        <div className="absolute -top-20 right-10 w-80 h-80 rounded-full overflow-hidden pointer-events-none">
          <img src={logoImg} alt="" className="w-full h-full object-contain scale-125" />
        </div>

        <div className="w-full max-w-sm mx-auto">

          <img src={logoImg} alt="findSpot" className="h-8 w-auto mb-7" />

          {/* ── STEP 1 — Enter Email ── */}
          {step === 1 && (
            <>
              <h1 className="font-serif text-2xl font-normal text-[#0b0b0b] mb-1 tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-gray-400 font-light mb-7">
                Enter your email to receive a login OTP
              </p>

              {/* Social buttons */}
              <div className="mb-5">
                <button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4
                            bg-white border border-gray-200 rounded-xl text-sm text-gray-700 
                            font-medium hover:bg-gray-50 hover:border-gray-300 
                            transition-all duration-150 cursor-pointer"
                >
                  <GoogleIcon />
                  Continue with Google
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-300">or with email</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="input-label">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="form-input"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#0b0b0b] font-medium hover:underline">
                  Create one
                </Link>
              </p>
            </>
          )}

          {/* ── STEP 2 — Enter OTP ── */}
          {step === 2 && (
            <>
              <h1 className="font-serif text-2xl font-normal text-[#0b0b0b] mb-1 tracking-tight">
                Check your email
              </h1>
              <p className="text-sm text-gray-400 font-light mb-2">
                We sent a 6-digit OTP to
              </p>
              <p className="text-sm font-medium text-[#0b0b0b] mb-7">
                {email}{' '}
                <button
                  onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']) }}
                  className="text-xs text-gray-400 hover:text-[#0b0b0b] underline font-normal"
                >
                  Change
                </button>
              </p>

              <form onSubmit={handleVerifyOtp} className="space-y-6">

                {/* OTP boxes */}
                <div>
                  <label className="input-label mb-3 block">Enter OTP</label>
                  <div className="flex gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`login-otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-full py-3 border border-gray-200 rounded-xl
                                   text-center text-lg font-medium text-[#0b0b0b]
                                   outline-none focus:border-[#0b0b0b] transition-colors"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign in'}
                </button>

              </form>

              {/* Resend */}
              <p className="text-xs text-gray-400 text-center mt-6">
                Didn't receive the OTP?{' '}
                {otpTimer > 0 ? (
                  <span className="text-gray-400">Resend in {otpTimer}s</span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-[#0b0b0b] font-medium hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </p>

              <p className="text-xs text-gray-400 text-center mt-3">
                OTP is valid for <span className="text-[#0b0b0b]">5 minutes</span>
              </p>
            </>
          )}

          <p className="text-xs text-gray-300 text-center mt-6">
            By signing in you agree to our{' '}
            <a href="#" className="text-gray-400 hover:underline">Terms</a>
            {' '}&amp;{' '}
            <a href="#" className="text-gray-400 hover:underline">Privacy Policy</a>
          </p>

        </div>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}