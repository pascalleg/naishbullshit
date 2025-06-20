import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function TeamPage() {
  const teamMembers = [
    {
      id: "alex-rivera",
      name: "Alex Rivera",
      role: "Founder & CEO",
      image: "/placeholder.svg?height=300&width=300",
      shortBio: "Former music producer with 15+ years of industry experience",
    },
    {
      id: "jordan-chen",
      name: "Jordan Chen",
      role: "CTO",
      image: "/placeholder.svg?height=300&width=300",
      shortBio: "Tech innovator with background in platform development",
    },
    {
      id: "taylor-morgan",
      name: "Taylor Morgan",
      role: "Head of Artist Relations",
      image: "/placeholder.svg?height=300&width=300",
      shortBio: "Former talent agent with extensive artist management experience",
    },
    {
      id: "sam-washington",
      name: "Sam Washington",
      role: "Head of Venue Partnerships",
      image: "/placeholder.svg?height=300&width=300",
      shortBio: "20+ years experience in venue management and event production",
    },
    {
      id: "robin-patel",
      name: "Robin Patel",
      role: "Chief Marketing Officer",
      image: "/placeholder.svg?height=300&width=300",
      shortBio: "Digital marketing expert with focus on music and entertainment",
    },
    {
      id: "casey-williams",
      name: "Casey Williams",
      role: "Head of Product",
      image: "/placeholder.svg?height=300&width=300",
      shortBio: "Product visionary with experience at major tech companies",
    },
    {
      id: "morgan-lee",
      name: "Morgan Lee",
      role: "Head of Engineering",
      image: "/placeholder.svg?height=300&width=300",
      shortBio: "Full-stack engineer with expertise in scalable platforms",
    },
    {
      id: "jamie-rodriguez",
      name: "Jamie Rodriguez",
      role: "Head of Customer Success",
      image: "/placeholder.svg?height=300&width=300",
      shortBio: "Customer experience specialist with music industry background",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-ethr-black/80 to-ethr-black"></div>

        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple">
            Meet Our Team
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
            The passionate individuals behind ETHR's mission to revolutionize the music industry
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Link href={`/team/${member.id}`} key={member.id}>
                <Card className="bg-ethr-darkgray border-0 overflow-hidden group h-full hover:shadow-lg hover:shadow-ethr-neonblue/20 transition-all duration-300">
                  <div className="aspect-square relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-ethr-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 z-10 flex items-end">
                      <div className="p-4 w-full text-center">
                        <span className="inline-flex items-center text-white text-sm">
                          View Profile <ArrowRight className="ml-1 h-4 w-4" />
                        </span>
                      </div>
                    </div>
                    <img
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                    <p className="text-ethr-neonblue text-sm mb-2">{member.role}</p>
                    <p className="text-gray-400 text-sm">{member.shortBio}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link href="/about">
              <Button variant="outline" className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10">
                Back to About
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
