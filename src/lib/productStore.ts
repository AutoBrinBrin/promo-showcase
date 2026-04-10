import { supabase } from "@/integrations/supabase/client";

export interface ProductPreset {
  id: string;
  name: string;
  image_url: string | null;
}

export interface FlyerItem {
  id: string;
  preset_id: string;
  original_price: number;
  discount_price: number;
  preset?: ProductPreset;
}

// Combined type for display
export interface FlyerProduct {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  imageUrl: string;
}

export async function getPresets(): Promise<ProductPreset[]> {
  const { data, error } = await supabase
    .from("product_presets")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createPreset(name: string, imageFile?: File): Promise<ProductPreset> {
  let image_url: string | null = null;

  if (imageFile) {
    const ext = imageFile.name.split(".").pop();
    const path = `presets/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, imageFile);
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);
    image_url = urlData.publicUrl;
  }

  const { data, error } = await supabase
    .from("product_presets")
    .insert({ name, image_url })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePreset(id: string): Promise<void> {
  const { error } = await supabase
    .from("product_presets")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function getFlyerItems(): Promise<FlyerProduct[]> {
  const { data, error } = await supabase
    .from("flyer_items")
    .select("*, product_presets(*)")
    .order("created_at");
  if (error) throw error;
  return (data ?? []).map((item: any) => ({
    id: item.id,
    name: item.product_presets?.name ?? "Produto",
    originalPrice: Number(item.original_price),
    discountPrice: Number(item.discount_price),
    imageUrl: item.product_presets?.image_url ?? "",
  }));
}

export async function addFlyerItem(
  presetId: string,
  originalPrice: number,
  discountPrice: number
): Promise<void> {
  const { error } = await supabase
    .from("flyer_items")
    .insert({ preset_id: presetId, original_price: originalPrice, discount_price: discountPrice });
  if (error) throw error;
}

export async function removeFlyerItem(id: string): Promise<void> {
  const { error } = await supabase
    .from("flyer_items")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function removeAllFlyerItems(): Promise<void> {
  const { error } = await supabase
    .from("flyer_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  if (error) throw error;
}

export interface FlyerSettings {
  promo_end_date: string | null;
  promo_end_time: string | null;
}

const SETTINGS_ID = "00000000-0000-0000-0000-000000000001";

export async function getFlyerSettings(): Promise<FlyerSettings> {
  const { data, error } = await supabase
    .from("flyer_settings")
    .select("promo_end_date, promo_end_time")
    .eq("id", SETTINGS_ID)
    .single();
  if (error) throw error;
  return data;
}

export async function updateFlyerSettings(settings: Partial<FlyerSettings>): Promise<void> {
  const { error } = await supabase
    .from("flyer_settings")
    .update({ ...settings, updated_at: new Date().toISOString() })
    .eq("id", SETTINGS_ID);
  if (error) throw error;
}
