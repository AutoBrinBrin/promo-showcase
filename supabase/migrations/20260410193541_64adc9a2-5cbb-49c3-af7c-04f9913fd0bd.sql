
CREATE TABLE public.flyer_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  promo_end_date DATE,
  promo_end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.flyer_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view flyer settings" ON public.flyer_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert flyer settings" ON public.flyer_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update flyer settings" ON public.flyer_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete flyer settings" ON public.flyer_settings FOR DELETE TO authenticated USING (true);

-- Insert a default row
INSERT INTO public.flyer_settings (id) VALUES ('00000000-0000-0000-0000-000000000001');
