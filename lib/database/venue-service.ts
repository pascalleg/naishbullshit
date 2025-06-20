import { supabase } from "@/lib/supabase";
import type {
    Venue,
    VenueWithDetails,
    CreateVenueRequest,
    UpdateVenueRequest,
    VenueAvailability,
    CreateAvailabilityRequest,
    VenueFeature,
    CreateFeatureRequest,
    VenueReview,
    CreateReviewRequest,
    VenueType,
    VenueStatus,
} from "./types/venue";

export class VenueService {
    static async createVenue(venue: Omit<Venue, "id" | "created_at" | "updated_at">) {
        const { data, error } = await supabase
            .from("venues")
            .insert([venue])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async getVenue(venueId: string): Promise<VenueWithDetails> {
        const { data: venue, error: venueError } = await supabase
            .from("venues")
            .select("*")
            .eq("id", venueId)
            .single();

        if (venueError) throw venueError;

        const { data: features, error: featuresError } = await supabase
            .from("venue_features")
            .select("*")
            .eq("venue_id", venueId);

        if (featuresError) throw featuresError;

        const { data: reviews, error: reviewsError } = await supabase
            .from("venue_reviews")
            .select("*")
            .eq("venue_id", venueId);

        if (reviewsError) throw reviewsError;

        const averageRating = reviews.length > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
            : 0;

        return {
            ...venue,
            features,
            reviews,
            average_rating: averageRating,
            review_count: reviews.length,
        };
    }

    static async updateVenue(id: string, venue: Partial<Venue>) {
        const { data, error } = await supabase
            .from("venues")
            .update(venue)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async deleteVenue(venueId: string): Promise<void> {
        const { error } = await supabase
            .from("venues")
            .update({ status: "deleted" })
            .eq("id", venueId);

        if (error) throw error;
    }

    static async listVenues(params: {
        type?: string;
        city?: string;
        state?: string;
        country?: string;
        minCapacity?: number;
        maxPrice?: number;
        page?: number;
        limit?: number;
    }): Promise<{ venues: Venue[]; total: number }> {
        let query = supabase
            .from("venues")
            .select("*", { count: "exact" })
            .eq("status", "active");

        if (params.type) {
            query = query.eq("type", params.type);
        }
        if (params.city) {
            query = query.eq("city", params.city);
        }
        if (params.state) {
            query = query.eq("state", params.state);
        }
        if (params.country) {
            query = query.eq("country", params.country);
        }
        if (params.minCapacity) {
            query = query.gte("capacity", params.minCapacity);
        }
        if (params.maxPrice) {
            query = query.lte("base_price", params.maxPrice);
        }

        const page = params.page || 1;
        const limit = params.limit || 10;
        const start = (page - 1) * limit;
        const end = start + limit - 1;

        query = query.range(start, end);

        const { data, error, count } = await query;

        if (error) throw error;
        return { venues: data, total: count || 0 };
    }

    static async setAvailability(
        venueId: string,
        request: CreateAvailabilityRequest
    ): Promise<VenueAvailability> {
        const { data, error } = await supabase
            .from("venue_availability")
            .insert([{ ...request, venue_id: venueId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async getAvailability(
        venueId: string,
        startDate: string,
        endDate: string
    ): Promise<VenueAvailability[]> {
        const { data, error } = await supabase
            .from("venue_availability")
            .select("*")
            .eq("venue_id", venueId)
            .gte("date", startDate)
            .lte("date", endDate);

        if (error) throw error;
        return data;
    }

    static async addFeature(
        venueId: string,
        request: CreateFeatureRequest
    ): Promise<VenueFeature> {
        const { data, error } = await supabase
            .from("venue_features")
            .insert([{ ...request, venue_id: venueId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async updateFeature(
        featureId: string,
        request: Partial<CreateFeatureRequest>
    ): Promise<VenueFeature> {
        const { data, error } = await supabase
            .from("venue_features")
            .update(request)
            .eq("id", featureId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async deleteFeature(featureId: string): Promise<void> {
        const { error } = await supabase
            .from("venue_features")
            .delete()
            .eq("id", featureId);

        if (error) throw error;
    }

    static async addReview(
        venueId: string,
        userId: string,
        request: CreateReviewRequest
    ): Promise<VenueReview> {
        const { data, error } = await supabase
            .from("venue_reviews")
            .insert([{ ...request, venue_id: venueId, user_id: userId }])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async updateReview(
        reviewId: string,
        request: Partial<CreateReviewRequest>
    ): Promise<VenueReview> {
        const { data, error } = await supabase
            .from("venue_reviews")
            .update(request)
            .eq("id", reviewId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async deleteReview(reviewId: string): Promise<void> {
        const { error } = await supabase
            .from("venue_reviews")
            .delete()
            .eq("id", reviewId);

        if (error) throw error;
    }

    static async checkAvailability(
        venueId: string,
        date: string,
        startTime: string,
        endTime: string
    ): Promise<boolean> {
        const { data, error } = await supabase
            .from("venue_availability")
            .select("*")
            .eq("venue_id", venueId)
            .eq("date", date)
            .eq("status", "available")
            .lte("start_time", startTime)
            .gte("end_time", endTime);

        if (error) throw error;
        return data.length > 0;
    }

    static async getUserVenues(userId: string): Promise<Venue[]> {
        const { data, error } = await supabase
            .from("venues")
            .select("*")
            .eq("owner_id", userId)
            .neq("status", "deleted");

        if (error) throw error;
        return data;
    }

    static async getVenueById(id: string) {
        const { data, error } = await supabase
            .from("venues")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    }

    static async updateVenueAvailability(
        venueId: string,
        availability: {
            dates: string[]
            timeSlots: { start: string; end: string }[]
        }
    ) {
        const { data, error } = await supabase
            .from("venue_availability")
            .upsert({
                venue_id: venueId,
                available_dates: availability.dates,
                time_slots: availability.timeSlots,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async getVenueAvailability(venueId: string) {
        const { data, error } = await supabase
            .from("venue_availability")
            .select("*")
            .eq("venue_id", venueId)
            .single();

        if (error) throw error;
        return data;
    }

    static async searchVenues(params: {
        query?: string
        type?: VenueType
        status?: VenueStatus
        minCapacity?: number
        maxPrice?: number
        availableDates?: string[]
    }) {
        let query = supabase.from("venues").select("*");

        if (params.query) {
            query = query.ilike("name", `%${params.query}%`);
        }

        if (params.type) {
            query = query.eq("type", params.type);
        }

        if (params.status) {
            query = query.eq("status", params.status);
        }

        if (params.minCapacity) {
            query = query.gte("capacity", params.minCapacity);
        }

        if (params.maxPrice) {
            query = query.lte("base_price", params.maxPrice);
        }

        if (params.availableDates?.length) {
            query = query.contains("available_dates", params.availableDates);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data;
    }
} 