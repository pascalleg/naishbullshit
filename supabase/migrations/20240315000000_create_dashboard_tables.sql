CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create dashboard_metrics table
CREATE TABLE IF NOT EXISTS public.dashboard_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    total_bookings BIGINT DEFAULT 0,
    total_revenue NUMERIC DEFAULT 0.00,
    active_listings BIGINT DEFAULT 0,
    new_users_24h BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to update dashboard metrics
CREATE OR REPLACE FUNCTION public.update_dashboard_metrics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.dashboard_metrics (
        total_bookings,
        total_revenue,
        active_listings,
        new_users_24h
    ) VALUES (
        (SELECT COUNT(*) FROM public.bookings),
        (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'completed'),
        (SELECT COUNT(*) FROM public.venues WHERE is_active = TRUE),
        (SELECT COUNT(*) FROM auth.users WHERE created_at >= NOW() - INTERVAL '24 hours')
    )
    ON CONFLICT (id) DO UPDATE SET
        total_bookings = EXCLUDED.total_bookings,
        total_revenue = EXCLUDED.total_revenue,
        active_listings = EXCLUDED.active_listings,
        new_users_24h = EXCLUDED.new_users_24h,
        updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up Row Level Security (RLS) for dashboard_metrics
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.dashboard_metrics
FOR SELECT USING (TRUE);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger for profile updates
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create a trigger for profile updates from users table
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    full_name = NEW.raw_user_meta_data->>'full_name',
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_user_meta_data IS DISTINCT FROM OLD.raw_user_meta_data)
  EXECUTE FUNCTION public.handle_user_update();

-- Set up Row Level Security (RLS) for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create venues table
CREATE TABLE IF NOT EXISTS public.venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    capacity INT,
    amenities TEXT[],
    rules TEXT[],
    images TEXT[],
    price_per_hour NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for venues
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Venue owners can manage their venues." ON public.venues
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Public venues are viewable by everyone." ON public.venues
  FOR SELECT USING (TRUE);

-- Create a trigger for venue updates
CREATE OR REPLACE FUNCTION public.update_venue_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_venue_update
  BEFORE UPDATE ON public.venues
  FOR EACH ROW EXECUTE PROCEDURE public.update_venue_timestamp();

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES public.venues(id) ON DELETE CASCADE,
    booker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Booking owners can view their bookings." ON public.bookings
  FOR SELECT USING (auth.uid() = booker_id);

CREATE POLICY "Venue owners can view bookings for their venues." ON public.bookings
  FOR SELECT USING ((SELECT owner_id FROM public.venues WHERE id = venue_id) = auth.uid());

CREATE POLICY "Users can insert new bookings." ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = booker_id);

CREATE POLICY "Bookings can be updated by booker or venue owner." ON public.bookings
  FOR UPDATE USING (auth.uid() = booker_id OR (SELECT owner_id FROM public.venues WHERE id = venue_id) = auth.uid());

-- Create a trigger for booking updates
CREATE OR REPLACE FUNCTION public.update_booking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_booking_update
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE PROCEDURE public.update_booking_timestamp();

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id TEXT,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their payments." ON public.payments
  FOR SELECT USING ((SELECT booker_id FROM public.bookings WHERE id = booking_id) = auth.uid() OR (SELECT owner_id FROM public.venues WHERE id = (SELECT venue_id FROM public.bookings WHERE id = booking_id)) = auth.uid());

CREATE POLICY "Payments can be inserted by authenticated users." ON public.payments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create a trigger for payment updates
CREATE OR REPLACE FUNCTION public.update_payment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_payment_update
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE PROCEDURE public.update_payment_timestamp();


-- Create triggers
CREATE TRIGGER update_metrics_on_booking_change
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_dashboard_metrics();

SELECT cron.schedule('0 0 * * *', $$SELECT update_dashboard_metrics()$$); 