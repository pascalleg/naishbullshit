export function DotsIllustration() {
  // Create a grid of dots
  const dots = []
  const size = 8
  const gap = 20
  const rows = 10
  const cols = 10

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      dots.push(
        <circle
          key={`${i}-${j}`}
          cx={j * gap}
          cy={i * gap}
          r={size / 2}
          fill="url(#dotGradient)"
          style={{
            opacity: 0.1 + ((i + j) / (rows + cols)) * 0.3,
            animationDelay: `${(i + j) * 0.1}s`,
          }}
          className="animate-pulse"
        />,
      )
    }
  }

  return (
    <svg
      viewBox={`0 0 ${(cols - 1) * gap} ${(rows - 1) * gap}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {dots}
      <defs>
        <linearGradient id="dotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(0, 255, 255, 1)" />
          <stop offset="100%" stopColor="rgba(255, 0, 255, 1)" />
        </linearGradient>
      </defs>
    </svg>
  )
}
