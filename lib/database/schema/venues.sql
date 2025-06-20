-- Create enum types
CREATE TYPE venue_type AS ENUM ('concert_hall', 'club', 'studio', 'outdoor', 'theater', 'other');
CREATE TYPE venue_status AS ENUM ('active', 'inactive', 'maintenance', 'deleted');
CREATE TYPE availability_status AS ENUM ('available', 'booked', 'maintenance', 'blocked');

-- Create venues table
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type venue_type NOT NULL,
    status venue_status NOT NULL DEFAULT 'active',
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    capacity INTEGER NOT NULL,
    min_booking_hours INTEGER NOT NULL DEFAULT 4,
    base_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    images TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    rules TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create venue_availability table
CREATE TABLE venue_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status availability_status NOT NULL DEFAULT 'available',
    price DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT valid_times CHECK (start_time < end_time),
    CONSTRAINT unique_venue_time UNIQUE (venue_id, date, start_time, end_time)
);

-- Create venue_features table
CREATE TABLE venue_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    value TEXT NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create venue_reviews table
CREATE TABLE venue_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_venue_review UNIQUE (venue_id, user_id)
);

-- Create indexes
CREATE INDEX idx_venues_owner ON venues(owner_id);
CREATE INDEX idx_venues_type ON venues(type);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_location ON venues(city, state, country);
CREATE INDEX idx_venue_availability_venue ON venue_availability(venue_id);
CREATE INDEX idx_venue_availability_date ON venue_availability(date);
CREATE INDEX idx_venue_features_venue ON venue_features(venue_id);
CREATE INDEX idx_venue_reviews_venue ON venue_reviews(venue_id);
CREATE INDEX idx_venue_reviews_user ON venue_reviews(user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_venues_updated_at
    BEFORE UPDATE ON venues
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venue_availability_updated_at
    BEFORE UPDATE ON venue_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venue_features_updated_at
    BEFORE UPDATE ON venue_features
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_venue_reviews_updated_at
    BEFORE UPDATE ON venue_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Venues are viewable by everyone"
    ON venues FOR SELECT
    USING (status != 'deleted');

CREATE POLICY "Venues are insertable by authenticated users"
    ON venues FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Venues are updatable by owner"
    ON venues FOR UPDATE
    TO authenticated
    USING (auth.uid() = owner_id)
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Venue availability is viewable by everyone"
    ON venue_availability FOR SELECT
    USING (true);

CREATE POLICY "Venue availability is manageable by venue owner"
    ON venue_availability FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM venues
            WHERE venues.id = venue_availability.venue_id
            AND venues.owner_id = auth.uid()
        )
    );

CREATE POLICY "Venue features are viewable by everyone"
    ON venue_features FOR SELECT
    USING (true);

CREATE POLICY "Venue features are manageable by venue owner"
    ON venue_features FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM venues
            WHERE venues.id = venue_features.venue_id
            AND venues.owner_id = auth.uid()
        )
    );

CREATE POLICY "Venue reviews are viewable by everyone"
    ON venue_reviews FOR SELECT
    USING (true);

CREATE POLICY "Venue reviews are insertable by authenticated users"
    ON venue_reviews FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Venue reviews are updatable by reviewer"
    ON venue_reviews FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id); 