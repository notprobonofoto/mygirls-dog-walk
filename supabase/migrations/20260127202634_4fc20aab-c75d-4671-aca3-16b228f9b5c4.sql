-- Create table for walks/events (shared by all users)
CREATE TABLE public.walks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  dog_id TEXT NOT NULL,
  person_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('pee_walk', 'poop_walk', 'both_walk', 'pee_home', 'poop_home')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create table for dogs (shared config)
CREATE TABLE public.dogs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  color TEXT NOT NULL,
  avatar_url TEXT
);

-- Create table for people (shared config)
CREATE TABLE public.people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  initial TEXT NOT NULL
);

-- Create table for device registration (for push notifications)
CREATE TABLE public.device_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default dogs
INSERT INTO public.dogs (id, name, date_of_birth, color) VALUES
  ('coffee', 'Coffee', '2022-11-03', '#4A4A4A'),
  ('mokka', 'Mokka', '2025-08-15', '#D4A574');

-- Insert default people
INSERT INTO public.people (id, name, initial) VALUES
  ('grzegorz', 'Grzegorz', 'G'),
  ('ilona', 'Ilona', 'I'),
  ('marek', 'Marek', 'M');

-- Enable RLS on all tables
ALTER TABLE public.walks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_tokens ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/write walks (no auth, shared data)
CREATE POLICY "Allow all operations on walks" ON public.walks FOR ALL USING (true) WITH CHECK (true);

-- Allow anyone to read dogs
CREATE POLICY "Allow read dogs" ON public.dogs FOR SELECT USING (true);

-- Allow anyone to update dogs (for avatar changes)
CREATE POLICY "Allow update dogs" ON public.dogs FOR UPDATE USING (true) WITH CHECK (true);

-- Allow anyone to read people
CREATE POLICY "Allow read people" ON public.people FOR SELECT USING (true);

-- Allow anyone to manage device tokens
CREATE POLICY "Allow all operations on device_tokens" ON public.device_tokens FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for walks table
ALTER PUBLICATION supabase_realtime ADD TABLE public.walks;