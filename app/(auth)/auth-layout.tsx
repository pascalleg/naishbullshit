import type React from "react"
import Image from "next/image"
import { Logo } from "@/components/logo"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[600px] xl:px-12">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="mb-10">
            <Logo />
          </div>
          <div className="mb-10">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            <p className="mt-2 text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-ethr-black">
          <div className="absolute inset-0 bg-gradient-to-br from-ethr-neonblue/20 to-ethr-neonpurple/20 z-10"></div>
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="DJ performing at a concert"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ethr-black to-transparent z-20"></div>

          <div className="absolute bottom-0 left-0 right-0 p-12 z-30">
            <blockquote className="space-y-2">
              <p className="text-lg text-white">
                "ETHR has completely transformed how I connect with venues and manage my bookings. It's the platform the
                music industry has been waiting for."
              </p>
              <footer className="text-sm text-muted-foreground">DJ Synapse, Electronic Artist</footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
