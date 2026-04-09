
-- Product presets table
CREATE TABLE public.product_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.product_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view presets" ON public.product_presets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert presets" ON public.product_presets FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update presets" ON public.product_presets FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete presets" ON public.product_presets FOR DELETE TO authenticated USING (true);

-- Flyer items table
CREATE TABLE public.flyer_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preset_id UUID NOT NULL REFERENCES public.product_presets(id) ON DELETE CASCADE,
  original_price NUMERIC(10,2) NOT NULL,
  discount_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.flyer_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view flyer items" ON public.flyer_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert flyer items" ON public.flyer_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update flyer items" ON public.flyer_items FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete flyer items" ON public.flyer_items FOR DELETE TO authenticated USING (true);

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');

-- Seed default presets
INSERT INTO public.product_presets (name) VALUES
  ('Salgadinho Gula Sticks'),
  ('Leite Ninho Instantâneo 380g'),
  ('Mucilon Sachê 180g'),
  ('Nescau em Pó 370g'),
  ('Sucrilhos Kelloggs 240g'),
  ('Pão de Forma Vaibem 450g'),
  ('Look Itamaraty 55g'),
  ('Bombom Garoto 250g'),
  ('Achocolatado Energia 200ml'),
  ('Arroz Rampinelli 5kg');
