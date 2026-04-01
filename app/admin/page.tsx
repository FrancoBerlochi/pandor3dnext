// app/admin/page.tsx (o donde tengas tu AdminPage)
import AdminDashboard from "@/components/admin-dashboard/admin-dashboard";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createClient();

  // Traemos los productos con sus relaciones
  const { data: productos, error } = await supabase
    .from("products")
    .select(
      `
      *,
      product_categories(name),
      product_materials(name),
      product_states(name),
      colores:product_colors(colors(name, hex_code))
    `,
    )
    .order("created_at", { ascending: false });


  if (error) {
    console.error("Error cargando productos:", error);
  }

  return (
    <main className="flex w-full bg-gray-400/15 min-h-screen">
      {/* Pasamos los datos al componente de cliente */}
      <AdminDashboard productosIniciales={productos || []} />
    </main>
  );
}
