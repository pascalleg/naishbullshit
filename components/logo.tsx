import Link from "next/link"

interface LogoProps {
  linkEnabled?: boolean
}

export function Logo({ linkEnabled = true }: LogoProps) {
  const LogoContent = () => (
    <div className="flex items-center space-x-2">
      <div className="relative w-8 h-8 bg-gradient-to-br from-ethr-neonblue to-ethr-neonpurple rounded-sm flex items-center justify-center overflow-hidden">
        <span className="text-ethr-black font-bold text-lg">E</span>
      </div>
      <span className="font-bold text-xl tracking-tight gradient-text">ETHR</span>
    </div>
  )

  if (linkEnabled) {
    return (
      <Link href="/" className="transition-opacity duration-300 hover:opacity-80">
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
