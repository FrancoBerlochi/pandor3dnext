import { createClient } from "@/lib/supabase/server";
import NewProductForm from "../../../components/new-product-form/NewProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();

  const [
    { data: categories },
    { data: materials },
    { data: states },
    { data: colors },
  ] = await Promise.all([
    supabase.from("product_categories").select("id, name"),
    supabase.from("product_materials").select("id, name"),
    supabase.from("product_states").select("id, name"),
    supabase.from("colors").select("id, name, hex_code"),
  ]);

  return (
    <NewProductForm
      categories={categories ?? []}
      materials={materials ?? []}
      states={states ?? []}
      colors={colors ?? []}
    />
  );
}
