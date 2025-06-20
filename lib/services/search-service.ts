import { createServerClient } from '@/lib/supabase'
import { apiLogger } from '@/lib/api-logger'
import { supabase } from "@/lib/supabase"
import type { Venue, VenueType, VenueStatus } from "@/lib/database/types/venue"

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
  sortBy?: "price" | "rating" | "distance" | "capacity"
  sortOrder?: "asc" | "desc"
  minRating?: number
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
}

export class SearchService {
  private static instance: SearchService
  private supabase = createServerClient()

  private constructor() {}

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService()
    }
    return SearchService.instance
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
        return "distance"; // This assumes you have a distance column from the location search
      default:
        return "created_at";
    }
  }

  async searchVenues(
    filters: SearchFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<SearchResult<Venue>> {
    let data: Venue[] = [];
    let count: number = 0;

    if (filters.location) {
      const { data: rpcData, error } = await supabase.rpc("venues_within_radius", {
        lat: filters.location.lat,
        lng: filters.location.lng,
        radius: filters.location.radius || 50
      });
      if (error) throw error;
      data = rpcData || [];

      // Client-side filtering after RPC
      data = data.filter(venue => venue.status === 'active');
      if (filters.query) {
        data = data.filter(venue => 
          venue.name?.toLowerCase().includes(filters.query!.toLowerCase()) ||
          venue.description?.toLowerCase().includes(filters.query!.toLowerCase())
        );
      }
      if (filters.type) {
        data = data.filter(venue => venue.type === filters.type);
      }
      if (filters.categories?.length) {
        data = data.filter(venue => 
          filters.categories!.every(cat => venue.categories?.includes(cat))
        );
      }
      if (filters.priceRange) {
        data = data.filter(venue =>
          venue.base_price >= filters.priceRange!.min &&
          venue.base_price <= filters.priceRange!.max
        );
      }
      if (filters.capacity) {
        data = data.filter(venue =>
          venue.capacity >= filters.capacity!.min &&
          venue.capacity <= filters.capacity!.max
        );
      }
      if (filters.amenities?.length) {
        data = data.filter(venue =>
          filters.amenities!.every(amenity => venue.amenities?.includes(amenity))
        );
      }
      if (filters.minRating && filters.minRating > 0) {
        data = data.filter(venue => venue.average_rating >= filters.minRating!);
      }
      
      count = data.length;
      
      // Client-side sorting after RPC
      if (filters.sortBy) {
        const sortColumn = this.getSortColumn(filters.sortBy);
        data.sort((a: any, b: any) => {
          const valA = a[sortColumn];
          const valB = b[sortColumn];
          if (filters.sortOrder === "asc") {
            return valA < valB ? -1 : valA > valB ? 1 : 0;
          } else {
            return valA > valB ? -1 : valA < valB ? 1 : 0;
          }
        });
      }

      // Client-side pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      data = data.slice(start, end);

    } else if (filters.availability) {
        const { data: rpcData, error } = await supabase.rpc("venues_available_between", {
            start_date: filters.availability.startDate,
            end_date: filters.availability.endDate
        });
        if (error) throw error;
        data = rpcData || [];

        // Client-side filtering (similar to location block)
        data = data.filter(venue => venue.status === 'active');
        if (filters.query) {
            data = data.filter(venue => 
              venue.name?.toLowerCase().includes(filters.query!.toLowerCase()) ||
              venue.description?.toLowerCase().includes(filters.query!.toLowerCase())
            );
        }
        if (filters.type) {
            data = data.filter(venue => venue.type === filters.type);
        }
        if (filters.categories?.length) {
            data = data.filter(venue => 
              filters.categories!.every(cat => venue.categories?.includes(cat))
            );
        }
        if (filters.priceRange) {
            data = data.filter(venue =>
              venue.base_price >= filters.priceRange!.min &&
              venue.base_price <= filters.priceRange!.max
            );
        }
        if (filters.capacity) {
            data = data.filter(venue =>
              venue.capacity >= filters.capacity!.min &&
              venue.capacity <= filters.capacity!.max
            );
        }
        if (filters.amenities?.length) {
            data = data.filter(venue =>
              filters.amenities!.every(amenity => venue.amenities?.includes(amenity))
            );
        }
        if (filters.minRating && filters.minRating > 0) {
          data = data.filter(venue => venue.average_rating >= filters.minRating!);
        }
        
        count = data.length;

        // Client-side sorting
        if (filters.sortBy) {
            const sortColumn = this.getSortColumn(filters.sortBy);
            data.sort((a: any, b: any) => {
                const valA = a[sortColumn];
                const valB = b[sortColumn];
                if (filters.sortOrder === "asc") {
                    return valA < valB ? -1 : valA > valB ? 1 : 0;
                } else {
                    return valA > valB ? -1 : valA < valB ? 1 : 0;
                }
            });
        }

        // Client-side pagination
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        data = data.slice(start, end);

    } else {
      // Standard Supabase query for venues
      let query = supabase
        .from("venues")
        .select("*", { count: "exact" })
        .eq("status", "active");

      if (filters.query) {
        query = query.or(
          `name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
        );
      }

      if (filters.type) {
        query = query.eq("type", filters.type);
      }

      if (filters.categories?.length) {
        query = query.contains("categories", filters.categories);
      }

      if (filters.priceRange) {
        query = query
          .gte("base_price", filters.priceRange.min)
          .lte("base_price", filters.priceRange.max);
      }

      if (filters.capacity) {
        query = query
          .gte("capacity", filters.capacity.min)
          .lte("capacity", filters.capacity.max);
      }

      if (filters.amenities?.length) {
        query = query.contains("amenities", filters.amenities);
      }

      if (filters.minRating && filters.minRating > 0) {
        query = query.gte('average_rating', filters.minRating);
      }

      if (filters.sortBy) {
        const sortColumn = this.getSortColumn(filters.sortBy);
        query = query.order(sortColumn, {
          ascending: filters.sortOrder === "asc"
        });
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);

      const { data: fetchedData, error, count: fetchedCount } = await query;

      if (error) throw error;
      data = fetchedData || [];
      count = fetchedCount || 0;
    }

    return {
      items: data,
      total: count,
      page,
      totalPages: Math.ceil(count / pageSize)
    };
  }

  async searchProfessionals(
    filters: SearchFilters,
    page: number = 1,
    pageSize: number = 10
  ): Promise<SearchResult<any>> {
    let data: any[] = [];
    let count: number = 0;

    if (filters.location) {
      const { data: rpcData, error } = await supabase.rpc("professionals_within_radius", {
        lat: filters.location.lat,
        lng: filters.location.lng,
        radius: filters.location.radius || 50
      });
      if (error) throw error;
      data = rpcData || [];

      // Client-side filtering for professionals after RPC
      data = data.filter((prof: any) => prof.account_type === 'professional');
      if (filters.query) {
        data = data.filter((prof: any) => 
          prof.username?.toLowerCase().includes(filters.query!.toLowerCase()) ||
          prof.bio?.toLowerCase().includes(filters.query!.toLowerCase())
        );
      }
      if (filters.categories?.length) {
        data = data.filter((prof: any) =>
          filters.categories!.every(cat => prof.skills?.includes(cat))
        );
      }
      if (filters.minRating && filters.minRating > 0) {
        data = data.filter((prof: any) => prof.average_rating >= filters.minRating!);
      }

      count = data.length;

      // Client-side sorting
      if (filters.sortBy) {
        const sortColumn = this.getSortColumn(filters.sortBy);
        data.sort((a: any, b: any) => {
          const valA = a[sortColumn];
          const valB = b[sortColumn];
          if (filters.sortOrder === "asc") {
            return valA < valB ? -1 : valA > valB ? 1 : 0;
          } else {
            return valA > valB ? -1 : valA < valB ? 1 : 0;
          }
        });
      }

      // Client-side pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      data = data.slice(start, end);

    } else {
      // Standard Supabase query for professionals
      let query = supabase
        .from("profiles") // Assuming 'profiles' table for professionals
        .select("*", { count: "exact" })
        .eq("account_type", "professional");

      if (filters.query) {
        query = query.or(
          `username.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`
        );
      }

      if (filters.categories?.length) {
        query = query.contains("skills", filters.categories);
      }

      if (filters.sortBy) {
        const sortColumn = this.getSortColumn(filters.sortBy);
        query = query.order(sortColumn, {
          ascending: filters.sortOrder === "asc"
        });
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      query = query.range(start, end);

      const { data: fetchedData, error, count: fetchedCount } = await query;

      if (error) throw error;
      data = fetchedData || [];
      count = fetchedCount || 0;
    }

    return {
      items: data || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / pageSize)
    };
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

  async getRecommendations(
    userId: string,
    type: "venue" | "professional",
    limit: number = 5
  ): Promise<SearchResult<any>> {
    if (type === "venue") {
      const { data, error, count } = await supabase
        .from("venues")
        .select("*", { count: "exact" })
        .eq("status", "active")
        .order("average_rating", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { items: data || [], total: count || 0, page: 1, totalPages: Math.ceil((count || 0) / limit) };
    } else {
      const { data, error, count } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .eq("account_type", "professional")
        .order("average_rating", { ascending: false }) // Assuming professionals also have average_rating
        .limit(limit);

      if (error) throw error;
      return { items: data || [], total: count || 0, page: 1, totalPages: Math.ceil((count || 0) / limit) };
    }
  }
}
