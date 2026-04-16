"use client";
import Link from "next/link";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PenLine,
  SlidersHorizontal,
  X,
  FunnelX,
  ChevronLeft,
  ChevronRight,
  Search,
  Menu,
  Plus
} from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
// const productos = [
//   {
//     id: 1,
//     img: "https://placehold.co/48x48",
//     titulo: "Figura Dragon",
//     descripcion: "Figura impresa en resina de alta calidad",
//     categoria: "Figuras",
//     material: "Resina",
//     tamaño: "15cm",
//     colores: ["Rojo", "Negro"],
//     estado: "Activo",
//   },
//   {
//     id: 2,
//     img: "https://placehold.co/48x48",
//     titulo: "Soporte Celular",
//     descripcion: "Soporte de escritorio articulado",
//     categoria: "Accesorios",
//     material: "PLA",
//     tamaño: "10cm",
//     colores: ["Blanco"],
//     estado: "Activo",
//   },
//   {
//     id: 3,
//     img: "https://placehold.co/48x48",
//     titulo: "Maceta Geométrica",
//     descripcion: "Maceta con diseño hexagonal moderno",
//     categoria: "Decoración",
//     material: "PETG",
//     tamaño: "12cm",
//     colores: ["Verde", "Gris"],
//     estado: "Inactivo",
//   },
//   {
//     id: 4,
//     img: "https://placehold.co/48x48",
//     titulo: "Llavero Robot",
//     descripcion: "Llavero articulado con forma de robot",
//     categoria: "Llaveros",
//     material: "PLA",
//     tamaño: "5cm",
//     colores: ["Azul", "Plateado"],
//     estado: "Activo",
//   },
//   {
//     id: 5,
//     img: "https://placehold.co/48x48",
//     titulo: "Caja Organizadora",
//     descripcion: "Caja con compartimentos para escritorio",
//     categoria: "Organización",
//     material: "ABS",
//     tamaño: "20cm",
//     colores: ["Negro"],
//     estado: "Activo",
//   },
// ];

interface ColorRelation {
  colors: {
    name: string;
    hex_code: string;
  };
}

interface Producto {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  product_categories: { name: string } | null;
  product_materials: { name: string } | null;
  product_states: { name: string } | null;
  colores: ColorRelation[];
  badge_label: string | null;
}

interface FilterOptions {
  categories: string[];
  materials: string[];
  states: string[];
  badges: string[];
}

interface ActiveFilters {
  search: string;
  categories: string[];
  materials: string[];
  states: string[];
  badges: string[];
}

interface AdminDashboardProps {
  productosIniciales: Producto[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
}

export default function AdminDashboard({
  productosIniciales,
  totalCount,
  currentPage,
  pageSize,
  filterOptions,
  activeFilters,
}: AdminDashboardProps) {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState(activeFilters.search);
  const [draftCategories, setDraftCategories] = useState<string[]>(
    activeFilters.categories,
  );
  const [draftMaterials, setDraftMaterials] = useState<string[]>(
    activeFilters.materials,
  );
  const [draftStates, setDraftStates] = useState<string[]>(
    activeFilters.states,
  );
  const [draftBadges, setDraftBadges] = useState<string[]>(
    activeFilters.badges,
  );
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalPages = Math.ceil(totalCount / pageSize);
  const [clampedItems, setClampedItems] = useState<Set<string>>(new Set());
  const [viewMore, setViewMore] = useState("");
  const [showBurguer, setShowBurguer] = useState(false);
  const measuredIds = useRef<Set<string>>(new Set());
  const [loading, setLoading] = useState("");

  const activeFiltersCount =
    activeFilters.categories.length +
    activeFilters.materials.length +
    activeFilters.states.length +
    activeFilters.badges.length;

  const handleShowBurguer = () => {
    setShowBurguer(!showBurguer);
  };

  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const merged = {
      search: activeFilters.search,
      categories: activeFilters.categories.join(","),
      materials: activeFilters.materials.join(","),
      states: activeFilters.states.join(","),
      badges: activeFilters.badges.join(","),
      page: String(currentPage),
      ...overrides,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    return `/admin?${params.toString()}`;
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      router.push(buildUrl({ search: value, page: "0" }));
    }, 400);
  }

  function applyFilters() {
    router.push(
      buildUrl({
        categories: draftCategories.join(","),
        materials: draftMaterials.join(","),
        states: draftStates.join(","),
        badges: draftBadges.join(","),
        page: "0",
      }),
    );
    setShowFilters(false);
  }

  function clearFilters() {
    setDraftCategories([]);
    setDraftMaterials([]);
    setDraftStates([]);
    setDraftBadges([]);
    router.push(
      buildUrl({
        categories: "",
        materials: "",
        states: "",
        badges: "",
        page: "0",
      }),
    );
    setShowFilters(false);
  }

  function openFilters() {
    // Sincroniza los drafts con los filtros activos al abrir
    setDraftCategories(activeFilters.categories);
    setDraftMaterials(activeFilters.materials);
    setDraftStates(activeFilters.states);
    setDraftBadges(activeFilters.badges);
    setShowFilters(true);
  }

  function toggleDraft(
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  }

  function goToPage(page: number) {
    router.push(buildUrl({ page: String(page) }));
  }

  const handleViewMore = (id: string) => {
    setViewMore(viewMore === id ? "" : id);
  };

  const descriptionRef = (id: string) => (el: HTMLDivElement | null) => {
    if (!el || measuredIds.current.has(id)) return;
    measuredIds.current.add(id);
    if (el.scrollHeight > el.clientHeight) {
      setClampedItems((prev) => new Set(prev).add(id));
    }
  };

  return (
    <>
      <div className="w-full max-md:hidden">
        <section className="w-full bg-white dark:bg-dark3 py-4 shadow-2xs border-b-[0.5px] border-b-light dark:border-b-dark2 flex">
          <div className="flex w-full justify-between">
            <div className="flex w-7xl">
              <div className="flex-col ml-4">
                <div className="w-fit border-r-4 font-semibold pr-1 border-sky-500 dark:border-[hsl(41,98%,45%)]">
                  PANDOR3D
                </div>
                <p className="text-sky-500 dark:text-[hsl(41,98%,65%)]">
                  Panel de Administrador
                </p>
              </div>
              <div className="ml-32 lg:w-[40%] flex gap-2">
                <input
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  type="text"
                  className="border border-gray-100 outline-0 focus:border-sky-500 focus:border-2 dark:focus:border-[hsl(41,98%,65%)] shadow-md dark:shadow-[#111] dark:border-stone-800 h-10 px-4 rounded-2xl w-full dark:bg-stone-900 dark:text-white"
                  placeholder="🔍 Buscar inventario..."
                />
                <button
                  onClick={openFilters}
                  className="relative h-10 px-4 rounded-2xl border border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-md dark:shadow-[#111] text-sm text-gray-600 dark:text-white hover:border-sky-500 dark:hover:border-[hsl(41,98%,65%)] transition-colors flex items-center gap-2 shrink-0"
                >
                  <SlidersHorizontal size={15} />
                  Filtrar
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-sky-500 dark:bg-[hsl(41,98%,65%)] text-white dark:text-dark3 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div>
                <ThemeToggle></ThemeToggle>
              </div>
              <Link
                href="admin/edit-products"
                className="p-2 px-4 hover:brightness-90  text-white rounded-2xl flex items-center bg-sky-500 dark:text-dark3 dark:bg-[hsl(41,98%,65%)]"
                onClick={() => setLoading("edit")}
              >
                <div className="flex gap-2">
                  {loading === "edit" ? "Cargando..." : `EDITAR PRODUCTOS`}
                  <PenLine></PenLine>
                </div>
              </Link>
              <Link
                href="admin/new-product"
                className="py-1 px-2 mr-4 hover:brightness-90 text-white dark:text-dark3 dark:bg-[hsl(41,98%,65%)] rounded-4xl flex w-32 text-[14px] text-center justify-center items-center bg-sky-500"
                onClick={() => setLoading("new")}
              >
                {loading === "new" ? "Cargando..." : "NUEVO PRODUCTO"}
              </Link>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center dark:bg-dark2">
          <h2 className="mt-12 text-xl text-sky-500 dark:text-[hsl(41,98%,65%)] tracking-wide">
            Gestión de Inventario
          </h2>
          <h1 className="text-center w-fit text-6xl relative">
            Lista De Productos
            <span className="absolute w-20 border-b-4 bottom-0 left-[calc(50%-40px)] border-sky-500 dark:border-[hsl(41,98%,65%)] rounded-xl"></span>
          </h1>
          <article className="w-[98%] bg-white dark:bg-dark3 mt-6 rounded-2xl shadow-2xs">
            <p className="my-4 ml-4 text-xl font-semibold">Catálogo Activo</p>
            <ul className="flex justify-between bg-gray-400/15 dark:text-white mx-6 items-center mt-2 text-sm font-semibold text-gray-600  p-2">
              <li className="w-12">Img</li>
              <li className="w-32">Título</li>
              <li className="w-48">Descripción</li>
              <li className="w-22">Categoría</li>
              <li className="w-19">Material</li>
              <li className="w-24">Tamaño</li>
              <li className="w-28">Colores</li>
              <li className="w-18">Estado</li>
            </ul>

            <div className="flex flex-col mx-6">
              {productosIniciales.length === 0 ? (
                <p className="text-center text-gray-400 py-8 dark:text-gray-200">
                  No se encontraron productos.
                </p>
              ) : (
                productosIniciales.map((p) => (
                  <ul
                    key={p.id}
                    className="flex justify-between items-center py-3 text-sm"
                  >
                    <li className="w-16 relative">
                      <img
                        src={p.image_url || "https://placehold.co/48x48"}
                        alt={p.title}
                        className="w-16 h-16 rounded-md object-cover"
                      />
                      <div className="absolute top-1 letf-1 text-[9px] text-white bg-sky-500 dark:bg-[hsl(41,98%,45%)] dark:text-gray-800 rounded-md">
                        {p.badge_label}
                      </div>
                    </li>
                    <li className="w-32 font-medium text-gray-800 dark:text-gray-100">
                      {p.title}
                    </li>
                    <li className={` w-48 text-gray-800 dark:text-gray-100`}>
                      <div
                        ref={descriptionRef(p.id)}
                        className={`${viewMore === p.id ? "" : "line-clamp-1"}`}
                      >
                        {p.description}
                      </div>
                      {clampedItems.has(p.id) && viewMore !== p.id && (
                        <div
                          className="text-[10px] w-fit cursor-pointer"
                          onClick={() => handleViewMore(p.id)}
                        >
                          Ver más.
                        </div>
                      )}
                      {viewMore === p.id && (
                        <div
                          className="text-[10px] w-fit cursor-pointer"
                          onClick={() => handleViewMore(p.id)}
                        >
                          Ver menos.
                        </div>
                      )}
                    </li>
                    <li className="w-22 text-gray-800 dark:text-gray-100">
                      {p.product_categories?.name}
                    </li>
                    <li className="w-19 text-gray-800 dark:text-gray-100">
                      {p.product_materials?.name}
                    </li>
                    <li className="w-24 text-gray-800 dark:text-gray-100">
                      {p.length_cm}x{p.width_cm ? `${p.width_cm} x` : ""}
                      {p.height_cm}cm
                    </li>

                    {/* Mapeo de colores (basado en la relación intermedia) */}
                    <li className="w-28 flex flex-wrap gap-1">
                      {p.colores?.map((item) => (
                        <span
                          key={item.colors.name}
                          className="text-white text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: "#" + item.colors.hex_code,
                          }}
                        >
                          {item.colors.name}
                        </span>
                      ))}
                    </li>

                    <li className="w-18">
                      <span
                        className={`text-xs font-medium rounded-full ${
                          p.product_states?.name === "Activo"
                            ? "bg-green-100 text-green-700 dark:text-white dark:bg-green-700 px-2 py-1"
                            : p.product_states?.name === "Inactivo"
                              ? "bg-red-100 text-red-600 dark:text-white dark:bg-red-600 px-2 py-1"
                              : "bg-black px-1 py-1 dark:bg-white dark:text-black text-white"
                        }`}
                      >
                        {p.product_states?.name ?? "Sin estado"}
                      </span>
                    </li>
                  </ul>
                ))
              )}
            </div>
            <section></section>
          </article>
          <div className="flex items-center justify-between px-6 py-4 mt-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Mostrando {currentPage * pageSize + 1}–
              {Math.min((currentPage + 1) * pageSize, totalCount)} de{" "}
              {totalCount} productos
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-stone-700 text-gray-500 dark:text-gray-300 hover:border-sky-400 dark:hover:border-[hsl(41,98%,65%)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-8 h-8 text-sm rounded-lg border transition-colors ${
                    i === currentPage
                      ? "bg-sky-500 dark:bg-[hsl(41,98%,65%)] border-sky-500 dark:border-[hsl(41,98%,65%)] text-white dark:text-dark3 font-medium"
                      : "border-gray-200 dark:border-stone-700 text-gray-500 dark:text-gray-300 hover:border-sky-400 dark:hover:border-[hsl(41,98%,65%)]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-stone-700 text-gray-500 dark:text-gray-300 hover:border-sky-400 dark:hover:border-[hsl(41,98%,65%)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </section>
        {showFilters && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowFilters(false);
            }}
          >
            <div className="bg-white dark:bg-dark3 rounded-2xl shadow-xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-stone-700">
                <div>
                  <p className="text-[11px] tracking-widest text-sky-500 dark:text-[hsl(41,98%,65%)] uppercase font-medium">
                    Filtros
                  </p>
                  <h2 className="text-lg font-medium text-gray-800 tracking-wider dark:text-gray-200">
                    Filtrar productos
                  </h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grupos */}
              <div className="px-6 py-5 flex flex-col gap-5">
                {[
                  {
                    label: "Categoría",
                    options: filterOptions.categories,
                    current: draftCategories,
                    setter: setDraftCategories,
                  },
                  {
                    label: "Material",
                    options: filterOptions.materials,
                    current: draftMaterials,
                    setter: setDraftMaterials,
                  },
                  {
                    label: "Estado",
                    options: filterOptions.states,
                    current: draftStates,
                    setter: setDraftStates,
                  },
                  {
                    label: "Badge",
                    options: filterOptions.badges,
                    current: draftBadges,
                    setter: setDraftBadges,
                  },
                ].map(({ label, options, current, setter }) => (
                  <div key={label}>
                    <p className="text-[11px] tracking-widest text-gray-700 dark:text-gray-200 uppercase mb-2">
                      {label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleDraft(opt, current, setter)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer hover:border-sky-400 dark:hover:border-amber-300 ${
                            current.includes(opt)
                              ? "bg-sky-500 border-sky-500 dark:bg-[hsl(41,98%,65%)] dark:border-[hsl(41,98%,65%)] text-white dark:text-dark3 font-medium"
                              : "border-gray-200 dark:border-stone-600 text-gray-600 dark:text-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 pb-5 pt-4 border-t border-gray-100 dark:border-stone-700">
                <button
                  onClick={clearFilters}
                  disabled={activeFiltersCount === 0}
                  className="text-sm flex gap-2 text-gray-700 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-100 cursor-pointer disabled:cursor-auto disabled:opacity-75 dark:disabled:opacity-30 transition-colors"
                >
                  Limpiar filtros
                  <FunnelX className=""></FunnelX>
                </button>
                <button
                  onClick={applyFilters}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 dark:bg-[hsl(41,98%,65%)] dark:hover:bg-[hsl(41,98%,45%)] dark:text-dark3 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="md:hidden flex flex-col w-full">
        <header className="sticky top-0 z-30 bg-white dark:bg-dark3 border-b border-gray-100 dark:border-stone-800 p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="font-bold text-lg dark:text-white">PANDOR3D</h1>
              <p className="text-xs text-sky-500 dark:text-[hsl(41,98%,65%)]">
                Admin Panel
              </p>
            </div>
            <Menu
              onClick={handleShowBurguer}
              className={`${showBurguer ? "max-md:hidden" : "max-md:flex"} w-8 h-8 `}
            ></Menu>
            <div
              className={`z-300 flex justify-center bg-black/65 items-center fixed top-0 left-0 ${showBurguer ? "min-w-screen min-h-screen" : "w-0 min-h-screen"}`}
            >
              <div
                className={`bg-blue-600 dark:bg-dark3 rounded-2xl transition-all duration-200 gap-2 flex items-center justify-center ${showBurguer ? "w-60 min-h-35" : "w-0 min-h-60"}`}
              >
                <X
                  onClick={handleShowBurguer}
                  className={`transition-all duration-200 cursor-pointer ${showBurguer ? "max-md:flex" : "max-md:hidden"} w-8 h-8 `}
                ></X>
                <div className="transition-all duration-200 flex gap-4">
                  <div className={`${showBurguer ? "" : "hidden"}`}>
                    <ThemeToggle />
                  </div>
                  <Link
                    href="admin/new-product"
                    className={`${showBurguer ? "px-3" : "w-0 h-0"}  bg-sky-500 dark:bg-[hsl(41,98%,65%)] rounded-full text-white dark:text-dark3 justify-center items-center flex`}
                  >
                    {loading ? "Cargando..." : <PenLine size={20} />}
                  </Link>
                  <Link
                    href="admin/new-product"
                    className={`${showBurguer ? "px-3" : "w-0 h-0"} hover:brightness-90 text-white px-3 dark:text-dark3 dark:bg-[hsl(41,98%,65%)] rounded-4xl flex text-[14px] text-center justify-center items-center bg-sky-500`}
                    onClick={() => setLoading("new")}
                  >
                    {loading ? "Cargando..." : <Plus size={20}></Plus>}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Buscar..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-stone-900 border border-transparent focus:border-sky-500 rounded-xl text-sm dark:text-white outline-none"
              />
            </div>
            <button
              onClick={openFilters}
              className="relative p-2 border border-gray-200 dark:border-stone-800 rounded-xl bg-white dark:bg-stone-900"
            >
              <SlidersHorizontal size={20} className="dark:text-white" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 dark:bg-[hsl(41,98%,65%)] text-[10px] text-white dark:text-dark3 w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <main className="p-4 space-y-4">
          <h2 className="text-xl font-bold dark:text-white tracking-wider">
            Inventario
          </h2>
          {productosIniciales.length === 0 ? (
            <div className="text-center py-20 text-gray-400 tracking-wider">
              No hay productos.
            </div>
          ) : (
            productosIniciales.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-dark3 rounded-2xl p-4 shadow-sm border border-gray-50 dark:border-stone-800"
              >
                <div className="flex gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={p.image_url || "https://placehold.co/80x80"}
                      className="w-20 h-20 rounded-xl object-cover"
                      alt=""
                    />
                    {p.badge_label && (
                      <span className="absolute -top-2 -left-2 bg-sky-500 dark:bg-[hsl(41,98%,45%)] text-white text-[9px] px-2 py-0.5 rounded-lg">
                        {p.badge_label}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-800 dark:text-gray-100 truncate tracking-wide">
                        {p.title}
                      </h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          p.product_states?.name === "Activo"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.product_states?.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-stone-800">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Categoría
                    </p>
                    <p className="text-xs font-medium dark:text-gray-200">
                      {p.product_categories?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Material
                    </p>
                    <p className="text-xs font-medium dark:text-gray-200">
                      {p.product_materials?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Dimensiones
                    </p>
                    <p className="text-xs font-medium dark:text-gray-200">
                      {p.length_cm}x{p.width_cm}x{p.height_cm}cm
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Colores
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.colores?.map((c) => (
                        <div
                          key={c.colors.name}
                          className="w-3 h-3 rounded-full border border-gray-200"
                          style={{ backgroundColor: `#${c.colors.hex_code}` }}
                          title={c.colors.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
        {showFilters && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowFilters(false);
            }}
          >
            <div className="bg-white dark:bg-dark3 rounded-2xl shadow-xl w-full max-w-md">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 dark:border-stone-700">
                <div>
                  <p className="text-[11px] tracking-widest text-sky-500 dark:text-[hsl(41,98%,65%)] uppercase font-medium">
                    Filtros
                  </p>
                  <h2 className="text-lg font-medium text-gray-800 tracking-wider dark:text-gray-200">
                    Filtrar productos
                  </h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Grupos */}
              <div className="px-6 py-5 flex flex-col gap-5">
                {[
                  {
                    label: "Categoría",
                    options: filterOptions.categories,
                    current: draftCategories,
                    setter: setDraftCategories,
                  },
                  {
                    label: "Material",
                    options: filterOptions.materials,
                    current: draftMaterials,
                    setter: setDraftMaterials,
                  },
                  {
                    label: "Estado",
                    options: filterOptions.states,
                    current: draftStates,
                    setter: setDraftStates,
                  },
                  {
                    label: "Badge",
                    options: filterOptions.badges,
                    current: draftBadges,
                    setter: setDraftBadges,
                  },
                ].map(({ label, options, current, setter }) => (
                  <div key={label}>
                    <p className="text-[11px] tracking-widest text-gray-700 dark:text-gray-200 uppercase mb-2">
                      {label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleDraft(opt, current, setter)}
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer hover:border-sky-400 dark:hover:border-amber-300 ${
                            current.includes(opt)
                              ? "bg-sky-500 border-sky-500 dark:bg-[hsl(41,98%,65%)] dark:border-[hsl(41,98%,65%)] text-white dark:text-dark3 font-medium"
                              : "border-gray-200 dark:border-stone-600 text-gray-600 dark:text-gray-300 hover:border-gray-400"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 pb-5 pt-4 border-t border-gray-100 dark:border-stone-700">
                <button
                  onClick={clearFilters}
                  disabled={activeFiltersCount === 0}
                  className="text-sm flex gap-2 text-gray-700 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-100 cursor-pointer disabled:cursor-auto disabled:opacity-75 dark:disabled:opacity-30 transition-colors"
                >
                  Limpiar filtros
                  <FunnelX className=""></FunnelX>
                </button>
                <button
                  onClick={applyFilters}
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 dark:bg-[hsl(41,98%,65%)] dark:hover:bg-[hsl(41,98%,45%)] dark:text-dark3 text-white text-sm font-medium rounded-xl transition-colors"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="p-4 flex flex-col items-center gap-4 bg-gray-50 dark:bg-dark3 mt-auto">
          <div className="flex gap-2">
            <button
              disabled={currentPage === 0}
              onClick={() => goToPage(currentPage - 1)}
              className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 disabled:opacity-50"
            >
              <ChevronLeft
                className=" text-gray-600 dark:text-white"
                size={20}
              />
            </button>
            <span className="flex items-center px-4 text-sm font-bold dark:text-white">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages - 1}
              onClick={() => goToPage(currentPage + 1)}
              className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-gray-200 dark:border-stone-700 disabled:opacity-50"
            >
              <ChevronRight
                className=" text-gray-600 dark:text-white"
                size={20}
              />
            </button>
          </div>
          <p className="text-[10px] text-gray-400">
            Total: {totalCount} productos
          </p>
        </footer>
      </div>
    </>
  );
}
