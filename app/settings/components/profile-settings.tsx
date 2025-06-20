"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Check, Loader2, Pencil, Upload, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ImageCropperModal } from "./image-cropper-modal"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { Database } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

// Define Profile type (should match the one in lib/supabase.ts)
type Profile = Database['public']['Tables']['profiles']['Row'];

export function ProfileSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=150&width=150")
  const [genres, setGenres] = useState(["House", "Techno", "Electronic"])
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Added states for fetching profile
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Added state for form data, initialized from profile once fetched
  const [formData, setFormData] = useState({
    name: '', // Combined first and last name
    location: '',
    bio: '',
    website: '',
    // Add states for other editable fields like genres, social media, etc.
  });

  useEffect(() => {
    async function fetchUserAndProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        setLoadingProfile(false);
        setError("No authenticated user found."); // Consider redirecting if no user
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setError("Failed to load profile settings.");
        setProfile(null);
      } else {
        setProfile(profileData);
        // Initialize form data with fetched profile data
        setFormData({
          name: profileData.name || '',
          location: profileData.location || '',
          bio: profileData.bio || '',
          website: profileData.website || '',
          // Initialize other fields
        });
        setProfileImage(profileData.avatar_url || "/placeholder.svg?height=150&width=150"); // Set initial image
        // Assuming genres are stored as text array or similar. You might need to parse this.
        // setGenres(profileData.genres || []); // Example: if genres are stored
        setError(null);
      }
      setLoadingProfile(false);
    }

    fetchUserAndProfile();
  }, []); // Fetch profile on component mount

  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    if (!user || !profile) {
        setError("User or profile data not available.");
        setIsLoading(false);
        return;
    }

    // Gather data from form fields (using formData state)
    const updates = {
      name: formData.name,
      location: formData.location,
      bio: formData.bio,
      website: formData.website,
      // Add other editable fields from formData
      updated_at: new Date().toISOString(), // Add updated_at timestamp
    };

    try {
      const { data, error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id) // Update only the current user's profile
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(data as Profile); // Update local state with saved data
      setSuccess("Profile updated successfully");
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddGenre = (genre: string) => {
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre])
    }
  }

  const handleRemoveGenre = (genre: string) => {
    setGenres(genres.filter((g) => g !== genre))
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB")
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = () => {
      setTempImageUrl(reader.result as string)
      setIsCropperOpen(true)
    }
    reader.readAsDataURL(file)

    // Reset the input so the same file can be selected again
    e.target.value = ""
  }

  const handleCropComplete = (croppedImageUrl: string) => {
    setProfileImage(croppedImageUrl)
    setTempImageUrl(null)
    setSuccess("Profile image updated successfully")
  }

  if (loadingProfile) {
    return <div>Loading profile settings...</div>; // Loading state while fetching profile
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; // Error display
  }

  if (!profile) {
    return <div>Profile data not available. Cannot edit settings.</div>; // No profile data
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
        <p className="text-muted-foreground mb-6">
          Update your profile information to help others find and connect with you on ETHR.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-500 bg-green-500/10">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <div className="relative w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden">
                <Image src={profileImage || "/placeholder.svg"} alt="Profile" fill className="object-cover" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Pencil className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                aria-label="Upload profile picture"
              />
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-0 rounded-full bg-ethr-darkgray border-ethr-neonblue hover:bg-ethr-neonblue/20"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              >
                <Upload className="h-4 w-4" />
                <span className="sr-only">Upload profile picture</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Recommended: Square JPG or PNG, at least 500x500px</p>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} className="bg-ethr-black border-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" defaultValue={profile?.name?.split(' ').slice(1).join(' ') || ''} className="bg-ethr-black border-muted" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name / Artist Name</Label>
              <Input id="name" value={formData.name} onChange={handleInputChange} className="bg-ethr-black border-muted" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={formData.location} onChange={handleInputChange} className="bg-ethr-black border-muted" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            rows={5}
            value={formData.bio}
            onChange={handleInputChange}
            className="bg-ethr-black border-muted resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Brief description of yourself or your act. This will appear on your profile.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Music Genres</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {genres.map((genre) => (
              <Badge key={genre} className="bg-ethr-neonblue/20 text-ethr-neonblue hover:bg-ethr-neonblue/30 gap-1">
                {genre}
                <button onClick={() => handleRemoveGenre(genre)} className="ml-1 hover:text-white">
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {genre}</span>
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Select onValueChange={handleAddGenre}>
              <SelectTrigger className="bg-ethr-black border-muted w-full">
                <SelectValue placeholder="Add genre" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "House",
                  "Techno",
                  "EDM",
                  "Hip Hop",
                  "R&B",
                  "Pop",
                  "Rock",
                  "Latin",
                  "Reggaeton",
                  "Disco",
                  "Funk",
                  "Soul",
                ]
                  .filter((genre) => !genres.includes(genre))
                  .map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yourwebsite.com"
            value={formData.website}
            onChange={handleInputChange}
            className="bg-ethr-black border-muted"
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-ethr-black text-muted-foreground">
                  @
                </span>
                <Input
                  id="instagram"
                  placeholder="username"
                  defaultValue="djsynapse"
                  className="bg-ethr-black border-muted rounded-l-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-ethr-black text-muted-foreground">
                  @
                </span>
                <Input
                  id="twitter"
                  placeholder="username"
                  defaultValue="djsynapse"
                  className="bg-ethr-black border-muted rounded-l-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="soundcloud">SoundCloud</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-ethr-black text-muted-foreground">
                  soundcloud.com/
                </span>
                <Input
                  id="soundcloud"
                  placeholder="username"
                  defaultValue="djsynapse"
                  className="bg-ethr-black border-muted rounded-l-none"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="spotify">Spotify</Label>
              <Input
                id="spotify"
                placeholder="Spotify artist link"
                defaultValue="https://open.spotify.com/artist/djsynapse"
                className="bg-ethr-black border-muted"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        onSave={handleCropComplete}
        imageUrl={tempImageUrl}
      />
    </div>
  )
}
