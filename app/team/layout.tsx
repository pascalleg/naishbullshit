import type { ReactNode } from "react"

export default function TeamLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gradient-to-b from-ethr-black to-ethr-darkgray">{children}</div>
}
