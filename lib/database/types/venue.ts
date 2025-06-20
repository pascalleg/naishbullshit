export type VenueType = 'concert_hall' | 'club' | 'studio' | 'outdoor' | 'theater' | 'bar' | 'restaurant' | 'other';
export type VenueStatus = 'active' | 'inactive' | 'maintenance' | 'deleted';
export type AvailabilityStatus = 'available' | 'booked' | 'maintenance' | 'blocked';

export interface Venue {
    id: string;
    owner_id: string;
    name: string;
    description: string | null;
    type: VenueType;
    status: VenueStatus;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    capacity: number;
    min_booking_hours: number;
    base_price: number;
    currency: string;
    images?: string[];
    amenities?: string[];
    rules?: string[];
    created_at: string;
    updated_at: string;
}

export interface VenueAvailability {
    id: string;
    venue_id: string;
    date: string;
    start_time: string;
    end_time: string;
    status: AvailabilityStatus;
    price: number | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface VenueFeature {
    id: string;
    venue_id: string;
    name: string;
    description: string | null;
    value: string;
    icon: string | null;
    created_at: string;
    updated_at: string;
}

export interface VenueReview {
    id: string;
    venue_id: string;
    user_id: string;
    user_name?: string;
    user_avatar?: string;
    rating: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    profiles?: { username: string | null };
}

export interface VenueWithDetails extends Venue {
    features: VenueFeature[];
    reviews: VenueReview[];
    average_rating: number;
    review_count: number;
}

export interface CreateVenueRequest {
    name: string;
    description: string;
    type: VenueType;
    status: VenueStatus;
    owner_id: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    latitude: number;
    longitude: number;
    capacity: number;
    min_booking_hours: number;
    base_price: number;
    currency: string;
    images?: string[];
    amenities?: string[];
    rules?: string[];
}

export interface UpdateVenueRequest {
    name?: string;
    description?: string;
    type?: VenueType;
    status?: VenueStatus;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
    latitude?: number;
    longitude?: number;
    capacity?: number;
    min_booking_hours?: number;
    base_price?: number;
    currency?: string;
    images?: string[];
    amenities?: string[];
    rules?: string[];
}

export interface CreateAvailabilityRequest {
    date: string;
    start_time: string;
    end_time: string;
    status?: AvailabilityStatus;
    price?: number;
    notes?: string;
}

export interface CreateFeatureRequest {
    name: string;
    description?: string;
    value: string;
    icon?: string;
}

export interface CreateReviewRequest {
    rating: number;
    comment?: string;
} 