import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react"
import { MainNav } from "@/components/main-nav"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedText } from "@/components/animated-text"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ethr-black">
      {/* Header with MainNav */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-10 overflow-hidden pt-32">
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

        <div className="relative max-w-6xl mx-auto text-center z-10">
          <ScrollReveal animation="fade">
            <AnimatedText
              text="REVOLUTIONIZING THE MUSIC INDUSTRY"
              tag="h1"
              animation="fade"
              className="text-4xl md:text-6xl font-light mb-6 text-white"
            />
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={200}>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10 font-light">
              ETHR IS BUILDING THE FUTURE OF MUSIC INDUSTRY CONNECTIONS, EMPOWERING ARTISTS, VENUES, AND PRODUCTION
              PROFESSIONALS TO COLLABORATE SEAMLESSLY.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 md:px-10 bg-gradient-to-b from-ethr-black to-ethr-darkgray/80">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal animation="fade">
                <h2 className="text-3xl font-light mb-6 text-white">OUR MISSION</h2>
              </ScrollReveal>
              <ScrollReveal animation="fade" delay={100}>
                <p className="text-white/70 mb-6 font-light">
                  ETHR was founded with a clear mission: to democratize access to opportunities in the music industry.
                  We believe that talent should be the only barrier to entry, not connections or resources.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade" delay={200}>
                <p className="text-white/70 mb-6 font-light">
                  By creating a comprehensive platform that connects artists, venues, and production professionals,
                  we're breaking down the traditional barriers that have limited collaboration and innovation in the
                  industry.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade" delay={300}>
                <p className="text-white/70 font-light">
                  Our technology is designed to empower creators and businesses alike, providing the tools and
                  connections needed to thrive in today's dynamic music landscape.
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal animation="fade" delay={400}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple opacity-30 blur-lg"></div>
                <Card className="relative bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mr-4">
                          <span className="text-ethr-neonblue font-light">1</span>
                        </div>
                        <div>
                          <h3 className="text-white font-light mb-1">CONNECT</h3>
                          <p className="text-white/70 font-light">Bringing together all parts of the music ecosystem</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mr-4">
                          <span className="text-ethr-neonblue font-light">2</span>
                        </div>
                        <div>
                          <h3 className="text-white font-light mb-1">EMPOWER</h3>
                          <p className="text-white/70 font-light">Providing tools for success and growth</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center mr-4">
                          <span className="text-ethr-neonblue font-light">3</span>
                        </div>
                        <div>
                          <h3 className="text-white font-light mb-1">INNOVATE</h3>
                          <p className="text-white/70 font-light">Constantly evolving to meet industry needs</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 md:px-10 bg-gradient-to-b from-ethr-darkgray/80 to-ethr-black relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-12 relative z-10">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl font-light mb-6 text-white">OUR CORE VALUES</h2>
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={100}>
            <p className="text-white/70 max-w-3xl mx-auto font-light">
              These principles guide everything we do at ETHR, from product development to customer support.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
          <ScrollReveal animation="fade" delay={200}>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-ethr-neonblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">INNOVATION</h3>
                <p className="text-white/70 font-light">
                  We're constantly pushing boundaries and exploring new technologies to improve the music industry.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal animation="fade" delay={300}>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-ethr-neonblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">COMMUNITY</h3>
                <p className="text-white/70 font-light">
                  We believe in the power of connection and building strong relationships within the industry.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>

          <ScrollReveal animation="fade" delay={400}>
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-ethr-neonblue/30 transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-ethr-neonblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-light mb-3 text-white">INTEGRITY</h3>
                <p className="text-white/70 font-light">
                  We operate with transparency and honesty in all our dealings with users and partners.
                </p>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 md:px-10 bg-gradient-to-b from-ethr-black to-ethr-darkgray/80 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <ScrollReveal animation="fade">
                <h2 className="text-3xl font-light mb-6 text-white">GET IN TOUCH</h2>
              </ScrollReveal>
              <ScrollReveal animation="fade" delay={100}>
                <p className="text-white/70 mb-8 font-light">
                  Have questions about ETHR or want to learn more about how we can help you? Our team is ready to assist
                  you.
                </p>
              </ScrollReveal>

              <div className="space-y-6">
                <ScrollReveal animation="fade" delay={200}>
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-ethr-neonblue mr-4" />
                    <div>
                      <h3 className="text-white font-light mb-1">OUR LOCATION</h3>
                      <p className="text-white/70 font-light">123 Music Avenue, Los Angeles, CA 90028</p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade" delay={300}>
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-ethr-neonblue mr-4" />
                    <div>
                      <h3 className="text-white font-light mb-1">EMAIL US</h3>
                      <p className="text-white/70 font-light">info@ethrplatform.com</p>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal animation="fade" delay={400}>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-ethr-neonblue mr-4" />
                    <div>
                      <h3 className="text-white font-light mb-1">CALL US</h3>
                      <p className="text-white/70 font-light">+1 (323) 555-0123</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>

              <ScrollReveal animation="fade" delay={500}>
                <div className="mt-8 flex space-x-4">
                  {["facebook", "twitter", "instagram", "linkedin"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-ethr-neonblue/20 transition-colors duration-300"
                    >
                      <img src={`/placeholder.svg?height=24&width=24`} alt={`${social} icon`} className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            <ScrollReveal animation="fade" delay={600}>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-light mb-4 text-white">SEND US A MESSAGE</h3>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-light text-white/70 mb-1">
                          NAME
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-ethr-neonblue text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-light text-white/70 mb-1">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-ethr-neonblue text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-light text-white/70 mb-1">
                        SUBJECT
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-ethr-neonblue text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-light text-white/70 mb-1">
                        MESSAGE
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-1 focus:ring-ethr-neonblue text-white"
                      ></textarea>
                    </div>
                    <Button className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10">
                      SEND MESSAGE
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 md:px-10 bg-gradient-to-b from-ethr-darkgray/80 to-ethr-black">
        <div className="max-w-6xl mx-auto text-center">
          <ScrollReveal animation="fade">
            <h2 className="text-3xl md:text-4xl font-light mb-6 text-white">READY TO JOIN THE REVOLUTION?</h2>
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={100}>
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8 font-light">
              BE PART OF THE FUTURE OF THE MUSIC INDUSTRY. SIGN UP TODAY AND START CONNECTING.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fade" delay={200}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-lg px-8 py-6 font-light">
                SIGN UP NOW
              </Button>
              <Button
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5 text-lg px-8 py-6 font-light"
              >
                REQUEST A DEMO <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
