-- Create photos table for gallery
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  description TEXT,
  dog_id TEXT,
  person_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Anyone can view photos
CREATE POLICY "Allow read photos" ON public.photos FOR SELECT USING (true);

-- Anyone can insert photos
CREATE POLICY "Allow insert photos" ON public.photos FOR INSERT WITH CHECK (true);

-- Anyone can delete photos
CREATE POLICY "Allow delete photos" ON public.photos FOR DELETE USING (true);

-- Create storage bucket for dog photos
INSERT INTO storage.buckets (id, name, public) VALUES ('dog-photos', 'dog-photos', true);

-- Storage policies
CREATE POLICY "Anyone can view dog photos" ON storage.objects FOR SELECT USING (bucket_id = 'dog-photos');
CREATE POLICY "Anyone can upload dog photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'dog-photos');
CREATE POLICY "Anyone can delete dog photos" ON storage.objects FOR DELETE USING (bucket_id = 'dog-photos');

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.photos;