"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_url: formData.get("image_url") as string,
      category_id: Number(formData.get("category_id")) || null,
      material_id: Number(formData.get("material_id")) || null,
      state_id: Number(formData.get("state_id")) || null,
      length_cm: Number(formData.get("length_cm")) || null,
      width_cm: Number(formData.get("width_cm")) || null,
      height_cm: Number(formData.get("height_cm")) || null,
      badge_label: (formData.get("badge_label") as string) || null,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  const colorIds = formData.getAll("color_ids").map(Number).filter(Boolean);
  if (colorIds.length > 0) {
    await supabase
      .from("product_colors")
      .insert(
        colorIds.map((color_id) => ({ product_id: product.id, color_id })),
      );
  }

  revalidatePath("/admin/productos");
  return { success: true };
}

export async function createCategory(name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_categories")
    .insert({ name })
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function createMaterial(name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_materials")
    .insert({ name })
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function createColor(name: string, hex_code: string) {
  const supabase = await createClient();
  const cleanHex = hex_code.replace("#", "");
  const { data, error } = await supabase
    .from("colors")
    .insert({ name, hex_code: cleanHex })
    .select()
    .single();
  if (error) return { success: false, error: error.message };
  return { success: true, data };
}

export async function deleteCategory(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_categories")
    .delete()
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteMaterial(id: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_materials")
    .delete()
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteColor(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("colors").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}