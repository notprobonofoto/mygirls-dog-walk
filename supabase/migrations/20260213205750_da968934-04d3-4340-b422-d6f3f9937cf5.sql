ALTER TABLE public.photos DROP COLUMN dog_id;
ALTER TABLE public.photos ADD COLUMN dog_ids TEXT[] DEFAULT NULL;