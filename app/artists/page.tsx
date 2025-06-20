import { MainNav } from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, CheckCircle, Search, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedButton } from "@/components/animated-button"
import { AnimatedText } from "@/components/animated-text"

export default function ArtistsPage() {
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

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="fade">
              <div>
                <AnimatedText
                  text="SHOWCASE YOUR"
                  tag="h1"
                  animation="fade"
                  className="text-4xl md:text-5xl lg:text-6xl font-light mb-2 text-white"
                />
                <AnimatedText
                  text="TALENT"
                  tag="h1"
                  animation="fade"
                  delay={300}
                  className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 text-ethr-neonblue"
                />
                <p className="text-xl text-white/70 mb-8 font-light">
                  ETHR CONNECTS TALENTED ARTISTS WITH THE PERFECT VENUES AND EVENTS. BUILD YOUR PROFILE, GET DISCOVERED,
                  AND GROW YOUR CAREER.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <AnimatedButton
                    variant="default"
                    size="lg"
                    className="rounded-full px-8 h-14 bg-ethr-neonblue text-white hover:bg-ethr-neonblue/90"
                    ripple={false}
                    hover="lift"
                  >
                    CREATE ARTIST PROFILE
                  </AnimatedButton>
                  <AnimatedButton
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 h-14 backdrop-blur-sm"
                    ripple={false}
                    hover="lift"
                  >
                    LEARN HOW IT WORKS
                  </AnimatedButton>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal animation="fade" delay={300}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-lg bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple opacity-30 blur-lg"></div>
                <div className="relative rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=600&width=800"
                    alt="DJ performing at an event"
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

      {/* Artist Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-ethr-black to-ethr-darkgray/80">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-white">
              ALL TYPES OF <span className="text-ethr-neonblue">ARTISTS</span> WELCOME
            </h2>
          </ScrollReveal>

          <Tabs defaultValue="djs" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-12 bg-white/5 backdrop-blur-sm">
              <TabsTrigger
                value="djs"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                DJs
              </TabsTrigger>
              <TabsTrigger
                value="bands"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                BANDS
              </TabsTrigger>
              <TabsTrigger
                value="solo"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                SOLO ARTISTS
              </TabsTrigger>
              <TabsTrigger
                value="specialty"
                className="data-[state=active]:bg-white/10 data-[state=active]:text-ethr-neonblue"
              >
                SPECIALTY ACTS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="djs" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`/placeholder.svg?key=3d7dc&key=i63q2&height=400&width=400&text=DJ`}
                          alt="DJ Artist"
                          width={400}
                          height={400}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">DJ SYNAPSE</h3>
                            <p className="text-sm text-white/70">ELECTRONIC / HOUSE</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70">4.9</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none">LOS ANGELES</Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none">
                              $500-1000/NIGHT
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-ethr-neonblue hover:text-ethr-neonblue hover:bg-ethr-neonblue/10"
                            asChild
                          >
                            <Link href={`/artists/${item}`}>VIEW PROFILE</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/artists/all?category=djs">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL DJs
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="bands" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`/placeholder.svg?key=f5s5f&height=400&width=400&text=Band`}
                          alt="Band"
                          width={400}
                          height={400}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">COSMIC WAVES</h3>
                            <p className="text-sm text-white/70">INDIE / ROCK</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70">4.8</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none">NEW YORK</Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none">
                              $1000-2000/NIGHT
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-ethr-neonblue hover:text-ethr-neonblue hover:bg-ethr-neonblue/10"
                            asChild
                          >
                            <Link href={`/artists/${item}`}>VIEW PROFILE</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/artists/all?category=bands">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL BANDS
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="solo" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`/placeholder.svg?key=hr913&height=400&width=400&text=Solo`}
                          alt="Solo Artist"
                          width={400}
                          height={400}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">ELENA JAMES</h3>
                            <p className="text-sm text-white/70">SINGER-SONGWRITER</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70">4.7</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none">AUSTIN</Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none">
                              $500-800/NIGHT
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-ethr-neonblue hover:text-ethr-neonblue hover:bg-ethr-neonblue/10"
                            asChild
                          >
                            <Link href={`/artists/${item}`}>VIEW PROFILE</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/artists/all?category=solo">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL SOLO ARTISTS
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="specialty" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <ScrollReveal key={item} animation="fade" delay={item * 50}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-ethr-neonblue/30 transition-all duration-300">
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={`/placeholder.svg?key=q4ef4&height=400&width=400&text=Specialty`}
                          alt="Specialty Act"
                          width={400}
                          height={400}
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                          <div>
                            <h3 className="font-light text-lg text-white">FIRE FUSION</h3>
                            <p className="text-sm text-white/70">FIRE PERFORMERS</p>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="h-4 w-4 text-ethr-neonblue fill-ethr-neonblue" />
                                ))}
                              </div>
                              <span className="text-sm ml-1 text-white/70">5.0</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Badge className="bg-ethr-neonblue/20 text-ethr-neonblue border-none">MIAMI</Badge>
                            <Badge className="bg-ethr-neonpurple/20 text-ethr-neonpurple border-none">
                              $1200-2500/NIGHT
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-ethr-neonblue hover:text-ethr-neonblue hover:bg-ethr-neonblue/10"
                            asChild
                          >
                            <Link href={`/artists/${item}`}>VIEW PROFILE</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollReveal>
                ))}
              </div>
              <div className="text-center">
                <Link href="/artists/all?category=specialty">
                  <AnimatedButton
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-4 backdrop-blur-sm"
                    hover="lift"
                    ripple={false}
                  >
                    VIEW ALL SPECIALTY ACTS
                  </AnimatedButton>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-ethr-darkgray/80 to-ethr-black">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-white">
              WHY ARTISTS CHOOSE <span className="text-ethr-neonblue">ETHR</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade" delay={100}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Search className="h-6 w-6 text-ethr-neonblue" />
                  </div>
                  <h3 className="text-xl font-light mb-2 text-white">GET DISCOVERED</h3>
                  <p className="text-white/70">
                    Our platform connects you with venues and event organizers actively looking for your talent. No more
                    cold calls or unanswered emails.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={200}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-ethr-neonblue" />
                  </div>
                  <h3 className="text-xl font-light mb-2 text-white">MANAGE YOUR SCHEDULE</h3>
                  <p className="text-white/70">
                    Keep track of all your bookings in one place. Set your availability and never double-book again.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-ethr-neonblue" />
                  </div>
                  <h3 className="text-xl font-light mb-2 text-white">SECURE PAYMENTS</h3>
                  <p className="text-white/70">
                    Get paid on time, every time. Our secure payment system ensures you're compensated fairly for your
                    performances.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-ethr-black to-ethr-darkgray/80">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-white">
              HOW TO GET <span className="text-ethr-neonblue">STARTED</span>
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal animation="fade" delay={100}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 relative">
                  <span className="text-2xl font-light text-ethr-neonblue">1</span>
                  <div className="absolute inset-0 rounded-full border border-white/20"></div>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">CREATE YOUR PROFILE</h3>
                <p className="text-white/70">
                  Sign up and build your professional profile. Add photos, videos, and audio samples to showcase your
                  talent.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={200}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 relative">
                  <span className="text-2xl font-light text-ethr-neonblue">2</span>
                  <div className="absolute inset-0 rounded-full border border-white/20"></div>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">SET YOUR TERMS</h3>
                <p className="text-white/70">
                  Define your availability, rates, and performance requirements. Be clear about what you offer.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 relative">
                  <span className="text-2xl font-light text-ethr-neonblue">3</span>
                  <div className="absolute inset-0 rounded-full border border-white/20"></div>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">GET BOOKED</h3>
                <p className="text-white/70">
                  Start receiving booking requests, communicate with venues, and confirm your performances.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="fade" delay={400}>
            <div className="text-center mt-12">
              <AnimatedButton
                variant="default"
                className="rounded-full px-8 py-4 bg-ethr-neonblue text-white hover:bg-ethr-neonblue/90"
                hover="lift"
                ripple={false}
              >
                CREATE YOUR ARTIST PROFILE <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-ethr-darkgray/80 to-ethr-black">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light text-center mb-16 text-white">
              FREQUENTLY ASKED <span className="text-ethr-neonblue">QUESTIONS</span>
            </h2>
          </ScrollReveal>

          <div className="space-y-6">
            <ScrollReveal animation="fade" delay={100}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-light mb-2 text-white">How much does it cost to join as an artist?</h3>
                <p className="text-white/70">
                  Creating a basic profile on ETHR is completely free. We only charge a small commission when you
                  successfully book a gig through our platform. Premium features are available through our subscription
                  plans.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={200}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-light mb-2 text-white">How do I get more visibility for my profile?</h3>
                <p className="text-white/70">
                  Complete your profile with high-quality photos, videos, and audio samples. Add detailed information
                  about your performance style and experience. Regularly update your availability and respond quickly to
                  booking requests to improve your ranking in search results.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={300}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-light mb-2 text-white">When and how do I get paid?</h3>
                <p className="text-white/70">
                  Payment terms are set during the booking process. Typically, venues provide a deposit when confirming
                  the booking, with the remainder paid after the performance. All payments are processed securely
                  through our platform to protect both parties.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade" delay={400}>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-lg border border-white/10">
                <h3 className="text-xl font-light mb-2 text-white">What if I need to cancel a performance?</h3>
                <p className="text-white/70">
                  We understand emergencies happen. Our platform has a clear cancellation policy that protects both
                  artists and venues. The specific terms depend on how close to the event date the cancellation occurs.
                  Always communicate promptly if issues arise.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-ethr-black to-ethr-darkgray/80">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">Ready to Elevate Your Music Career?</h2>
            <p className="text-xl text-white/70 mb-8 font-light">
              Join thousands of artists already using ETHR to book more gigs, increase their earnings, and connect with
              the perfect venues.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <AnimatedButton
                variant="default"
                size="lg"
                className="rounded-full px-8 py-4 bg-ethr-neonblue text-white hover:bg-ethr-neonblue/90"
                hover="lift"
                ripple={false}
              >
                CREATE YOUR PROFILE <ArrowRight className="ml-2 h-5 w-5" />
              </AnimatedButton>
              <AnimatedButton
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/5 rounded-full px-8 py-4 backdrop-blur-sm"
                hover="lift"
                ripple={false}
              >
                LEARN MORE
              </AnimatedButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  )
}
