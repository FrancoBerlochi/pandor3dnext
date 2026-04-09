"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProduct(
  productId: string,
  formData: FormData,
  colorIds: number[],
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({
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
    .eq("id", productId);

  if (error) return { success: false, error: error.message };

  // Reemplazamos los colores — borramos los anteriores y ponemos los nuevos
  await supabase.from("product_colors").delete().eq("product_id", productId);

  if (colorIds.length > 0) {
    await supabase
      .from("product_colors")
      .insert(
        colorIds.map((color_id) => ({ product_id: productId, color_id })),
      );
  }

  revalidatePath("/admin/edit-products");
  revalidatePath("/admin/productos");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();

  // 1. Borrar colores asociados primero
  const { error: colorsError } = await supabase
    .from("product_colors")
    .delete()
    .eq("product_id", id);

  if (colorsError) return { success: false, error: colorsError.message };

  // 2. Borrar el producto
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}