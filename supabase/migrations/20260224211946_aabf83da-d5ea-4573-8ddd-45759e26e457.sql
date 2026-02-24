
CREATE TABLE public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE public.user_preferences (
  person_id TEXT PRIMARY KEY,
  theme TEXT NOT NULL DEFAULT 'standard',
  language TEXT NOT NULL DEFAULT 'pl'
);

INSERT INTO public.app_config (key, value) VALUES ('app_password', 'CoffeeMokka');

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all on app_config" ON public.app_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on user_preferences" ON public.user_preferences FOR ALL USING (true) WITH CHECK (true);
