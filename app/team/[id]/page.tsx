import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Github, Linkedin, Mail, Twitter } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// This would typically come from a database or API
const teamMembers = {
  "alex-rivera": {
    name: "Alex Rivera",
    role: "Founder & CEO",
    image: "/placeholder.svg?height=600&width=600",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    bio: "Alex Rivera is the visionary founder and CEO of ETHR, bringing over 15 years of experience in the music industry to the platform. As a former music producer who worked with Grammy-winning artists, Alex intimately understands the challenges faced by artists, venues, and production professionals.",
    longBio:
      "Alex's journey in the music industry began as a teenager, producing beats in a makeshift home studio. After graduating from Berklee College of Music, Alex spent a decade working with major labels and independent artists alike, earning multiple platinum records and industry accolades.\n\nDespite this success, Alex became increasingly frustrated with the fragmentation and inefficiencies in the industry. Booking shows, finding the right venues, and connecting with reliable production professionals was unnecessarily complex and relationship-dependent.\n\nIn 2019, Alex founded ETHR with a mission to democratize access to opportunities in the music industry and create a seamless ecosystem where talent could thrive without traditional gatekeepers. Under Alex's leadership, ETHR has grown from a small startup to an industry-changing platform serving thousands of music professionals worldwide.",
    quote:
      "Technology should empower creativity, not hinder it. We're building the tools I wish I had when I was coming up in the industry.",
    expertise: ["Music Production", "Industry Relations", "Business Strategy", "Artist Development"],
    education: [
      {
        institution: "Berklee College of Music",
        degree: "Bachelor of Music in Music Production & Engineering",
        year: "2008",
      },
    ],
    achievements: [
      "3x Grammy-nominated producer",
      "Founded ETHR in 2019",
      "Raised $12M in Series A funding",
      "Named to Billboard's 40 Under 40 list",
      "Speaker at SXSW, ADE, and Sonar+D conferences",
    ],
    socialMedia: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    email: "alex@ethrplatform.com",
  },
  "jordan-chen": {
    name: "Jordan Chen",
    role: "CTO",
    image: "/placeholder.svg?height=600&width=600",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    bio: "Jordan Chen is the technological mastermind behind ETHR, serving as the company's Chief Technology Officer. With a background in building scalable platforms for major tech companies, Jordan brings a wealth of expertise in creating robust, user-friendly systems.",
    longBio:
      "Jordan's career in technology began after graduating with honors from MIT with a degree in Computer Science. Before joining ETHR, Jordan led engineering teams at several successful startups and established tech companies, including a stint as Lead Architect at a major streaming platform.\n\nJordan's passion for music and technology made ETHR a perfect fit. After meeting Alex at a music tech hackathon in 2019, the two quickly realized their complementary skills and shared vision could transform the industry.\n\nAs CTO, Jordan oversees all technical aspects of the ETHR platform, from infrastructure and security to user experience and feature development. Jordan's philosophy centers on building technology that feels invisible to the user while powerfully enabling their goals.",
    quote: "The best technology doesn't call attention to itself—it simply makes impossible things possible.",
    expertise: ["System Architecture", "Scalable Infrastructure", "Machine Learning", "User Experience Design"],
    education: [
      {
        institution: "Massachusetts Institute of Technology",
        degree: "BS in Computer Science",
        year: "2011",
      },
      {
        institution: "Stanford University",
        degree: "MS in Computer Science, focus on AI",
        year: "2013",
      },
    ],
    achievements: [
      "Architected ETHR's proprietary matching algorithm",
      "Led development of real-time booking system",
      "Previous platforms served millions of users",
      "12 technology patents",
      "Regular contributor to open source projects",
    ],
    socialMedia: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    email: "jordan@ethrplatform.com",
  },
  "taylor-morgan": {
    name: "Taylor Morgan",
    role: "Head of Artist Relations",
    image: "/placeholder.svg?height=600&width=600",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    bio: "Taylor Morgan leads Artist Relations at ETHR, bringing extensive experience as a former talent agent and artist manager. With a deep understanding of artists' needs and challenges, Taylor ensures ETHR delivers meaningful value to creators at every career stage.",
    longBio:
      "Taylor's career in the music industry spans over a decade, beginning as an assistant at a boutique talent agency before rising to become one of the industry's most respected agents. Throughout this journey, Taylor developed a reputation for discovering and nurturing emerging talent while also serving established artists.\n\nBefore joining ETHR, Taylor managed a roster of indie and major label artists, helping them navigate tours, album releases, and brand partnerships. This hands-on experience with artists' day-to-day challenges informs Taylor's approach to product development and community building at ETHR.\n\nAs Head of Artist Relations, Taylor serves as the voice of artists within the company, ensuring their needs are prioritized in platform development. Taylor also leads ETHR's artist onboarding, education initiatives, and community programs.",
    quote:
      "Artists deserve technology that understands their unique challenges and amplifies their creative vision rather than forcing them into rigid systems.",
    expertise: ["Artist Management", "Talent Development", "Tour Planning", "Music Marketing"],
    education: [
      {
        institution: "New York University",
        degree: "BFA in Recorded Music, Clive Davis Institute",
        year: "2010",
      },
    ],
    achievements: [
      "Managed 3 artists from debut to major label deals",
      "Planned and executed 20+ national tours",
      "Developed ETHR's artist verification system",
      "Created ETHR's emerging artist program",
      "Regular speaker at music industry conferences",
    ],
    socialMedia: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    email: "taylor@ethrplatform.com",
  },
  "sam-washington": {
    name: "Sam Washington",
    role: "Head of Venue Partnerships",
    image: "/placeholder.svg?height=600&width=600",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    bio: "Sam Washington leads Venue Partnerships at ETHR, leveraging over 20 years of experience in venue management and event production. Sam's extensive network and deep understanding of venue operations ensure ETHR meets the unique needs of spaces ranging from intimate clubs to major arenas.",
    longBio:
      "Sam's career in the music industry began as a venue manager for a legendary 500-capacity club, booking and producing shows for emerging and established artists across genres. Over the years, Sam worked with venues of all sizes, eventually becoming operations director for a network of mid-sized venues across multiple cities.\n\nPrior to joining ETHR, Sam served as a consultant for venues looking to optimize their booking processes, technology integration, and audience experience. This consulting work provided invaluable insights into the common challenges venues face and the solutions they need.\n\nAt ETHR, Sam oversees all aspects of venue partnerships, from onboarding and training to feature development and support. Sam's team works closely with venues to ensure they can maximize their calendar utilization, find ideal artist matches, and streamline their operations through ETHR's platform.",
    quote:
      "Venues are the lifeblood of live music. Our goal is to help them thrive by connecting them with the perfect artists and simplifying their operations.",
    expertise: ["Venue Operations", "Event Production", "Talent Booking", "Facility Management"],
    education: [
      {
        institution: "University of California, Los Angeles",
        degree: "BA in Business Economics",
        year: "2001",
      },
      {
        institution: "Full Sail University",
        degree: "Certificate in Event Production",
        year: "2003",
      },
    ],
    achievements: [
      "Managed operations for 15+ venues throughout career",
      "Produced over 5,000 live events",
      "Developed ETHR's venue verification protocol",
      "Created ETHR's venue optimization tools",
      "Established ETHR's venue education program",
    ],
    socialMedia: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    email: "sam@ethrplatform.com",
  },
  "robin-patel": {
    name: "Robin Patel",
    role: "Chief Marketing Officer",
    image: "/placeholder.svg?height=600&width=600",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    bio: "Robin Patel serves as ETHR's Chief Marketing Officer, bringing extensive experience in digital marketing for music and entertainment brands. Robin leads all aspects of ETHR's marketing strategy, brand development, and user acquisition.",
    longBio:
      "Robin's marketing career spans over 15 years, with specialized focus on the intersection of technology and entertainment. Before joining ETHR, Robin led digital marketing for a major streaming platform and previously served as VP of Marketing for an international music festival brand.\n\nRobin's approach to marketing combines data-driven decision making with authentic storytelling, creating campaigns that resonate with ETHR's diverse user base of artists, venues, and production professionals. Under Robin's leadership, ETHR has achieved remarkable growth while maintaining a brand identity that feels authentic to the music community.\n\nAs CMO, Robin oversees ETHR's global marketing team, including brand strategy, content creation, social media, performance marketing, and partnerships. Robin is particularly passionate about elevating success stories from the ETHR community and showcasing how the platform enables meaningful connections in the industry.",
    quote:
      "Great marketing in the music space isn't about hype—it's about authentically connecting with the community and demonstrating real value.",
    expertise: ["Digital Marketing", "Brand Strategy", "Content Marketing", "Growth Marketing"],
    education: [
      {
        institution: "University of Southern California",
        degree: "BS in Business Administration, emphasis in Marketing",
        year: "2007",
      },
    ],
    achievements: [
      "Led marketing campaigns reaching 50M+ music fans",
      "Developed ETHR's brand identity and positioning",
      "Achieved 200% year-over-year user growth",
      "Created ETHR's ambassador program",
      "Named to AdAge's 40 Under 40 in Marketing",
    ],
    socialMedia: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    email: "robin@ethrplatform.com",
  },
  "casey-williams": {
    name: "Casey Williams",
    role: "Head of Product",
    image: "/placeholder.svg?height=600&width=600",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    bio: "Casey Williams leads Product at ETHR, bringing experience from major tech companies and a passion for music technology. Casey oversees the product roadmap, user experience, and feature development for the platform.",
    longBio:
      "Casey's product career includes roles at several leading technology companies, including a senior product position at a major music streaming service. This background provides Casey with unique insights into building products that serve both creators and consumers in the music ecosystem.\n\nA classically trained pianist with experience performing in bands, Casey brings a creator's perspective to product development at ETHR. This dual background in technology and music helps Casey design features that truly address the needs of ETHR's diverse user base.\n\nAs Head of Product, Casey works closely with all departments to ensure ETHR's platform evolves in ways that deliver maximum value to users while advancing the company's mission. Casey is particularly focused on creating intuitive workflows that simplify complex processes in the music industry.",
    quote:
      "Great products solve real problems simply. In the music industry, that means removing friction so people can focus on what matters—the music.",
    expertise: ["Product Management", "User Experience", "Feature Development", "Market Research"],
    education: [
      {
        institution: "Brown University",
        degree: "BA in Computer Science and Music",
        year: "2011",
      },
    ],
    achievements: [
      "Led development of ETHR's booking and payment system",
      "Implemented ETHR's matching algorithm interface",
      "Previous products used by millions globally",
      "Speaker at Product School and Mind the Product conferences",
      "Mentor for music tech startups",
    ],
    socialMedia: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    email: "casey@ethrplatform.com",
  },
  "morgan-lee": {
    name: "Morgan Lee",
    role: "Head of Engineering",
    image: "/placeholder.svg?height=600&width=600",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    bio: "Morgan Lee leads the Engineering team at ETHR, bringing expertise in building scalable, reliable platforms. Morgan oversees all aspects of ETHR's technical implementation, from frontend development to backend infrastructure.",
    longBio:
      "Morgan's engineering career includes leadership roles at several high-growth startups and established tech companies. Before joining ETHR, Morgan led engineering for a fintech platform processing billions in transactions and previously built infrastructure for a major social media platform.\n\nAs a lifelong music enthusiast and amateur producer, Morgan was drawn to ETHR's mission of transforming the music industry through technology. Morgan's technical philosophy emphasizes reliability, security, and performance while maintaining the agility to rapidly iterate based on user feedback.\n\nAt ETHR, Morgan leads a diverse engineering team distributed across multiple countries. Morgan has implemented modern development practices that enable ETHR to ship new features quickly while maintaining a stable platform that users can depend on for their livelihoods.",
    quote:
      "Engineering isn't just about writing code—it's about building systems that solve real human problems reliably and elegantly.",
    expertise: ["Software Architecture", "Team Leadership", "Full-Stack Development", "DevOps"],
    education: [
      {
        institution: "Georgia Institute of Technology",
        degree: "BS in Computer Science",
        year: "2010",
      },
    ],
    achievements: [
      "Built ETHR's scalable cloud infrastructure",
      "Implemented real-time messaging and notification system",
      "Previous systems handled millions of daily active users",
      "Contributor to several open source projects",
      "Reduced platform latency by 60%",
    ],
    socialMedia: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
      github: "https://github.com",
    },
    email: "morgan@ethrplatform.com",
  },
  "jamie-rodriguez": {
    name: "Jamie Rodriguez",
    role: "Head of Customer Success",
    image: "/placeholder.svg?height=600&width=600",
    coverImage: "/placeholder.svg?height=1080&width=1920",
    bio: "Jamie Rodriguez leads Customer Success at ETHR, ensuring users have an exceptional experience with the platform. With a background in both customer experience and the music industry, Jamie brings a unique perspective to supporting ETHR's diverse user base.",
    longBio:
      "Jamie's career began in artist management before transitioning to customer experience roles at several technology companies. This dual background gives Jamie unique insights into the challenges faced by ETHR's users and how to best support them.\n\nBefore joining ETHR, Jamie built and led customer success teams at a major event ticketing platform and a music licensing startup. These experiences provided Jamie with a deep understanding of the music industry's specific customer support needs and best practices for scaling support operations.\n\nAt ETHR, Jamie has built a customer success team that goes beyond traditional support, proactively helping users maximize value from the platform. Jamie's team includes specialists focused on artists, venues, and production professionals, ensuring each user group receives tailored assistance.",
    quote:
      "Customer success in our industry means more than solving tickets—it means actively helping our users achieve their creative and business goals.",
    expertise: ["Customer Experience", "User Onboarding", "Support Operations", "Community Management"],
    education: [
      {
        institution: "University of Miami",
        degree: "BM in Music Business and Entertainment Industries",
        year: "2012",
      },
    ],
    achievements: [
      "Built ETHR's customer success team from scratch",
      "Achieved 95% customer satisfaction rating",
      "Developed ETHR's comprehensive knowledge base",
      "Created ETHR's user onboarding program",
      "Implemented proactive success monitoring system",
    ],
    socialMedia: {
      twitter: "https://twitter.com",
      linkedin: "https://linkedin.com",
    },
    email: "jamie@ethrplatform.com",
  },
}

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  const member = teamMembers[params.id as keyof typeof teamMembers]

  if (!member) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${member.coverImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-ethr-black/80 to-ethr-black"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Link href="/team">
              <Button variant="ghost" className="text-white hover:bg-white/10 mb-6" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
              </Button>
            </Link>

            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple opacity-70 blur-md"></div>
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-ethr-black"
                />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white">{member.name}</h1>
                <p className="text-xl text-ethr-neonblue mt-2">{member.role}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="bio" className="w-full">
                <TabsList className="mb-8">
                  <TabsTrigger value="bio">Biography</TabsTrigger>
                  <TabsTrigger value="expertise">Expertise</TabsTrigger>
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                </TabsList>
                <TabsContent value="bio" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Biography</h2>
                    <div className="text-gray-300 space-y-4">
                      <p className="text-xl font-light italic border-l-4 border-ethr-neonblue pl-4 py-2">
                        "{member.quote}"
                      </p>
                      <p>{member.bio}</p>
                      {member.longBio.split("\n\n").map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Education</h2>
                    <div className="space-y-4">
                      {member.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-ethr-neonblue/50 pl-4 py-1">
                          <h3 className="text-white font-semibold">{edu.institution}</h3>
                          <p className="text-gray-300">{edu.degree}</p>
                          <p className="text-sm text-ethr-neonblue">{edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="expertise">
                  <h2 className="text-2xl font-bold text-white mb-6">Areas of Expertise</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {member.expertise.map((skill, index) => (
                      <Card key={index} className="bg-ethr-darkgray border-0">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-white mb-2">{skill}</h3>
                          <div className="w-full bg-ethr-black rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple h-2 rounded-full"
                              style={{ width: `${90 - index * 5}%` }}
                            ></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Speaking Topics</h2>
                    <div className="flex flex-wrap gap-3">
                      {[
                        "Music Industry Innovation",
                        "Technology & Creativity",
                        "Platform Development",
                        "Artist Empowerment",
                        "Future of Live Music",
                        "Music Tech Trends",
                      ].map((topic, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-ethr-darkgray text-gray-300 rounded-full text-sm hover:bg-ethr-neonblue/20 hover:text-white transition-colors duration-300"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="achievements">
                  <h2 className="text-2xl font-bold text-white mb-6">Key Achievements</h2>
                  <div className="space-y-6">
                    {member.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start">
                        <div className="h-10 w-10 rounded-full bg-ethr-neonblue/20 flex items-center justify-center mr-4 flex-shrink-0">
                          <span className="text-ethr-neonblue font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-white">{achievement}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12">
                    <h2 className="text-2xl font-bold text-white mb-6">Projects at ETHR</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          title: "Platform Launch",
                          description: "Led the initial platform development and launch",
                          year: "2019-2020",
                        },
                        {
                          title: "Mobile App Development",
                          description: "Spearheaded the development of ETHR's mobile applications",
                          year: "2020-2021",
                        },
                        {
                          title: "International Expansion",
                          description: "Guided ETHR's expansion into European markets",
                          year: "2021-2022",
                        },
                        {
                          title: "Enterprise Solutions",
                          description: "Developed ETHR's offerings for major venues and promoters",
                          year: "2022-Present",
                        },
                      ].map((project, index) => (
                        <Card key={index} className="bg-ethr-darkgray border-0">
                          <CardContent className="p-6">
                            <div className="text-sm text-ethr-neonblue mb-1">{project.year}</div>
                            <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                            <p className="text-gray-300">{project.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div>
              <Card className="bg-ethr-darkgray border-0 mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-ethr-neonblue mr-3" />
                      <a href={`mailto:${member.email}`} className="text-gray-300 hover:text-white">
                        {member.email}
                      </a>
                    </div>

                    <div className="flex space-x-3 mt-4">
                      {member.socialMedia.twitter && (
                        <a
                          href={member.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-full bg-ethr-black flex items-center justify-center hover:bg-ethr-neonblue/20 transition-colors duration-300"
                        >
                          <Twitter className="h-5 w-5 text-gray-300" />
                        </a>
                      )}
                      {member.socialMedia.linkedin && (
                        <a
                          href={member.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-full bg-ethr-black flex items-center justify-center hover:bg-ethr-neonblue/20 transition-colors duration-300"
                        >
                          <Linkedin className="h-5 w-5 text-gray-300" />
                        </a>
                      )}
                      {member.socialMedia.github && (
                        <a
                          href={member.socialMedia.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-10 w-10 rounded-full bg-ethr-black flex items-center justify-center hover:bg-ethr-neonblue/20 transition-colors duration-300"
                        >
                          <Github className="h-5 w-5 text-gray-300" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-ethr-darkgray border-0 mb-8">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Book for Speaking</h2>
                  <p className="text-gray-300 mb-4">
                    Interested in having {member.name.split(" ")[0]} speak at your event or conference?
                  </p>
                  <Button className="w-full bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
                    Request Speaking Info
                  </Button>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-xl font-bold text-white mb-4">Team Members</h2>
                <div className="space-y-4">
                  {Object.entries(teamMembers)
                    .filter(([id]) => id !== params.id)
                    .slice(0, 3)
                    .map(([id, teamMember]) => (
                      <Link href={`/team/${id}`} key={id}>
                        <div className="flex items-center p-3 rounded-lg bg-ethr-darkgray hover:bg-ethr-darkgray/70 transition-colors duration-300">
                          <img
                            src={teamMember.image || "/placeholder.svg"}
                            alt={teamMember.name}
                            className="w-12 h-12 rounded-full object-cover mr-4"
                          />
                          <div>
                            <h3 className="text-white font-medium">{teamMember.name}</h3>
                            <p className="text-sm text-ethr-neonblue">{teamMember.role}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
