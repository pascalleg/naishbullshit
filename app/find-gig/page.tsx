"use client";

import { MainNav } from "@/components/main-nav";
import { FilterSidebar } from "@/components/filter-sidebar";
import { Pagination } from "@/components/pagination";
import { GigCard } from "./components/gig-card";
import { GigFilters } from "./components/gig-filters";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GigService } from "@/lib/database/gigs";
import { useState, useEffect } from "react";

export default function FindGigPage() {
  const [gigs, setGigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      try {
        const filters: any = { status: "open" };

        // Add type filter based on active tab
        if (activeTab !== "all") {
          // Map tab values to account types
          const typeMap: Record<string, string> = {
            venues: "venue",
            artists: "artist",
            production: "production",
          };

          if (typeMap[activeTab]) {
            // We'll need to filter by poster account type in the query
            filters.posterAccountType = typeMap[activeTab];
          }
        }

        const { gigs, totalPages, error } = await GigService.getGigs(
          currentPage,
          12,
          filters
        );
        if (error) throw error;

        setGigs(gigs);
        setTotalPages(totalPages);
      } catch (err: any) {
        setError(err.message || "Failed to load gigs");
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, [currentPage, activeTab]);

  // Filter gigs by search query on frontend
  const filteredGigs = gigs.filter(
    (gig) =>
      searchQuery === "" ||
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-ethr-black via-ethr-darkgray/90 to-ethr-black">
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect">
        <MainNav />
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6">
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
          <ScrollReveal animation="fade">
            <h1 className="text-4xl md:text-5xl font-light text-white mb-6">
              FIND YOUR <span className="text-ethr-neonblue">PERFECT GIG</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mb-10">
              Browse opportunities from venues, artists, and production
              professionals across the industry.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="fade" delay={200}>
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <Input
                  placeholder="SEARCH GIGS BY KEYWORD, LOCATION, OR TYPE..."
                  className="pl-12 h-14 bg-white/5 backdrop-blur-sm border-white/10 focus:border-white/20 w-full rounded-full text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                className="h-14 rounded-full border-white/20 text-white hover:bg-white/5 backdrop-blur-sm md:w-auto w-full"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                FILTERS
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters - Hidden on mobile */}
            <div className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-32">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <GigFilters />
                </div>
              </div>
            </div>

            {/* Gig Listings */}
            <div className="flex-1">
              <ScrollReveal animation="fade" delay={300}>
                <Tabs
                  defaultValue="all"
                  className="mb-8"
                  onValueChange={setActiveTab}
                >
                  <TabsList className="bg-white/5 border border-white/10 p-1">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-ethr-neonblue data-[state=active]:text-white"
                    >
                      ALL GIGS
                    </TabsTrigger>
                    <TabsTrigger
                      value="venues"
                      className="data-[state=active]:bg-ethr-neonblue data-[state=active]:text-white"
                    >
                      VENUES
                    </TabsTrigger>
                    <TabsTrigger
                      value="artists"
                      className="data-[state=active]:bg-ethr-neonblue data-[state=active]:text-white"
                    >
                      ARTISTS
                    </TabsTrigger>
                    <TabsTrigger
                      value="production"
                      className="data-[state=active]:bg-ethr-neonblue data-[state=active]:text-white"
                    >
                      PRODUCTION
                    </TabsTrigger>
                  </TabsList>

                  {loading ? (
                    <div className="flex items-center justify-center h-64 mt-6">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2 text-white">Loading gigs...</span>
                    </div>
                  ) : (
                    <>
                      <TabsContent value="all" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                          {filteredGigs.map((gig) => (
                            <GigCard key={gig.id} gig={gig} />
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="venues" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                          {filteredGigs
                            .filter(
                              (gig) => gig.profiles?.account_type === "venue"
                            )
                            .map((gig) => (
                              <GigCard key={gig.id} gig={gig} />
                            ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="artists" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                          {filteredGigs
                            .filter(
                              (gig) => gig.profiles?.account_type === "artist"
                            )
                            .map((gig) => (
                              <GigCard key={gig.id} gig={gig} />
                            ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="production" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                          {filteredGigs
                            .filter(
                              (gig) =>
                                gig.profiles?.account_type === "production"
                            )
                            .map((gig) => (
                              <GigCard key={gig.id} gig={gig} />
                            ))}
                        </div>
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              </ScrollReveal>

              {/* Pagination */}
              <ScrollReveal animation="fade" delay={400}>
                <div className="mt-12">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
