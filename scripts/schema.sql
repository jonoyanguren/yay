-- Run this in Vercel Postgres (Dashboard → Storage → your store → Query) or via psql with POSTGRES_URL.
-- Full retreat content lives in DB; JSONB for arrays/objects.

CREATE TABLE IF NOT EXISTS retreats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  full_description TEXT NOT NULL DEFAULT '',
  activities JSONB NOT NULL DEFAULT '[]',
  program JSONB NOT NULL DEFAULT '[]',
  image TEXT NOT NULL DEFAULT '',
  date TEXT NOT NULL DEFAULT '',
  price TEXT NOT NULL DEFAULT '',
  arrival_intro TEXT,
  arrival_options JSONB,
  day_by_day JSONB,
  includes JSONB,
  not_includes JSONB,
  extra_ideas JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Room types per retreat: name, price in cents, max places
CREATE TABLE IF NOT EXISTS retreat_room_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retreat_id UUID NOT NULL REFERENCES retreats(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  max_quantity INTEGER NOT NULL CHECK (max_quantity > 0)
);

-- Extra activities per retreat: name, price in cents (optional add-ons)
CREATE TABLE IF NOT EXISTS retreat_extra_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retreat_id UUID NOT NULL REFERENCES retreats(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0)
);

-- Bookings (one per Stripe checkout)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retreat_id UUID NOT NULL REFERENCES retreats(id),
  stripe_session_id TEXT UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Room slots chosen in a booking
CREATE TABLE IF NOT EXISTS booking_room_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  retreat_room_type_id UUID NOT NULL REFERENCES retreat_room_types(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Extra activities chosen in a booking
CREATE TABLE IF NOT EXISTS booking_extras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  retreat_extra_activity_id UUID NOT NULL REFERENCES retreat_extra_activities(id),
  quantity INTEGER NOT NULL CHECK (quantity >= 0)
);

CREATE INDEX IF NOT EXISTS idx_retreat_room_types_retreat_id ON retreat_room_types(retreat_id);
CREATE INDEX IF NOT EXISTS idx_retreat_extra_activities_retreat_id ON retreat_extra_activities(retreat_id);
CREATE INDEX IF NOT EXISTS idx_bookings_retreat_id ON bookings(retreat_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_booking_room_slots_booking_id ON booking_room_slots(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_room_slots_room_type_id ON booking_room_slots(retreat_room_type_id);
CREATE INDEX IF NOT EXISTS idx_booking_extras_booking_id ON booking_extras(booking_id);
