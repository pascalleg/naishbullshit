"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Check, Clock, MapPin, MessageSquare, Music, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "@/components/main-nav"
import Image from "next/image"
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { ScrollReveal } from "@/components/scroll-reveal";

// Define Profile type
type Profile = Database['public']['Tables']['profiles']['Row'];

// Define Review type
type Review = {
  id: string;
  created_at: string;
  reviewer_id: string;
  professional_id: string;
  rating: number;
  comment: string;
  profiles: {
    name: string;
    avatar_url?: string;
  } | null;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error("Error fetching user:", userError.message);
          setError("Failed to load user session.");
          setLoading(false);
          return;
        }
        setUser(user);

        if (!user) {
          setLoading(false);
          setError("No authenticated user found.");
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
          setError("Failed to load profile.");
          setProfile(null);
        } else {
          setProfile(profileData);
          setError(null);
        }
      } catch (err) {
        console.error("Unexpected error fetching user and profile:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    void fetchUserAndProfile(); // Use void to ignore the floating promise
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (profile) {
        setLoadingReviews(true);
        try {
          const { data, error } = await supabase
            .from("reviews")
            .select(`
              id,
              created_at,
              reviewer_id,
              professional_id,
              rating,
              comment,
              profiles!reviewer_id (
                name,
                avatar_url
              )
            `)
            .eq("professional_id", profile.id)
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Error fetching reviews:", error.message);
            setReviews([]);
          } else {
            // Cast the data to unknown first, then to Review[]
            setReviews((data as unknown as Review[]) || []);
          }
        } catch (err) {
          console.error("Unexpected error fetching reviews:", err);
          setReviews([]);
        } finally {
          setLoadingReviews(false);
        }
      } else if (!loading) {
        setLoadingReviews(false);
      }
    };

    void fetchReviews(); // Use void to ignore the floating promise
  }, [profile, loading]);

  if (loading) {
    return (
      <main className="min-h-screen bg-ethr-black flex items-center justify-center">
        <div>Loading profile...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-ethr-black flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </main>
    );
  }

  if (!profile) {
     return (
      <main className="min-h-screen bg-ethr-black flex items-center justify-center">
        <div>Profile data not available.</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      <div className="pt-20">
        {/* Cover Image */}
        <div className="relative h-64 md:h-80">
          <div className="absolute inset-0 bg-gradient-to-r from-ethr-neonblue/20 to-ethr-neonpurple/20"></div>
          <Image src={profile.cover_image_url || "/placeholder.svg?height=400&width=1200"} alt="Cover" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ethr-black to-transparent"></div>
        </div>

        {/* Profile Info */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-ethr-black overflow-hidden">
              <Image
                src={profile.avatar_url || "/placeholder.svg?height=160&width=160"}
                alt={profile.name || "Profile"}
                width={160}
                height={160}
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{profile.name || "No Name Provided"}</h1>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <Music className="h-4 w-4 mr-1" /> {profile.account_type || "Account Type"}
                  </p>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{profile.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-ethr-neonblue" />
                      <span className="text-sm">4.9 (124 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-ethr-neonblue to-ethr-neonpurple hover:opacity-90">
                    Book Now
                  </Button>
                  <Button
                    variant="outline"
                    className="border-ethr-neonblue text-ethr-neonblue hover:bg-ethr-neonblue/10"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" /> Message
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-ethr-darkgray rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Gigs Completed</p>
              <p className="text-2xl font-bold mt-1">124</p>
            </div>
            <div className="bg-ethr-darkgray rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Years Experience</p>
              <p className="text-2xl font-bold mt-1">7</p>
            </div>
            <div className="bg-ethr-darkgray rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Response Rate</p>
              <p className="text-2xl font-bold mt-1">98%</p>
            </div>
            <div className="bg-ethr-darkgray rounded-lg p-4 text-center">
              <p className="text-muted-foreground text-sm">Response Time</p>
              <p className="text-2xl font-bold mt-1">&lt; 2 hrs</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="p-4">
              <h2 className="text-2xl font-bold mb-4">About Me</h2>
              <p className="text-muted-foreground">{profile.bio || "No bio provided."}</p>
            </TabsContent>
            <TabsContent value="reviews" className="p-4">
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              {loadingReviews ? (
                <div>Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div>No reviews yet.</div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Image
                          src={review.profiles?.avatar_url || "/placeholder.svg?height=40&width=40"}
                          alt={review.profiles?.name || "Reviewer"}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{review.profiles?.name || "Anonymous"}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-ethr-neonblue" : "text-muted-foreground"
                            }`}
                            fill="currentColor"
                          />
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {review.rating} out of 5 stars
                        </span>
                      </div>
                      <p className="mt-2 text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="calendar" className="p-4">
              <h2 className="text-2xl font-bold mb-4">Availability</h2>
              {/* Add your calendar component here */}
              <div className="text-muted-foreground">Calendar coming soon.</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
}
