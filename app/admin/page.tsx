import AdminDashboard from "@/components/admin-dashboard/admin-dashboard";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 5;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    categories?: string;
    materials?: string;
    states?: string;
    badges?: string;
  }>;
}) {
  await requireAdmin();
  const supabase = await createClient();

  const params = await searchParams;

  const page = Math.max(0, Number(params.page ?? 0));
  const search = params.search ?? "";
  const categories = params.categories ? params.categories.split(",") : [];
  const materials = params.materials ? params.materials.split(",") : [];
  const states = params.states ? params.states.split(",") : [];
  const badges = params.badges ? params.badges.split(",") : [];

  const [catIds, matIds, stateIds] = await Promise.all([
    categories.length > 0
      ? supabase
          .from("product_categories")
          .select("id")
          .in("name", categories)
          .then((r) => r.data?.map((c) => c.id) ?? [])
      : Promise.resolve([] as number[]),

    materials.length > 0
      ? supabase
          .from("product_materials")
          .select("id")
          .in("name", materials)
          .then((r) => r.data?.map((m) => m.id) ?? [])
      : Promise.resolve([] as number[]),

    states.length > 0
      ? supabase
          .from("product_states")
          .select("id")
          .in("name", states)
          .then((r) => r.data?.map((s) => s.id) ?? [])
      : Promise.resolve([] as number[]),
  ]);

  let query = supabase
    .from("products")
    .select(
      `
      *,
      product_categories(name),
      product_materials(name),
      product_states(name),
      colores:product_colors(colors(name, hex_code))
      `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

  if (search) query = query.ilike("title", `%${search}%`);
  if (catIds.length > 0) query = query.in("category_id", catIds);
  if (matIds.length > 0) query = query.in("material_id", matIds);
  if (stateIds.length > 0) query = query.in("state_id", stateIds);
  if (badges.length > 0) query = query.in("badge_label", badges);

  const { data: productos, count, error } = await query;

  if (error) console.error("Error cargando productos:", error);


  const { data: allProducts } = await supabase.from("products").select(`
    badge_label,
    product_categories(name),
    product_materials(name),
    product_states(name)
  `);

  const filterOptions = {
    categories: [
      ...new Set(
        allProducts
          ?.map((p) => (p.product_categories as any)?.name)
          .filter(Boolean),
      ),
    ] as string[],
    materials: [
      ...new Set(
        allProducts
          ?.map((p) => (p.product_materials as any)?.name)
          .filter(Boolean),
      ),
    ] as string[],
    states: [
      ...new Set(
        allProducts
          ?.map((p) => (p.product_states as any)?.name)
          .filter(Boolean),
      ),
    ] as string[],
    badges: [
      ...new Set(allProducts?.map((p) => p.badge_label).filter(Boolean)),
    ] as string[],
  };

  return (
    <main className="flex w-full bg-gray-400/15 dark:bg-dark2 min-h-screen">
      <AdminDashboard
        productosIniciales={productos || []}
        totalCount={count ?? 0}
        currentPage={page}
        pageSize={PAGE_SIZE}
        filterOptions={filterOptions}
        activeFilters={{ search, categories, materials, states, badges }}
      />
    </main>
  );
}
