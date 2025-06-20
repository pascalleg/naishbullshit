import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, MapPin, Search, Star, Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/animated-text"
import { AnimatedButton } from "@/components/animated-button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function VenuesPage() {
  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
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

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <ScrollReveal animation="fade">
                <AnimatedText
                  text="FIND THE PERFECT TALENT"
                  tag="h1"
                  animation="fade"
                  className="text-3xl sm:text-4xl md:text-6xl font-light mb-4 md:mb-6 text-white"
                />
              </ScrollReveal>
              <ScrollReveal animation="fade" delay={200}>
                <p className="text-base md:text-xl text-white/70 mb-6 md:mb-8 font-light">
                  ETHR CONNECTS VENUES AND EVENT ORGANIZERS WITH TOP-TIER ARTISTS AND PRODUCTION PROFESSIONALS. BOOK THE
                  PERFECT TALENT FOR YOUR EVENTS AND CREATE UNFORGETTABLE EXPERIENCES.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade" delay={300}>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light py-6 h-auto">
                      LIST YOUR VENUE
                    </Button>
                  </Link>
                  <Link href="/how-it-works" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto border-white/10 text-white hover:bg-white/5 font-light py-6 h-auto"
                    >
                      LEARN HOW IT WORKS
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="fade" delay={400}>
              <div className="relative mt-8 lg:mt-0">
                <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple opacity-30 blur-lg"></div>
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="/generic-placeholder-300px.png"
                    alt="Nightclub venue with performance"
                    width={800}
                    height={600}
                    className="w-full object-cover aspect-[4/3] md:aspect-[4/3]"
                    priority
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Venue Categories */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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

        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 md:mb-16 text-white">
              ALL TYPES OF <span className="gradient-text">VENUES</span> WELCOME
            </h2>
          </ScrollReveal>

          {/* Mobile Category Selector */}
          <div className="md:hidden mb-8">
            <Sheet>
              <SheetTrigger asChild>
                <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light">
                  <Menu className="h-4 w-4 mr-2" />
                  SELECT VENUE TYPE
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="bg-ethr-darkgray border-white/10 rounded-t-xl h-auto max-h-[80vh]">
                <div className="grid grid-cols-1 gap-2 py-4">
                  <Button variant="ghost" className="justify-start text-white hover:bg-white/5 font-light h-12" asChild>
                    <a href="#clubs">CLUBS & BARS</a>
                  </Button>
                  <Button variant="ghost" className="justify-start text-white hover:bg-white/5 font-light h-12" asChild>
                    <a href="#festivals">FESTIVALS & EVENTS</a>
                  </Button>
                  <Button variant="ghost" className="justify-start text-white hover:bg-white/5 font-light h-12" asChild>
                    <a href="#private">PRIVATE EVENTS</a>
                  </Button>
                  <Button variant="ghost" className="justify-start text-white hover:bg-white/5 font-light h-12" asChild>
                    <a href="#corporate">CORPORATE VENUES</a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Tabs defaultValue="clubs" className="w-full">
            <TabsList className="hidden md:grid w-full grid-cols-2 md:grid-cols-4 mb-12 bg-white/5 backdrop-blur-sm">
              <TabsTrigger
                value="clubs"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                CLUBS & BARS
              </TabsTrigger>
              <TabsTrigger
                value="festivals"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                FESTIVALS & EVENTS
              </TabsTrigger>
              <TabsTrigger
                value="private"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                PRIVATE EVENTS
              </TabsTrigger>
              <TabsTrigger
                value="corporate"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                CORPORATE VENUES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clubs" className="space-y-8" id="clubs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={`/generic-placeholder-300px.png`}
                          alt="Nightclub"
                          width={500}
                          height={300}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">NEON LOUNGE</h3>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1 text-white/70" />
                              <p className="text-sm text-white/70 font-light">LOS ANGELES, CA</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70 font-light">4.9</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3 md:p-4">
                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light text-xs">
                              NIGHTCLUB
                            </Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light text-xs">
                              CAPACITY: 500
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10 font-light text-xs h-8 px-2"
                          >
                            VIEW VENUE
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/venues/all?category=clubs">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-6 py-3 md:px-8 md:py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL CLUBS & BARS
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="festivals" className="space-y-8" id="festivals">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={`/generic-placeholder-300px.png`}
                          alt="Festival"
                          width={500}
                          height={300}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">COSMIC GATHERING</h3>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1 text-white/70" />
                              <p className="text-sm text-white/70 font-light">JOSHUA TREE, CA</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70 font-light">4.8</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3 md:p-4">
                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light text-xs">
                              FESTIVAL
                            </Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light text-xs">
                              CAPACITY: 5000
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10 font-light text-xs h-8 px-2"
                          >
                            VIEW VENUE
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/venues/all?category=festivals">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-6 py-3 md:px-8 md:py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL FESTIVALS & EVENTS
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="private" className="space-y-8" id="private">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={`/generic-placeholder-300px.png`}
                          alt="Private Venue"
                          width={500}
                          height={300}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">SKYLINE LOFT</h3>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1 text-white/70" />
                              <p className="text-sm text-white/70 font-light">CHICAGO, IL</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70 font-light">4.7</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3 md:p-4">
                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light text-xs">
                              PRIVATE
                            </Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light text-xs">
                              CAPACITY: 150
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10 font-light text-xs h-8 px-2"
                          >
                            VIEW VENUE
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/venues/all?category=private">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-6 py-3 md:px-8 md:py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL PRIVATE VENUES
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="corporate" className="space-y-8" id="corporate">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={`/generic-placeholder-300px.png`}
                          alt="Corporate Venue"
                          width={500}
                          height={300}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">GRAND BALLROOM</h3>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-4 w-4 mr-1 text-white/70" />
                              <p className="text-sm text-white/70 font-light">NEW YORK, NY</p>
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70 font-light">4.9</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-3 md:p-4">
                        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light text-xs">
                              CORPORATE
                            </Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light text-xs">
                              CAPACITY: 300
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10 font-light text-xs h-8 px-2"
                          >
                            VIEW VENUE
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/venues/all?category=corporate">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-6 py-3 md:px-8 md:py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL CORPORATE VENUES
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 md:mb-16 text-white">
              WHY VENUES CHOOSE <span className="gradient-text">ETHR</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <ScrollReveal animation="fade" delay={200}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300 h-full">
                <CardContent className="p-4 md:p-6 h-full flex flex-col">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-5 w-5 md:h-6 md:w-6 text-ethr-neonblue" />
                  </div>
                  <h3 className="text-lg md:text-xl font-light mb-2 text-white">FIND PERFECT TALENT</h3>
                  <p className="text-sm md:text-base text-white/70 font-light">
                    ACCESS OUR EXTENSIVE DATABASE OF VERIFIED ARTISTS AND PERFORMERS. FILTER BY GENRE, AVAILABILITY, AND
                    BUDGET TO FIND THE PERFECT MATCH FOR YOUR VENUE.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300 h-full">
                <CardContent className="p-4 md:p-6 h-full flex flex-col">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-5 w-5 md:h-6 md:w-6 text-ethr-neonblue" />
                  </div>
                  <h3 className="text-lg md:text-xl font-light mb-2 text-white">STREAMLINED BOOKING</h3>
                  <p className="text-sm md:text-base text-white/70 font-light">
                    MANAGE ALL YOUR BOOKINGS IN ONE PLACE. SEND REQUESTS, NEGOTIATE TERMS, AND FINALIZE CONTRACTS
                    SEAMLESSLY THROUGH OUR PLATFORM.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={400}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300 h-full">
                <CardContent className="p-4 md:p-6 h-full flex flex-col">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-ethr-neonblue" />
                  </div>
                  <h3 className="text-lg md:text-xl font-light mb-2 text-white">QUALITY ASSURANCE</h3>
                  <p className="text-sm md:text-base text-white/70 font-light">
                    READ VERIFIED REVIEWS FROM OTHER VENUES. KNOW EXACTLY WHAT TO EXPECT BEFORE BOOKING AN ARTIST FOR
                    YOUR EVENT.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-center mb-10 md:mb-16 text-white">
              HOW TO GET <span className="gradient-text">STARTED</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8">
            <ScrollReveal animation="fade" delay={200}>
              <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-6 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <span className="text-lg md:text-xl font-bold text-ethr-black">1</span>
                </div>
                <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3 text-white">CREATE YOUR VENUE PROFILE</h3>
                <p className="text-sm md:text-base text-white/70 font-light">
                  SIGN UP AND BUILD YOUR VENUE PROFILE. ADD PHOTOS, CAPACITY INFORMATION, AND TECHNICAL SPECIFICATIONS.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-6 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <span className="text-lg md:text-xl font-bold text-ethr-black">2</span>
                </div>
                <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3 text-white">SEARCH FOR TALENT</h3>
                <p className="text-sm md:text-base text-white/70 font-light">
                  BROWSE OUR DATABASE OF ARTISTS AND PERFORMERS. FILTER BY GENRE, LOCATION, PRICE RANGE, AND
                  AVAILABILITY.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={400}>
              <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-6 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <span className="text-lg md:text-xl font-bold text-ethr-black">3</span>
                </div>
                <h3 className="text-lg md:text-xl font-light mb-2 md:mb-3 text-white">BOOK AND MANAGE EVENTS</h3>
                <p className="text-sm md:text-base text-white/70 font-light">
                  SEND BOOKING REQUESTS, NEGOTIATE TERMS, AND MANAGE ALL YOUR EVENTS IN ONE PLACE. TRACK PERFORMANCE
                  METRICS AND COLLECT FEEDBACK.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mobile App Promotion - New Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-[-3] bg-gradient-to-b from-ethr-black via-ethr-darkgray to-ethr-black"></div>
        <div className="absolute inset-0 z-[-2] opacity-[0.03] bg-noise"></div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 md:p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[60%] h-full opacity-10 md:opacity-20">
              <Image src="/generic-placeholder-300px.png" alt="Mobile app" fill className="object-cover" />
            </div>

            <div className="relative z-10 max-w-lg">
              <h3 className="text-xl md:text-2xl font-light mb-3 text-white">MANAGE YOUR VENUE ON THE GO</h3>
              <p className="text-sm md:text-base text-white/70 font-light mb-6">
                DOWNLOAD THE ETHR MOBILE APP TO MANAGE BOOKINGS, RESPOND TO INQUIRIES, AND TRACK YOUR VENUE'S
                PERFORMANCE FROM ANYWHERE.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.5,2H8.5L5,5.5v13L8.5,22h9l3.5-3.5v-13L17.5,2z M12,17.5c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S12.8,17.5,12,17.5z" />
                  </svg>
                  APP STORE
                </Button>
                <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,3v18h18V3H3z M13.5,12.5l-3,1.7v-3.4L13.5,12.5z" />
                  </svg>
                  GOOGLE PLAY
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fixed Mobile Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button className="rounded-full h-14 w-14 bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple shadow-lg flex items-center justify-center">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </main>
  )
}
