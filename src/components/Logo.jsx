import logoImg from '../assets/findSpot.png'

export default function Logo({ size = 'md', dark = false }) {
  const config = {
    sm: { height: 32 },
    md: { height: 48 },
    lg: { height: 64 },
  }

  const { height } = config[size]

  if (dark) {
    // Left panel — text only, no image (white text on dark bg)
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
          <circle cx="13" cy="13" r="9" stroke="white" strokeWidth="2.5" fill="none" />
          <line x1="20" y1="20" x2="28" y2="28"
            stroke="#a0785a" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="10" cy="10" rx="3" ry="2"
            fill="rgba(255,255,255,0.2)" transform="rotate(-30 10 10)" />
        </svg>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '22px',
          fontWeight: '500',
          color: '#ffffff',
          letterSpacing: '-0.5px',
        }}>
          findSpot
        </span>
      </div>
    )
  }

  // Right panel — actual logo image, bigger size
  return (
    <img
      src={logoImg}
      alt="findSpot"
      style={{
        height: `${height}px`,
        width: 'auto',
        objectFit: 'contain',
        display: 'block',
      }}
    />
  )
}