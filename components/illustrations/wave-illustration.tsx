export function WaveIllustration() {
  return (
    <svg viewBox="0 0 1200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <path d="M0,100 C300,150 500,50 1200,100 L1200,200 L0,200 Z" fill="url(#gradient)" className="animate-morph" />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0, 255, 255, 0.2)" />
          <stop offset="100%" stopColor="rgba(255, 0, 255, 0.2)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
