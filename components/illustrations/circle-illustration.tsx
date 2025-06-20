export function CircleIllustration() {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
      <circle cx="100" cy="100" r="80" fill="none" stroke="url(#circleGradient)" strokeWidth="2" />
      <circle cx="100" cy="100" r="60" fill="none" stroke="url(#circleGradient)" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="40" fill="none" stroke="url(#circleGradient)" strokeWidth="1" />
      <defs>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0, 255, 255, 0.3)" />
          <stop offset="100%" stopColor="rgba(255, 0, 255, 0.3)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
