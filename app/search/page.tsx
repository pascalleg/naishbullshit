import { supabase } from "@/lib/supabase"
import type { Venue, VenueType, VenueStatus } from "@/lib/database/types/venue"
import { Suspense } from 'react'
import { SearchResults } from '@/components/search/search-results'
import { SearchMap } from '@/components/search/search-map'
import { Skeleton } from '@/components/loading-skeleton'
import { SearchFilters } from '@/components/search/search-filters'

export interface SearchFilters {
  query?: string
  type?: VenueType
  status?: VenueStatus
  location?: {
    lat: number
    lng: number
    radius?: number // in kilometers
  }
  categories?: string[]
  priceRange?: {
    min: number
    max: number
  }
  capacity?: {
    min: number
    max: number
  }
  availability?: {
    startDate: string
    endDate: string
  }
  amenities?: string[]
  minRating?: number; // Added for filtering by rating
  sortBy?: "price" | "rating" | "distance" | "capacity"
  sortOrder?: "asc" | "desc"
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}

export class SearchService {
  private static instance: SearchService

  private constructor() {}

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService()
    }
    return SearchService.instance
  }

  async searchVenues(
    filters: SearchFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<SearchResult<Venue>> {
    let baseQuery = supabase.from("venues").select("*", { count: "exact" });

    // Handle location and availability filters first using RPC
    if (filters.location) {
      const { data: rpcData, error: rpcError } = await supabase.rpc("venues_within_radius", {
        lat: filters.location.lat,
        lng: filters.location.lng,
        radius: filters.location.radius || 50
      }).select("id"); // Select only IDs to filter the main query
      if (rpcError) throw rpcError;
      const venueIds = (rpcData || []).map(v => v.id);
      baseQuery = baseQuery.in('id', venueIds);
    } 
    
    if (filters.availability) {
      const { data: rpcData, error: rpcError } = await supabase.rpc("venues_available_between", {
        start_date: filters.availability.startDate,
        end_date: filters.availability.endDate
      }).select("id"); // Select only IDs to filter the main query
      if (rpcError) throw rpcError;
      const venueIds = (rpcData || []).map(v => v.id);
      baseQuery = baseQuery.in('id', venueIds);
    }
    
    // Apply common filters
    baseQuery = baseQuery.eq("status", "active");

    if (filters.query) {
      baseQuery = baseQuery.or(
        `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
      );
    }

    if (filters.type) {
      baseQuery = baseQuery.eq("type", filters.type);
    }

    if (filters.categories?.length) {
      baseQuery = baseQuery.contains("categories", filters.categories);
    }

    if (filters.priceRange) {
      baseQuery = baseQuery
        .gte("base_price", filters.priceRange.min)
        .lte("base_price", filters.priceRange.max);
    }

    if (filters.capacity) {
      baseQuery = baseQuery
        .gte("capacity", filters.capacity.min)
        .lte("capacity", filters.capacity.max);
    }

    if (filters.amenities?.length) {
      baseQuery = baseQuery.contains("amenities", filters.amenities);
    }

    if (filters.minRating && filters.minRating > 0) {
      baseQuery = baseQuery.gte("average_rating", filters.minRating);
    }

    if (filters.sortBy) {
      const sortColumn = this.getSortColumn(filters.sortBy);
      baseQuery = baseQuery.order(sortColumn, {
        ascending: filters.sortOrder === "asc"
      });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    baseQuery = baseQuery.range(start, end);

    const { data, error, count } = await baseQuery;

    if (error) throw error;

    return {
      items: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  }

  private getSortColumn(sortBy: string): string {
    switch (sortBy) {
      case "price":
        return "base_price";
      case "rating":
        return "average_rating";
      case "capacity":
        return "capacity";
      case "distance":
        return "distance"; 
      default:
        return "created_at";
    }
  }

  async getPopularVenues(limit: number = 5): Promise<Venue[]> {
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("status", "active")
      .order("average_rating", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getVenuesByCategory(
    category: string,
    limit: number = 10
  ): Promise<Venue[]> {
    const { data, error } = await supabase
      .from("venues")
      .select("*")
      .eq("status", "active")
      .contains("categories", [category])
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async getNearbyVenues(
    lat: number,
    lng: number,
    radius: number = 50,
    limit: number = 10
  ): Promise<Venue[]> {
    const { data, error } = await supabase
      .rpc("venues_within_radius", {
        lat,
        lng,
        radius
      })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  async searchProfessionals(
    filters: SearchFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<SearchResult<any>> {
    let baseQuery = supabase.from("profiles").select("*", { count: "exact" });

    // Handle location filter first using RPC
    if (filters.location) {
      const { data: rpcData, error: rpcError } = await supabase.rpc("professionals_within_radius", {
        lat: filters.location.lat,
        lng: filters.location.lng,
        radius: filters.location.radius || 50
      }).select("id"); // Select only IDs to filter the main query
      if (rpcError) throw rpcError;
      const profileIds = (rpcData || []).map(p => p.id);
      baseQuery = baseQuery.in('id', profileIds);
    }

    // Apply common filters
    baseQuery = baseQuery.eq("account_type", "professional");

    if (filters.query) {
      baseQuery = baseQuery.or(
        `username.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`
      );
    }

    if (filters.categories?.length) {
      baseQuery = baseQuery.contains("skills", filters.categories);
    }

    if (filters.sortBy) {
      const sortColumn = this.getSortColumn(filters.sortBy);
      baseQuery = baseQuery.order(sortColumn, {
        ascending: filters.sortOrder === "asc"
      });
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    baseQuery = baseQuery.range(start, end);

    const { data, error, count } = await baseQuery;

    if (error) throw error;

    const items = (data || []).map((prof: any) => ({
      id: prof.id,
      type: "professional",
      name: prof.username,
      description: prof.bio,
      location: prof.location,
      categories: prof.skills,
      price: prof.hourly_rate,
      rating: prof.average_rating || 0,
      images: [prof.avatar_url],
      features: [],
      distance: prof.distance,
      relevance_score: 1,
    }));

    return {
      items,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
  }

  async getRecommendations(
    userId: string,
    type: "venue" | "professional",
    limit: number = 5
  ): Promise<SearchResult<any>> {
    if (type === "venue") {
      const { data, error, count } = await supabase
        .from("venues")
        .select("*", { count: "exact" })
        .order("average_rating", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return {
        items: data || [],
        total: count || 0,
        page: 1,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } else {
      const { data, error, count } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("account_type", "professional")
        .order("average_rating", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return {
        items: data || [],
        total: count || 0,
        page: 1,
        totalPages: Math.ceil((count || 0) / limit)
      };
    }
  }
}

interface SearchPageProps {
  searchParams: {
    q?: string
    type?: 'venue' | 'professional'
    lat?: string
    lng?: string
    radius?: string
    category?: string
    price_min?: string
    price_max?: string
    capacity_min?: string
    capacity_max?: string
    rating?: string
    sort_by?: string
    sort_order?: string
    amenities?: string
    page?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const filters = {
    query: searchParams.q,
    type: searchParams.type,
    location: searchParams.lat && searchParams.lng
      ? {
          lat: parseFloat(searchParams.lat),
          lng: parseFloat(searchParams.lng),
          radius: searchParams.radius ? parseFloat(searchParams.radius) : undefined
        }
      : undefined,
    categories: searchParams.category ? [searchParams.category] : undefined,
    priceRange: searchParams.price_min && searchParams.price_max
      ? {
          min: parseFloat(searchParams.price_min),
          max: parseFloat(searchParams.price_max)
        }
      : undefined,
    capacity: searchParams.capacity_min && searchParams.capacity_max
      ? {
          min: parseInt(searchParams.capacity_min),
          max: parseInt(searchParams.capacity_max)
        }
      : undefined,
    minRating: searchParams.rating ? parseFloat(searchParams.rating) : undefined,
    sortBy: searchParams.sort_by,
    sortOrder: searchParams.sort_order,
    amenities: searchParams.amenities?.split(',') || undefined,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters />
        </div>

        {/* Map and Results */}
        <div className="lg:col-span-2 space-y-8">
          {/* Map View */}
          <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
            <Suspense fallback={<Skeleton className="h-full" />}>
              <SearchMap
                initialLocation={
                  searchParams.lat && searchParams.lng
                    ? {
                        lat: parseFloat(searchParams.lat),
                        lng: parseFloat(searchParams.lng)
                      }
                    : undefined
                }
                radius={searchParams.radius ? parseFloat(searchParams.radius) : undefined}
                type={searchParams.type || 'venue'}
              />
            </Suspense>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            <Suspense fallback={<Skeleton className="h-96" />}>
              <SearchResults
                query={filters.query}
                type={filters.type || 'venue'}
                filters={filters}
                page={searchParams.page ? parseInt(searchParams.page) : 1}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}