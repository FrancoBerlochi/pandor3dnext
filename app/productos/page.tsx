"use client";
import Header from "../../components/cards/Header";
import { useState, useEffect } from "react";
import ProductCard from "../../components/cards/ProductCard";
import Link from "next/link";
import { Rocket, X, SlidersHorizontal } from "lucide-react";
import { topCero } from "../../lib/index";
import { createClient } from "@/lib/supabase/client";
import WhatsApp from "@/components/ui/whatsapp-button";

type ColorRelation = {
  colors: { name: string; hex_code: string };
};

type Product = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  badge_label: string | null;
  product_categories: { name: string } | null;
  product_materials: { name: string } | null;
  product_states: { name: string } | null;
  colores: ColorRelation[];
};

const Products = () => {
  // const products = [
  //   {
  //     id: 1,
  //     img: "/rex.jpg",
  //     tittle: "T-Rex esqueleto",
  //     size: "20 x 50",
  //   },
  //   {
  //     id: 2,
  //     img: "url",
  //     tittle: "Peppa Pig",
  //     size: "40 x 50",
  //   },
  //   {
  //     id: 3,
  //     img: "url",
  //     tittle: "Steve (Minecraft)",
  //     size: "",
  //   },
  //   {
  //     id: 4,
  //     img: "url",
  //     tittle: "Goku (Dragon Ball Z)",
  //     size: "",
  //   },
  //   {
  //     id: 5,
  //     img: "url",
  //     tittle: "Maceta Geométrica",
  //     size: "",
  //   },
  //   {
  //     id: 6,
  //     img: "url",
  //     tittle: "f",
  //     size: "",
  //   },
  //   {
  //     id: 7,
  //     img: "url",
  //     tittle: "g",
  //     size: "",
  //   },
  //   {
  //     id: 8,
  //     img: "url",
  //     tittle: "h",
  //     size: "",
  //   },
  //   {
  //     id: 9,
  //     img: "url",
  //     tittle: "i",
  //     size: "",
  //   },
  //   {
  //     id: 10,
  //     img: "",
  //     tittle: "j",
  //     size: "",
  //   },
  // ];
  const PAGE_SIZE = 6;
  const [currentPage, setCurrentPage] = useState(0);
  const [selected, setSelected] = useState("todos")
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterMaterials, setFilterMaterials] = useState<string[]>([]);
  const [filterBadges, setFilterBadges] = useState<string[]>([]);
  const [filterSearch, setFilterSearch] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const uniqueCategories = [
    ...new Set(
      products.map((p) => (p.product_categories as any)?.name).filter(Boolean),
    ),
  ] as string[];
  const uniqueMaterials = [
    ...new Set(
      products.map((p) => (p.product_materials as any)?.name).filter(Boolean),
    ),
  ] as string[];
  const uniqueBadges = [
    ...new Set(products.map((p) => p.badge_label).filter(Boolean)),
  ] as string[];

  useEffect(() => {
    async function getProducts() {
      const supabase = createClient();
      const { data, error } = await supabase.from("products").select(`
        *,
        product_categories(name),
        product_materials(name),
        product_states(name),
        colores:product_colors(colors(name, hex_code))
      `);

      if (error) console.error("Error:", error);
      if (data) setProducts(data);
      setLoading(false);
    }

    getProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      filterSearch === "" ||
      p.title.toLowerCase().includes(filterSearch.toLowerCase());
    const matchCategory =
      filterCategories.length === 0 ||
      filterCategories.includes((p.product_categories as any)?.name ?? "");
    const matchMaterial =
      filterMaterials.length === 0 ||
      filterMaterials.includes((p.product_materials as any)?.name ?? "");
    const matchBadge =
      filterBadges.length === 0 || filterBadges.includes(p.badge_label ?? "");
    return matchSearch && matchCategory && matchMaterial && matchBadge;
  });

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginated = filtered.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE,
  );

  function toggleFilter(
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setCurrentPage(0);
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  }

  const siguiente = () => {
    setCurrentPage((p) => p + 1);
    topCero()
  }

  const anterior = () => {
    setCurrentPage((p) => p - 1);
    topCero();
  };

  const actual = (i) => {
    setCurrentPage(i);
    topCero();
  }

  return (
    <div id="inicio">
      <WhatsApp></WhatsApp>
      <Header></Header>
      <main className="dark:bg-[#333] pb-20">
        <div className="flex flex-col pt-32 ml-12 max-md:w-[90vw] max-md:mx-auto">
          <h1 className="text-6xl mb-4 dark:text-white max-md:ml-3">
            Nuestros Productos
          </h1>
          <h2 className="text-xl text-gray-600 mb-16 dark:text-gray-300 max-md:w-fit max-md:text-[1.4rem] max-md:ml-3">
            Explorá nuestra colección de impresiones 3D
          </h2>
        </div>
        <section className="flex flex-col">
          <div className="flex justify-end mx-12">
            <div className="flex justify-between mx-12 gap-6 mb-12">
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSidebar(true)}
                  className="relative flex items-center gap-2 px-4 py-1.5 rounded-2xl border border-gray-300 dark:border-stone-600 text-sm text-gray-600 dark:text-gray-300 hover:border-sky-400 transition-colors"
                >
                  <SlidersHorizontal size={15} />
                  Filtros
                  {filterCategories.length +
                    filterMaterials.length +
                    filterBadges.length >
                    0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-sky-400 dark:bg-[hsl(36,100%,50%)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {filterCategories.length +
                        filterMaterials.length +
                        filterBadges.length}
                    </span>
                  )}
                </button>

                {/* Pills de filtros activos */}
                {[...filterCategories, ...filterMaterials, ...filterBadges].map(
                  (f) => (
                    <span
                      key={f}
                      className="flex items-center gap-1 px-3 py-1 rounded-2xl bg-sky-100 dark:bg-[hsl(36,100%,50%)] text-sky-700 dark:text-white text-xs"
                    >
                      {f}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => {
                          setCurrentPage(0);
                          setFilterCategories((prev) =>
                            prev.filter((v) => v !== f),
                          );
                          setFilterMaterials((prev) =>
                            prev.filter((v) => v !== f),
                          );
                          setFilterBadges((prev) =>
                            prev.filter((v) => v !== f),
                          );
                        }}
                      />
                    </span>
                  ),
                )}
              </div>

              <input
                value={filterSearch}
                onChange={(e) => {
                  setFilterSearch(e.target.value);
                  setCurrentPage(0);
                }}
                placeholder="🔍 Buscar por nombre..."
                className="border border-gray-200 dark:border-stone-700 dark:bg-stone-800 dark:text-white outline-none focus:border-sky-400 h-9 px-4 rounded-2xl text-sm w-64"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mx-12 max-md:grid-cols-1 max-md:mx-0">
            {paginated.map((prod) => (
              <ProductCard
                key={prod.id}
                index={prod.id}
                img={
                  prod.image_url && prod.image_url !== ""
                    ? prod.image_url
                    : "https://placehold.co/400"
                }
                tittle={prod.title}
                size={
                  prod.length_cm && prod.height_cm && prod.width_cm
                    ? `${prod.length_cm} x ${prod.height_cm} x ${prod.width_cm}`
                    : prod.length_cm && prod.height_cm
                      ? `${prod.length_cm} x ${prod.height_cm}`
                      : prod.length_cm && prod.width_cm
                        ? `${prod.length_cm} x ${prod.width_cm}`
                        : prod.height_cm && prod.width_cm
                          ? `${prod.height_cm} x ${prod.width_cm}`
                          : ""
                }
                description={prod.description}
                category={(prod.product_categories as any)?.name ?? null}
                material={(prod.product_materials as any)?.name ?? null}
                colores={prod.colores ?? []}
                estado={(prod.product_states as any)?.name ?? null}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={anterior}
                disabled={currentPage === 0}
                className="px-4 py-2 rounded-xl border border-gray-300 text-sm text-gray-600 dark:border-dark1 dark:bg-dark2 dark:text-white hover:border-sky-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => actual(i)}
                  className={`w-9 h-9 rounded-xl border text-sm transition-colors ${
                    i === currentPage
                      ? "bg-sky-400 border-sky-400 dark:bg-[hsl(36,100%,50%)] dark:border-dark1 text-white font-medium"
                      : "border-gray-300 text-gray-600 hover:border-sky-400 dark:text-gray-500 dark:hover:border-[hsl(36,100%,50%)]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={siguiente}
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 rounded-xl border border-gray-300 text-sm text-gray-600 dark:border-dark1 dark:bg-dark2 dark:text-white hover:border-sky-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          )}
        </section>
        <section className="border-2  bg-sky-400 dark:bg-[hsl(36,100%,50%)] dark:border-dark1 rounded-xl mt-30 flex justify-center mx-auto w-[60vw] shadow-2xs">
          <div className=" flex flex-col justify-center items-center py-16 w-[50%]">
            <h2 className="text-7xl font-semibold text-stone-900 text-center dark:text-black max-md:text-2xl">
              ¿No encontrás lo que buscás?
            </h2>
            <p className="text-gray-8 00 text-xl mt-8 text-center dark:text-gray-900 max-md:text-[1.1rem] max-md:text-center">
              Podemos imprimir cualquier diseño que tengas en mente. Contactanos
              para un presupuesto personalizado.
            </p>
            <Link
              href="/personalizar"
              className="flex gap-4 mt-8 bg-dark1 dark:bg-dark1 text-white dark:text-[hsl(36,100%,50%)] font-bold rounded-2xl p-4 shadow-md hover:opacity-90"
              onClick={topCero}
            >
              Solicitá tu diseño
              <Rocket></Rocket>
            </Link>
          </div>
        </section>
      </main>
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-white dark:bg-[#333] shadow-2xl transform transition-transform duration-300 ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 dark:border-stone-700">
          <div>
            <p className="text-[11px] tracking-widest text-sky-500 dark:text-[hsl(36,100%,50%)] uppercase font-medium">
              Filtros
            </p>
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Filtrar productos
            </h2>
          </div>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-6 overflow-y-auto h-[calc(100%-80px)]">
          {[
            {
              label: "Categoría",
              options: uniqueCategories,
              current: filterCategories,
              setter: setFilterCategories,
            },
            {
              label: "Material",
              options: uniqueMaterials,
              current: filterMaterials,
              setter: setFilterMaterials,
            },
            {
              label: "Badge",
              options: uniqueBadges,
              current: filterBadges,
              setter: setFilterBadges,
            },
          ].map(({ label, options, current, setter }) => (
            <div key={label}>
              <p className="text-[11px] tracking-widest text-gray-400 dark:text-gray-400 uppercase mb-3">
                {label}
              </p>
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => toggleFilter(opt, current, setter)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer ${
                      current.includes(opt)
                        ? "bg-sky-400 border-sky-400 dark:bg-[hsl(36,100%,50%)] dark:border-[hsl(36,100%,50%)] text-white font-medium"
                        : "border-gray-200 dark:border-stone-600 text-gray-600 dark:text-gray-300 hover:border-sky-400 dark:hover:border-[hsl(36,100%,50%)]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Limpiar */}
          {filterCategories.length +
            filterMaterials.length +
            filterBadges.length >
            0 && (
            <button
              onClick={() => {
                setFilterCategories([]);
                setFilterMaterials([]);
                setFilterBadges([]);
                setCurrentPage(0);
              }}
              className="mt-auto text-sm text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
            >
              <X size={14} /> Limpiar todos los filtros
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
