import { createClient } from "@/lib/supabase/server";
import EditProductsClient from "../../../components/edit-products-dashboard/edit-products-dashboard";

export default async function EditProductsPage() {
  const supabase = await createClient();

  const [
    { data: products },
    { data: categories },
    { data: materials },
    { data: states },
    { data: colors },
  ] = await Promise.all([
    supabase
      .from("products")
      .select(
        `
        *,
        product_categories(id, name),
        product_materials(id, name),
        product_states(id, name),
        product_colors(color_id)
      `,
      )
      .order("created_at", { ascending: false }),
    supabase.from("product_categories").select("id, name"),
    supabase.from("product_materials").select("id, name"),
    supabase.from("product_states").select("id, name"),
    supabase.from("colors").select("id, name, hex_code"),
  ]);

  return (
    <EditProductsClient
      products={products ?? []}
      categories={categories ?? []}
      materials={materials ?? []}
      states={states ?? []}
      colors={colors ?? []}
    />
  );
}
