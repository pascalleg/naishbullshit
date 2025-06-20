import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollReveal } from '@/components/scroll-reveal'
import { toast } from 'sonner'
import { ProfessionalService } from '@/lib/services/professional-service'
import { PortfolioShowcase } from '@/components/professionals/portfolio-showcase'
import { AvailabilityCalendar } from '@/components/professionals/availability-calendar'
import { EquipmentList } from '@/components/professionals/equipment-list'
import { PerformanceHistory } from '@/components/professionals/performance-history'
import { Music, Calendar, Wrench, History } from 'lucide-react' // Changed Tool to Wrench

interface ProfessionalProfileProps {
  userId: string
}

export function ProfessionalProfile({ userId }: ProfessionalProfileProps) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    stage_name: '',
    bio: '',
    genres: [] as string[],
    experience_years: 0,
    hourly_rate: 0,
    is_available: true,
  })

  useEffect(() => {
    loadProfile()
  }, [userId])

  const loadProfile = async () => {
    try {
      const professionalService = ProfessionalService.getInstance()
      const data = await professionalService.getProfessionalProfile(userId)
      setProfile(data)
      setFormData({
        stage_name: data.stage_name,
        bio: data.bio,
        genres: data.genres,
        experience_years: data.experience_years,
        hourly_rate: data.hourly_rate,
        is_available: data.is_available,
      })
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const professionalService = ProfessionalService.getInstance()
      await professionalService.updateProfessionalProfile({
        id: profile.id,
        ...formData,
      })
      setEditing(false)
      toast.success('Profile updated successfully')
      loadProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="space-y-6">
      <Card className="bg-ethr-darkgray/50 border-muted">
        <CardHeader>
          <CardTitle>Professional Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stage Name</label>
                <Input
                  value={formData.stage_name}
                  onChange={e => setFormData({ ...formData, stage_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Experience (Years)</label>
                <Input
                  type="number"
                  value={formData.experience_years}
                  onChange={e => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
                <Input
                  type="number"
                  value={formData.hourly_rate}
                  onChange={e => setFormData({ ...formData, hourly_rate: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{profile.stage_name}</h3>
                <p className="text-muted-foreground mt-1">{profile.bio}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Experience</span>
                  <p>{profile.experience_years} years</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Hourly Rate</span>
                  <p>${profile.hourly_rate}/hour</p>
                </div>
              </div>
              <Button onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">
            <Music className="w-4 h-4 mr-2" />
            Portfolio
          </TabsTrigger>
          <TabsTrigger value="availability">
            <Calendar className="w-4 h-4 mr-2" />
            Availability
          </TabsTrigger>
          <TabsTrigger value="equipment">
            <Wrench className="w-4 h-4 mr-2" /> {/* Changed Tool to Wrench */}
            Equipment
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio">
          <ScrollReveal animation="fade">
            <PortfolioShowcase professionalId={profile.id} />
          </ScrollReveal>
        </TabsContent>

        <TabsContent value="availability">
          <ScrollReveal animation="fade">
            <AvailabilityCalendar professionalId={profile.id} />
          </ScrollReveal>
        </TabsContent>

        <TabsContent value="equipment">
          <ScrollReveal animation="fade">
            <EquipmentList professionalId={profile.id} />
          </ScrollReveal>
        </TabsContent>

        <TabsContent value="history">
          <ScrollReveal animation="fade">
            <PerformanceHistory professionalId={profile.id} />
          </ScrollReveal>
        </TabsContent>
      </Tabs>
    </div>
  )
}