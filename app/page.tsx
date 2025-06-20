import { MainNav } from "@/components/main-nav"
import { Input } from "@/components/ui/input"
import { Search, Music, MapPin, Calendar, ArrowRight, Star, Users, ArrowDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { AnimatedButton } from "@/components/animated-button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/animated-text"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      {/* Hero Section - Updated with neon gradient background */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 pt-20 overflow-hidden">
        {/* Base vertical gradient background */}
        <div className="absolute inset-0 z-[-3] bg-gradient-to-b from-ethr-black via-ethr-darkgray to-ethr-black"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 z-[-2] opacity-[0.03] bg-noise"></div>

        {/* Animated neon blobs */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div
            className="absolute top-[10%] left-[15%] w-[40%] h-[30%] rounded-full bg-ethr-neonblue/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "15s" }}
          ></div>
          <div
            className="absolute bottom-[20%] right-[10%] w-[35%] h-[40%] rounded-full bg-ethr-neonpurple/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "18s" }}
          ></div>
          <div
            className="absolute top-[40%] right-[20%] w-[25%] h-[25%] rounded-full bg-ethr-neonblue/15 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "12s" }}
          ></div>
          <div
            className="absolute bottom-[10%] left-[25%] w-[30%] h-[30%] rounded-full bg-ethr-neonpurple/15 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "20s" }}
          ></div>
        </div>

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-ethr-black/80 z-[0]"></div>

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <div className="space-y-6">
            <AnimatedText
              text="WELCOME TO THE FUTURE"
              tag="h1"
              animation="fade"
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wider text-white opacity-90"
              delay={300}
            />
            <AnimatedText
              text="OF BOOKING"
              tag="h1"
              animation="fade"
              className="text-5xl md:text-7xl lg:text-8xl font-light tracking-wider text-white"
              delay={600}
            />

            <ScrollReveal animation="fade" delay={900}>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mt-8 font-light">
                ETHR CONNECTS ARTISTS, VENUES, AND PRODUCTION TEAMS FOR SEAMLESS EVENT BOOKINGS.
              </p>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="fade" delay={1200}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="SEARCH ARTISTS, VENUES, OR EVENTS..."
                  className="pl-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-white/20 w-full rounded-full text-white"
                />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade" delay={1500}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Link href="/post-gig">
                <AnimatedButton
                  variant="default"
                  size="lg"
                  className="rounded-full px-8 h-14 bg-ethr-neonblue text-white hover:bg-ethr-neonblue/90"
                  ripple={false}
                  hover="lift"
                >
                  POST A GIG
                </AnimatedButton>
              </Link>
              <Link href="/find-gig">
                <AnimatedButton
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 h-14 backdrop-blur-sm"
                  ripple={false}
                  hover="lift"
                >
                  FIND A GIG
                </AnimatedButton>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
          <div className="animate-bounce">
            <ArrowDown className="h-6 w-6 text-white/70" />
          </div>
        </div>
      </section>

      {/* Features Section - More spacious and clean */}
      <section className="py-32 px-6 bg-gradient-to-b from-ethr-black to-ethr-darkgray/80">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-5xl font-light text-center mb-20 text-white">
              CONNECT <span className="text-ethr-neonblue">WITH THE INDUSTRY</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              {
                icon: <Music className="h-8 w-8 text-ethr-neonblue" />,
                title: "ARTISTS",
                description: "Showcase your talent, get discovered, and book your next gig with ease.",
                delay: 100,
              },
              {
                icon: <MapPin className="h-8 w-8 text-ethr-neonpurple" />,
                title: "VENUES",
                description: "Fill your calendar with the perfect acts and maximize your space's potential.",
                delay: 300,
              },
              {
                icon: <Users className="h-8 w-8 text-white" />,
                title: "PRODUCTION",
                description: "Connect with top-tier sound, lighting, and stage crews for flawless events.",
                delay: 500,
              },
            ].map((item, index) => (
              <ScrollReveal key={index} animation="fade" delay={item.delay}>
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-500 hover-lift">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-light mb-4 text-white">{item.title}</h3>
                  <p className="text-white/70 text-lg">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Artists - More immersive */}
      <section className="py-32 px-6 bg-gradient-to-b from-ethr-darkgray/80 to-ethr-black">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-5xl font-light text-center mb-6 text-white">
              FEATURED <span className="text-ethr-neonblue">ARTISTS</span>
            </h2>
            <p className="text-center text-white/70 mb-20 max-w-2xl mx-auto text-lg">
              Discover top talent ready to make your next event unforgettable
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item, index) => (
              <ScrollReveal key={item} animation="fade" delay={index * 100}>
                <div className="group relative overflow-hidden rounded-xl hover-lift">
                  <div className="aspect-square overflow-hidden bg-white/5">
                    <Image
                      src={`/placeholder.svg?key=vjuon&key=bvtx1&height=400&width=400`}
                      alt="Artist"
                      width={400}
                      height={400}
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-light mb-1 text-white">ARTIST NAME</h3>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white/70">ELECTRONIC / DJ</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                          <span className="text-sm ml-1 text-white/70">4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fade" delay={600}>
            <div className="text-center mt-16">
              <AnimatedButton
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-6 backdrop-blur-sm"
                hover="lift"
                ripple={false}
              >
                VIEW ALL ARTISTS
              </AnimatedButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How It Works - More visual */}
      <section className="py-32 px-6 bg-gradient-to-b from-ethr-black to-ethr-darkgray/80">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-5xl font-light text-center mb-6 text-white">
              HOW IT <span className="text-ethr-neonblue">WORKS</span>
            </h2>
            <p className="text-center text-white/70 mb-20 max-w-2xl mx-auto text-lg">
              Book your next event in four simple steps
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              {
                step: 1,
                title: "POST NEED",
                description: "Describe your event or talent requirements",
                icon: <Calendar className="h-8 w-8" />,
                delay: 100,
              },
              {
                step: 2,
                title: "GET MATCHED",
                description: "Review profiles and proposals from top matches",
                icon: <Users className="h-8 w-8" />,
                delay: 300,
              },
              {
                step: 3,
                title: "REVIEW CONTRACT",
                description: "Finalize details and terms for your booking",
                icon: <Search className="h-8 w-8" />,
                delay: 500,
              },
              {
                step: 4,
                title: "CONFIRM & PAY",
                description: "Secure your booking with our protected payments",
                icon: <Star className="h-8 w-8" />,
                delay: 700,
              },
            ].map((item) => (
              <ScrollReveal key={item.step} animation="fade" delay={item.delay}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mb-6 relative">
                    <span className="text-2xl font-light text-ethr-neonblue">{item.step}</span>
                    <div className="absolute inset-0 rounded-full border border-white/20"></div>
                  </div>
                  <h3 className="text-2xl font-light mb-3 text-white">{item.title}</h3>
                  <p className="text-white/70 text-lg">{item.description}</p>

                  {item.step < 4 && (
                    <div className="hidden md:block absolute transform translate-x-[100px]">
                      <ArrowRight className="h-6 w-6 text-white/30" />
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal animation="fade" delay={900}>
            <div className="text-center mt-20">
              <Link href="/post-gig">
                <AnimatedButton
                  variant="default"
                  className="rounded-full px-8 py-6 text-lg bg-ethr-neonblue text-white hover:bg-ethr-neonblue/90"
                  hover="lift"
                  ripple={false}
                >
                  GET STARTED NOW
                </AnimatedButton>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer - More minimal */}
      <footer className="py-20 px-6 bg-gradient-to-b from-ethr-darkgray/80 to-ethr-black border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <ScrollReveal animation="fade">
              <div>
                <Logo />
                <p className="mt-6 text-white/70">Connecting the music industry through technology.</p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={100}>
              <div>
                <h4 className="font-light mb-6 text-lg text-white">PLATFORM</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      ARTISTS
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      VENUES
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      PRODUCTION
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      EVENTS
                    </Link>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={200}>
              <div>
                <h4 className="font-light mb-6 text-lg text-white">COMPANY</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      ABOUT
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      CAREERS
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      BLOG
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      PRESS
                    </Link>
                  </li>
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <div>
                <h4 className="font-light mb-6 text-lg text-white">LEGAL</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      TERMS
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      PRIVACY
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      COOKIES
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/70 hover:text-ethr-neonblue transition-colors duration-300">
                      LICENSES
                    </Link>
                  </li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="fade" delay={400}>
            <div className="border-t border-white/10 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/50 text-sm">© {new Date().getFullYear()} ETHR. ALL RIGHTS RESERVED.</p>
              <div className="flex space-x-6 mt-6 md:mt-0">
                <Link href="#" className="text-white/50 hover:text-ethr-neonblue transition-colors duration-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-white/50 hover:text-ethr-neonblue transition-colors duration-300">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.06.048-1.37.06-4.123.06-2.755 0-3.063-.012-4.123-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-white/50 hover:text-ethr-neonblue transition-colors duration-300">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </footer>
    </main>
  )
}
