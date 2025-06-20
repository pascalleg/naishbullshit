import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, CheckCircle, FileText, Headphones, Lightbulb, Settings, Star, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/animated-text"
import { AnimatedButton } from "@/components/animated-button"

export default function ProductionPage() {
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

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal animation="fade">
                <AnimatedText
                  text="PRODUCTION"
                  tag="h1"
                  animation="fade"
                  className="text-4xl md:text-6xl font-light mb-2 text-white"
                />
                <AnimatedText
                  text="PROFESSIONALS"
                  tag="h1"
                  animation="fade"
                  delay={300}
                  className="text-4xl md:text-6xl font-light mb-6 text-ethr-neonblue"
                />
              </ScrollReveal>
              <ScrollReveal animation="fade" delay={200}>
                <p className="text-xl text-white/70 mb-8 font-light">
                  ETHR CONNECTS SOUND ENGINEERS, LIGHTING TECHNICIANS, STAGE MANAGERS, AND OTHER PRODUCTION
                  PROFESSIONALS WITH VENUES AND EVENTS THAT NEED YOUR EXPERTISE.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade" delay={300}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/signup">
                    <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light">
                      JOIN AS PRODUCTION PRO
                    </Button>
                  </Link>
                  <Link href="/how-it-works">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 font-light">
                      LEARN HOW IT WORKS
                    </Button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="fade" delay={400}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple opacity-30 blur-lg"></div>
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="Sound engineer at mixing console"
                    width={800}
                    height={600}
                    className="w-full object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Production Categories */}
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

        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-white">
              ALL TYPES OF <span className="gradient-text">PRODUCTION PROS</span> WELCOME
            </h2>
          </ScrollReveal>

          <Tabs defaultValue="sound" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-12 bg-white/5 backdrop-blur-sm">
              <TabsTrigger
                value="sound"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                SOUND
              </TabsTrigger>
              <TabsTrigger
                value="lighting"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                LIGHTING
              </TabsTrigger>
              <TabsTrigger
                value="stage"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                STAGE MANAGEMENT
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                TECHNICAL DIRECTION
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sound" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`/placeholder.svg?key=xhtqi&key=c2jce&height=400&width=400&text=Sound`}
                          alt="Sound Engineer"
                          width={400}
                          height={400}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">SAM TAYLOR</h3>
                            <p className="text-sm text-white/70 font-light">SOUND ENGINEER</p>
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
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light">
                              LOS ANGELES
                            </Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light">
                              10+ YEARS EXP
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10 font-light"
                            asChild
                          >
                            <Link href={`/production/sound/${item}`}>VIEW PROFILE</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/production/sound/all">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL SOUND ENGINEERS
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="lighting" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`/placeholder.svg?key=hgdwk&key=v3fot&height=400&width=400&text=Lighting`}
                          alt="Lighting Designer"
                          width={400}
                          height={400}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">ALEX RIVERA</h3>
                            <p className="text-sm text-white/70 font-light">LIGHTING DESIGNER</p>
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
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light">
                              NEW YORK
                            </Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light">
                              8+ YEARS EXP
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10 font-light"
                            asChild
                          >
                            <Link href={`/production/lighting/${item}`}>VIEW PROFILE</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/production/lighting/all">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL LIGHTING DESIGNERS
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="stage" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`/placeholder.svg?key=vp5c6&key=wd8x5&height=400&width=400&text=Stage`}
                          alt="Stage Manager"
                          width={400}
                          height={400}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">JAMIE CHEN</h3>
                            <p className="text-sm text-white/70 font-light">STAGE MANAGER</p>
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
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light">
                              CHICAGO
                            </Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light">
                              12+ YEARS EXP
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10 font-light"
                            asChild
                          >
                            <Link href={`/production/stage/${item}`}>VIEW PROFILE</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/production/stage/all">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL STAGE MANAGERS
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`/placeholder.svg?key=21mm2&key=y68jm&height=400&width=400&text=Technical`}
                          alt="Technical Director"
                          width={400}
                          height={400}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">MORGAN LEE</h3>
                            <p className="text-sm text-white/70 font-light">TECHNICAL DIRECTOR</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70 font-light">5.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none font-light">
                              AUSTIN
                            </Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none font-light">
                              15+ YEARS EXP
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10 font-light"
                            asChild
                          >
                            <Link href={`/production/technical/${item}`}>VIEW PROFILE</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/production/technical/all">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL TECHNICAL DIRECTORS
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
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
              WHY PRODUCTION PROS CHOOSE <span className="gradient-text">ETHR</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade" delay={200}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-ethr-neonblue" />
                  </div>
                  <h3 className="text-xl font-light mb-2 text-white">CONSISTENT WORK</h3>
                  <p className="text-white/70 font-light">
                    CONNECT WITH VENUES AND EVENTS THAT NEED YOUR SPECIFIC EXPERTISE. BUILD A STEADY STREAM OF GIGS AND
                    MANAGE YOUR SCHEDULE EFFICIENTLY.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-ethr-neonblue" />
                  </div>
                  <h3 className="text-xl font-light mb-2 text-white">SIMPLIFIED CONTRACTS</h3>
                  <p className="text-white/70 font-light">
                    OUR PLATFORM HANDLES ALL THE PAPERWORK. CLEARLY OUTLINE YOUR REQUIREMENTS, RATES, AND TERMS IN ONE
                    PLACE.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={400}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-ethr-neonblue" />
                  </div>
                  <h3 className="text-xl font-light mb-2 text-white">SECURE PAYMENTS</h3>
                  <p className="text-white/70 font-light">
                    GET PAID ON TIME, EVERY TIME. OUR SECURE PAYMENT SYSTEM ENSURES YOU'RE COMPENSATED FAIRLY FOR YOUR
                    EXPERTISE.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-white">
              PRODUCTION <span className="gradient-text">SERVICES</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScrollReveal animation="fade" delay={200}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">SOUND ENGINEERING</h3>
                <p className="text-white/70 font-light">
                  LIVE SOUND MIXING, RECORDING, AUDIO EQUIPMENT SETUP AND OPERATION FOR EVENTS OF ALL SIZES.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">LIGHTING DESIGN</h3>
                <p className="text-white/70 font-light">
                  CREATIVE LIGHTING SOLUTIONS, PROGRAMMING, OPERATION, AND EQUIPMENT RENTAL FOR PERFORMANCES AND EVENTS.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={400}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">STAGE MANAGEMENT</h3>
                <p className="text-white/70 font-light">
                  COORDINATION OF PERFORMANCES, ARTIST MANAGEMENT, AND ENSURING SMOOTH EVENT EXECUTION FROM SETUP TO
                  BREAKDOWN.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={500}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg text-center border border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-ethr-neonblue" />
                </div>
                <h3 className="text-xl font-light mb-2 text-white">TECHNICAL DIRECTION</h3>
                <p className="text-white/70 font-light">
                  OVERALL TECHNICAL PLANNING, COORDINATION OF PRODUCTION ELEMENTS, AND PROBLEM-SOLVING FOR COMPLEX
                  EVENTS.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
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
              HOW TO GET <span className="gradient-text">STARTED</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade" delay={200}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-ethr-black">1</span>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">CREATE YOUR PROFILE</h3>
                <p className="text-white/70 font-light">
                  SIGN UP AND SHOWCASE YOUR EXPERTISE, EQUIPMENT, AND PAST PROJECTS. HIGHLIGHT YOUR SPECIFIC SKILLS AND
                  EXPERIENCE.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-ethr-black">2</span>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">SET YOUR TERMS</h3>
                <p className="text-white/70 font-light">
                  DEFINE YOUR AVAILABILITY, RATES, AND SERVICE DETAILS. BE CLEAR ABOUT WHAT YOU OFFER AND YOUR TECHNICAL
                  REQUIREMENTS.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={400}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold text-ethr-black">3</span>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">GET BOOKED</h3>
                <p className="text-white/70 font-light">
                  START RECEIVING BOOKING REQUESTS, COMMUNICATE WITH VENUES AND ARTISTS, AND CONFIRM YOUR GIGS.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="fade" delay={500}>
            <div className="text-center mt-12">
              <Link href="/signup">
                <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-light">
                  JOIN AS PRODUCTION PRO <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>
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
                <h3 className="text-xl font-light mb-2 text-white">
                  HOW MUCH DOES IT COST TO JOIN AS A PRODUCTION PROFESSIONAL?
                </h3>
                <p className="text-white/70 font-light">
                  CREATING A BASIC PROFILE ON ETHR IS COMPLETELY FREE. WE ONLY CHARGE A SMALL COMMISSION WHEN YOU
                  SUCCESSFULLY BOOK A GIG THROUGH OUR PLATFORM. PREMIUM FEATURES ARE AVAILABLE THROUGH OUR SUBSCRIPTION
                  PLANS.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-light mb-2 text-white">CAN I BRING MY OWN EQUIPMENT?</h3>
                <p className="text-white/70 font-light">
                  YOU CAN SPECIFY IN YOUR PROFILE WHETHER YOU PROVIDE YOUR OWN EQUIPMENT OR PREFER TO USE THE VENUE'S.
                  THIS FLEXIBILITY ALLOWS YOU TO WORK WITH A WIDER RANGE OF CLIENTS AND EVENTS.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={400}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-light mb-2 text-white">HOW DO I HANDLE TECHNICAL REQUIREMENTS?</h3>
                <p className="text-white/70 font-light">
                  ETHR PROVIDES TOOLS TO CLEARLY COMMUNICATE TECHNICAL REQUIREMENTS WITH VENUES AND ARTISTS. YOU CAN
                  UPLOAD TECH RIDERS, EQUIPMENT LISTS, AND STAGE PLOTS TO ENSURE EVERYONE IS ON THE SAME PAGE BEFORE THE
                  EVENT.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={500}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="text-xl font-light mb-2 text-white">WHAT TYPES OF EVENTS CAN I WORK ON?</h3>
                <p className="text-white/70 font-light">
                  ETHR CONNECTS PRODUCTION PROFESSIONALS WITH A WIDE RANGE OF EVENTS - FROM SMALL CLUB GIGS TO LARGE
                  FESTIVALS, PRIVATE PARTIES TO CORPORATE EVENTS. YOU CAN SPECIFY WHICH TYPES OF EVENTS YOU PREFER TO
                  WORK ON IN YOUR PROFILE.
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
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">
              READY TO ELEVATE YOUR PRODUCTION CAREER?
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={100}>
            <p className="text-xl text-white/70 mb-8 font-light">
              JOIN THOUSANDS OF PRODUCTION PROFESSIONALS ALREADY USING ETHR TO FIND CONSISTENT WORK, STREAMLINE THEIR
              BUSINESS, AND CONNECT WITH THE PERFECT VENUES AND EVENTS.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-lg px-8 py-6 font-light">
                  JOIN AS PRODUCTION PRO <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button
                  variant="outline"
                  className="border-white/10 text-white hover:bg-white/5 text-lg px-8 py-6 font-light"
                >
                  LEARN MORE
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
