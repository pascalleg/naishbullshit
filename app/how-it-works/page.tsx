import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  MessageSquare,
  Music,
  Search,
  Star,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { GestureAnimation } from "@/components/gesture-animation"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/animated-text"

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
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
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <ScrollReveal animation="fade">
            <AnimatedText
              text="HOW ETHR WORKS"
              tag="h1"
              animation="fade"
              className="text-4xl md:text-6xl font-light mb-6 text-white"
            />
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={200}>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10 font-light">
              ETHR CONNECTS ARTISTS, VENUES, AND PRODUCTION TEAMS THROUGH A SEAMLESS PLATFORM DESIGNED SPECIFICALLY FOR
              THE MUSIC INDUSTRY.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Base vertical gradient background */}
        <div className="absolute inset-0 z-[-3] bg-gradient-to-b from-ethr-black via-ethr-darkgray to-ethr-black"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 z-[-2] opacity-[0.03] bg-noise"></div>

        {/* Animated neon blobs */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div
            className="absolute top-[30%] right-[15%] w-[30%] h-[40%] rounded-full bg-ethr-neonblue/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "17s" }}
          ></div>
          <div
            className="absolute bottom-[10%] left-[20%] w-[25%] h-[30%] rounded-full bg-ethr-neonpurple/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "20s" }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <GestureAnimation>
              <div className="text-center animate-slide-up">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Music className="h-8 w-8 text-ethr-black" />
                </div>
                <h3 className="text-xl font-light mb-3 text-white">FOR ARTISTS</h3>
                <p className="text-white/70 font-light">
                  SHOWCASE YOUR TALENT, GET DISCOVERED, AND BOOK GIGS DIRECTLY WITH VENUES AND EVENT ORGANIZERS.
                </p>
              </div>
            </GestureAnimation>

            <GestureAnimation>
              <div className="text-center animate-slide-up animate-delay-200">
                <div
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center mx-auto mb-6 animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Users className="h-8 w-8 text-ethr-black" />
                </div>
                <h3 className="text-xl font-light mb-3 text-white">FOR VENUES</h3>
                <p className="text-white/70 font-light">
                  FIND THE PERFECT TALENT FOR YOUR EVENTS, MANAGE BOOKINGS, AND BUILD RELATIONSHIPS WITH ARTISTS.
                </p>
              </div>
            </GestureAnimation>

            <GestureAnimation>
              <div className="text-center animate-slide-up animate-delay-400">
                <div
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center mx-auto mb-6 animate-pulse"
                  style={{ animationDelay: "0.6s" }}
                >
                  <FileText className="h-8 w-8 text-ethr-black" />
                </div>
                <h3 className="text-xl font-light mb-3 text-white">FOR PRODUCTION</h3>
                <p className="text-white/70 font-light">
                  CONNECT WITH EVENTS THAT NEED YOUR EXPERTISE IN SOUND, LIGHTING, STAGE MANAGEMENT, AND MORE.
                </p>
              </div>
            </GestureAnimation>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ethr-darkgray relative overflow-hidden">
        {/* Base vertical gradient background */}
        <div className="absolute inset-0 z-[-3] bg-gradient-to-b from-ethr-black via-ethr-darkgray to-ethr-black"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 z-[-2] opacity-[0.03] bg-noise"></div>

        {/* Animated neon blobs */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div
            className="absolute top-[20%] right-[25%] w-[35%] h-[35%] rounded-full bg-ethr-neonblue/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "19s" }}
          ></div>
          <div
            className="absolute bottom-[30%] left-[10%] w-[40%] h-[25%] rounded-full bg-ethr-neonpurple/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "16s" }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-white">
              THE <span className="gradient-text">ETHR</span> PROCESS
            </h2>
          </ScrollReveal>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-ethr-neonblue to-ethr-neonpurple transform -translate-x-1/2"></div>

            {/* Step 1 */}
            <div className="relative mb-24">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right animate-slide-right">
                  <h3 className="text-2xl font-light mb-4 text-white">CREATE YOUR PROFILE</h3>
                  <p className="text-white/70 font-light">
                    SIGN UP AND BUILD YOUR PROFESSIONAL PROFILE. SHOWCASE YOUR TALENT, EXPERIENCE, AND WHAT MAKES YOU
                    UNIQUE. ADD PHOTOS, VIDEOS, AND AUDIO SAMPLES TO STAND OUT.
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center z-10">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center animate-pulse">
                    <span className="text-xl font-bold text-ethr-black">1</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 animate-slide-left">
                  <GestureAnimation>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Create profile"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                    </div>
                  </GestureAnimation>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative mb-24">
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0 md:text-left animate-slide-left">
                  <h3 className="text-2xl font-light mb-4 text-white">CONNECT & DISCOVER</h3>
                  <p className="text-white/70 font-light">
                    BROWSE THROUGH OUR NETWORK OF ARTISTS, VENUES, AND PRODUCTION PROFESSIONALS. USE OUR ADVANCED SEARCH
                    FILTERS TO FIND THE PERFECT MATCH FOR YOUR NEEDS.
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center z-10">
                  <div
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center animate-pulse"
                    style={{ animationDelay: "0.3s" }}
                  >
                    <span className="text-xl font-bold text-ethr-black">2</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pr-12 animate-slide-right">
                  <GestureAnimation>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Connect and discover"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                    </div>
                  </GestureAnimation>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative mb-24">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0 md:text-right animate-slide-right">
                  <h3 className="text-2xl font-light mb-4 text-white">BOOK & NEGOTIATE</h3>
                  <p className="text-white/70 font-light">
                    SEND BOOKING REQUESTS, NEGOTIATE TERMS, AND FINALIZE DETAILS ALL WITHIN THE PLATFORM. OUR MESSAGING
                    SYSTEM KEEPS ALL COMMUNICATIONS IN ONE PLACE.
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center z-10">
                  <div
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center animate-pulse"
                    style={{ animationDelay: "0.6s" }}
                  >
                    <span className="text-xl font-bold text-ethr-black">3</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-12 animate-slide-left">
                  <GestureAnimation>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Book and negotiate"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                    </div>
                  </GestureAnimation>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0 md:text-left animate-slide-left">
                  <h3 className="text-2xl font-light mb-4 text-white">PERFORM & GET PAID</h3>
                  <p className="text-white/70 font-light">
                    SECURE PAYMENTS THROUGH OUR PLATFORM ENSURE YOU GET PAID ON TIME. AFTER THE EVENT, EXCHANGE REVIEWS
                    TO BUILD YOUR REPUTATION IN THE COMMUNITY.
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center z-10">
                  <div
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center animate-pulse"
                    style={{ animationDelay: "0.9s" }}
                  >
                    <span className="text-xl font-bold text-ethr-black">4</span>
                  </div>
                </div>
                <div className="md:w-1/2 md:pr-12 animate-slide-right">
                  <GestureAnimation>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=300&width=500"
                        alt="Perform and get paid"
                        width={500}
                        height={300}
                        className="w-full object-cover"
                      />
                    </div>
                  </GestureAnimation>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User-Specific Flows */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Base vertical gradient background */}
        <div className="absolute inset-0 z-[-3] bg-gradient-to-b from-ethr-black via-ethr-darkgray to-ethr-black"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 z-[-2] opacity-[0.03] bg-noise"></div>

        {/* Animated neon blobs */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div
            className="absolute top-[30%] left-[10%] w-[50%] h-[40%] rounded-full bg-ethr-neonblue/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "22s" }}
          ></div>
          <div
            className="absolute bottom-[10%] right-[20%] w-[40%] h-[50%] rounded-full bg-ethr-neonpurple/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "25s" }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-12 text-white">
              TAILORED FOR <span className="gradient-text">YOUR ROLE</span>
            </h2>
          </ScrollReveal>

          <Tabs defaultValue="artists" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="artists" className="animate-slide-up">
                FOR ARTISTS
              </TabsTrigger>
              <TabsTrigger value="venues" className="animate-slide-up animate-delay-100">
                FOR VENUES
              </TabsTrigger>
              <TabsTrigger value="production" className="animate-slide-up animate-delay-200">
                FOR PRODUCTION
              </TabsTrigger>
            </TabsList>

            <TabsContent value="artists" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: <Search className="h-6 w-6 text-ethr-neonblue" />,
                    title: "GET DISCOVERED",
                    description:
                      "CREATE A STANDOUT PROFILE THAT SHOWCASES YOUR UNIQUE STYLE AND TALENT. BE FOUND BY VENUES AND EVENT ORGANIZERS LOOKING FOR YOUR SPECIFIC SKILLS.",
                  },
                  {
                    icon: <Calendar className="h-6 w-6 text-ethr-neonblue" />,
                    title: "MANAGE YOUR SCHEDULE",
                    description:
                      "KEEP TRACK OF ALL YOUR BOOKINGS IN ONE PLACE. SET YOUR AVAILABILITY AND NEVER DOUBLE-BOOK AGAIN.",
                  },
                  {
                    icon: <MessageSquare className="h-6 w-6 text-ethr-neonblue" />,
                    title: "DIRECT COMMUNICATION",
                    description:
                      "COMMUNICATE DIRECTLY WITH VENUES AND EVENT ORGANIZERS. DISCUSS REQUIREMENTS, NEGOTIATE TERMS, AND FINALIZE DETAILS.",
                  },
                  {
                    icon: <CreditCard className="h-6 w-6 text-ethr-neonblue" />,
                    title: "SECURE PAYMENTS",
                    description:
                      "GET PAID SECURELY THROUGH OUR PLATFORM. SET YOUR RATES AND RECEIVE PAYMENTS ON TIME, EVERY TIME.",
                  },
                ].map((item, index) => (
                  <GestureAnimation key={index}>
                    <Card
                      className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300 animate-scale-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div
                            className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mr-4 flex-shrink-0 animate-pulse"
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-light mb-2 text-white">{item.title}</h3>
                            <p className="text-white/70 font-light">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </GestureAnimation>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link href="/signup">
                  <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light animate-slide-up">
                    SIGN UP AS AN ARTIST
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="venues" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: <Search className="h-6 w-6 text-ethr-neonblue" />,
                    title: "FIND PERFECT TALENT",
                    description:
                      "BROWSE THROUGH OUR EXTENSIVE DATABASE OF ARTISTS. FILTER BY GENRE, LOCATION, PRICE RANGE, AND AVAILABILITY TO FIND THE PERFECT MATCH FOR YOUR EVENT.",
                  },
                  {
                    icon: <Calendar className="h-6 w-6 text-ethr-neonblue" />,
                    title: "EVENT PLANNING",
                    description:
                      "PLAN YOUR EVENTS WITH EASE. MANAGE MULTIPLE BOOKINGS, COORDINATE WITH ARTISTS, AND ENSURE EVERYTHING RUNS SMOOTHLY.",
                  },
                  {
                    icon: <Star className="h-6 w-6 text-ethr-neonblue" />,
                    title: "QUALITY ASSURANCE",
                    description:
                      "READ REVIEWS FROM OTHER VENUES AND EVENT ORGANIZERS. MAKE INFORMED DECISIONS BASED ON REAL EXPERIENCES.",
                  },
                  {
                    icon: <FileText className="h-6 w-6 text-ethr-neonblue" />,
                    title: "STREAMLINED CONTRACTS",
                    description:
                      "USE OUR CONTRACT TEMPLATES OR UPLOAD YOUR OWN. MANAGE ALL YOUR AGREEMENTS IN ONE PLACE.",
                  },
                ].map((item, index) => (
                  <GestureAnimation key={index}>
                    <Card
                      className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300 animate-scale-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div
                            className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mr-4 flex-shrink-0 animate-pulse"
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-light mb-2 text-white">{item.title}</h3>
                            <p className="text-white/70 font-light">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </GestureAnimation>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link href="/signup">
                  <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light animate-slide-up">
                    SIGN UP AS A VENUE
                  </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="production" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: <Users className="h-6 w-6 text-ethr-neonblue" />,
                    title: "SHOWCASE YOUR SERVICES",
                    description:
                      "HIGHLIGHT YOUR PRODUCTION EXPERTISE, EQUIPMENT, AND PAST PROJECTS. GET DISCOVERED BY VENUES AND ARTISTS LOOKING FOR YOUR SPECIFIC SKILLS.",
                  },
                  {
                    icon: <Clock className="h-6 w-6 text-ethr-neonblue" />,
                    title: "AVAILABILITY MANAGEMENT",
                    description:
                      "SET YOUR AVAILABILITY AND MANAGE YOUR SCHEDULE. COORDINATE WITH VENUES AND ARTISTS FOR SEAMLESS EVENT EXECUTION.",
                  },
                  {
                    icon: <CheckCircle className="h-6 w-6 text-ethr-neonblue" />,
                    title: "TECHNICAL REQUIREMENTS",
                    description:
                      "CLEARLY COMMUNICATE TECHNICAL REQUIREMENTS AND SPECIFICATIONS. ENSURE EVERYONE IS ON THE SAME PAGE BEFORE THE EVENT.",
                  },
                  {
                    icon: <CreditCard className="h-6 w-6 text-ethr-neonblue" />,
                    title: "RELIABLE INCOME",
                    description:
                      "SET YOUR RATES AND GET PAID SECURELY THROUGH OUR PLATFORM. BUILD LONG-TERM RELATIONSHIPS WITH VENUES AND ARTISTS.",
                  },
                ].map((item, index) => (
                  <GestureAnimation key={index}>
                    <Card
                      className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300 animate-scale-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div
                            className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mr-4 flex-shrink-0 animate-pulse"
                            style={{ animationDelay: `${index * 0.2}s` }}
                          >
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-light mb-2 text-white">{item.title}</h3>
                            <p className="text-white/70 font-light">{item.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </GestureAnimation>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link href="/signup">
                  <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light animate-slide-up">
                    SIGN UP AS A PRODUCTION PROFESSIONAL
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Base vertical gradient background */}
        <div className="absolute inset-0 z-[-3] bg-gradient-to-b from-ethr-black via-ethr-darkgray to-ethr-black"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 z-[-2] opacity-[0.03] bg-noise"></div>

        {/* Animated neon blobs */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div
            className="absolute top-[20%] right-[25%] w-[35%] h-[35%] rounded-full bg-ethr-neonblue/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "19s" }}
          ></div>
          <div
            className="absolute bottom-[30%] left-[10%] w-[40%] h-[25%] rounded-full bg-ethr-neonpurple/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "16s" }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-white">
              FEATURES & <span className="gradient-text">BENEFITS</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade" delay={200}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">SMART MATCHING</h3>
                <p className="text-white/70 font-light">
                  OUR ALGORITHM MATCHES ARTISTS WITH VENUES BASED ON GENRE, AVAILABILITY, LOCATION, AND BUDGET
                  COMPATIBILITY.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">INTEGRATED MESSAGING</h3>
                <p className="text-white/70 font-light">
                  KEEP ALL YOUR COMMUNICATIONS IN ONE PLACE. NO MORE DIGGING THROUGH EMAILS, TEXTS, AND SOCIAL MEDIA
                  DMS.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={400}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">CONTRACT MANAGEMENT</h3>
                <p className="text-white/70 font-light">
                  GENERATE, SIGN, AND MANAGE CONTRACTS DIGITALLY. LEGAL TEMPLATES AVAILABLE OR UPLOAD YOUR OWN.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={500}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="h-6 w-6 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">SECURE PAYMENTS</h3>
                <p className="text-white/70 font-light">
                  OUR ESCROW SYSTEM ENSURES ARTISTS GET PAID AND VENUES GET THE PERFORMANCE THEY PAID FOR.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={600}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">REVIEWS & RATINGS</h3>
                <p className="text-white/70 font-light">
                  BUILD YOUR REPUTATION WITH VERIFIED REVIEWS. QUALITY PERFORMERS AND VENUES RISE TO THE TOP.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={700}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">CALENDAR INTEGRATION</h3>
                <p className="text-white/70 font-light">
                  SYNC WITH YOUR EXISTING CALENDAR APPS. NEVER DOUBLE-BOOK OR MISS AN IMPORTANT DATE AGAIN.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Base vertical gradient background */}
        <div className="absolute inset-0 z-[-3] bg-gradient-to-b from-ethr-black via-ethr-darkgray to-ethr-black"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 z-[-2] opacity-[0.03] bg-noise"></div>

        {/* Animated neon blobs */}
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <div
            className="absolute top-[30%] left-[10%] w-[50%] h-[40%] rounded-full bg-ethr-neonblue/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "22s" }}
          ></div>
          <div
            className="absolute bottom-[10%] right-[20%] w-[40%] h-[50%] rounded-full bg-ethr-neonpurple/20 blur-[100px] animate-pulse-slow"
            style={{ animationDuration: "25s" }}
          ></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-white">
              FREQUENTLY ASKED <span className="gradient-text">QUESTIONS</span>
            </h2>
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal animation="fade" delay={200}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-light mb-2 text-white">HOW MUCH DOES ETHR COST?</h3>
                <p className="text-white/70 font-light">
                  ETHR OFFERS MULTIPLE SUBSCRIPTION TIERS TO FIT DIFFERENT NEEDS. BASIC PROFILES ARE FREE, WHILE PRO AND
                  PREMIUM PLANS OFFER ADDITIONAL FEATURES. WE ALSO CHARGE A SMALL SERVICE FEE ON SUCCESSFUL BOOKINGS.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-light mb-2 text-white">HOW ARE PAYMENTS HANDLED?</h3>
                <p className="text-white/70 font-light">
                  PAYMENTS ARE PROCESSED SECURELY THROUGH OUR PLATFORM. WE USE AN ESCROW SYSTEM WHERE FUNDS ARE HELD
                  UNTIL THE EVENT IS SUCCESSFULLY COMPLETED, PROTECTING BOTH PARTIES.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={400}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-light mb-2 text-white">CAN I USE ETHR FOR ANY TYPE OF EVENT?</h3>
                <p className="text-white/70 font-light">
                  YES! ETHR SUPPORTS ALL TYPES OF MUSIC EVENTS, FROM SMALL INTIMATE GATHERINGS TO LARGE FESTIVALS. OUR
                  PLATFORM IS DESIGNED TO BE FLEXIBLE FOR VARIOUS EVENT TYPES AND SIZES.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={500}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-light mb-2 text-white">
                  HOW DO I KNOW I CAN TRUST THE ARTISTS/VENUES ON ETHR?
                </h3>
                <p className="text-white/70 font-light">
                  ALL USERS ON ETHR GO THROUGH A VERIFICATION PROCESS. ADDITIONALLY, OUR REVIEW SYSTEM ALLOWS YOU TO SEE
                  FEEDBACK FROM PREVIOUS COLLABORATIONS, HELPING YOU MAKE INFORMED DECISIONS.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={600}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-light mb-2 text-white">WHAT IF I NEED TO CANCEL AN EVENT?</h3>
                <p className="text-white/70 font-light">
                  WE UNDERSTAND THAT PLANS CHANGE. ETHR HAS A CLEAR CANCELLATION POLICY THAT PROTECTS BOTH PARTIES. THE
                  SPECIFIC TERMS DEPEND ON HOW CLOSE TO THE EVENT DATE THE CANCELLATION OCCURS.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={700}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-light mb-2 text-white">CAN I USE ETHR INTERNATIONALLY?</h3>
                <p className="text-white/70 font-light">
                  YES! ETHR IS AVAILABLE WORLDWIDE. OUR PLATFORM SUPPORTS MULTIPLE CURRENCIES AND LANGUAGES, MAKING IT
                  EASY TO BOOK TALENT ACROSS BORDERS.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Base vertical gradient background */}
        <div className="absolute inset-0 z-[-3] bg-gradient-to-b from-ethr-neonblue/20 to-ethr-neonpurple/20"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 z-[-2] opacity-[0.03] bg-noise"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">READY TO TRANSFORM YOUR MUSIC BUSINESS?</h2>
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={100}>
            <p className="text-xl text-white/70 mb-8 font-light">
              JOIN THOUSANDS OF ARTISTS, VENUES, AND PRODUCTION PROFESSIONALS ALREADY USING ETHR TO STREAMLINE THEIR
              BOOKING PROCESS.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-lg px-8 py-6 font-light">
                  SIGN UP NOW <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 text-lg px-8 py-6 font-light"
                >
                  CONTACT SALES
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
