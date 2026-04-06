"use client";
import Link from "next/link";
import { useState } from "react";
import { PenLine} from "lucide-react"
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
  height_cm: number | null;
  product_categories: { name: string } | null;
  product_materials: { name: string } | null;
  product_states: { name: string } | null;
  colores: ColorRelation[];
  badge_label: string | null;
}

interface AdminDashboardProps {
  productosIniciales: Producto[];
}

export default function AdminDashboard({ productosIniciales }: AdminDashboardProps) {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");
  const filtrados = productosIniciales.filter((p) => {
    const query = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.product_categories?.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full">
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
            <div className=" ml-32 lg:w-[40%]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                id="search-input"
                className="border border-gray-100 shadow-md dark:shadow-[#111] dark:border-stone-800 h-10 px-4 rounded-2xl w-full dark:bg-stone-900 dark:text-white"
                placeholder="🔍 Buscar inventario..."
              />
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
        <article className="w-[98%] bg-white dark:bg-dark3 mt-4 shadow-2xs">
          <p className="my-4 ml-4 text-xl font-semibold">Catálogo Activo</p>
          <ul className="flex justify-between bg-gray-400/15 dark:text-white mx-6 items-center mt-2 text-sm font-semibold text-gray-600  p-2">
            <li className="w-12">Img</li>
            <li className="w-32">Título</li>
            <li className="w-48">Descripción</li>
            <li className="w-24">Categoría</li>
            <li className="w-20">Material</li>
            <li className="w-16">Tamaño</li>
            <li className="w-28">Colores</li>
            <li className="w-16">Estado</li>
          </ul>

          <div className="flex flex-col mx-6">
            {filtrados.length === 0 ? (
              <p className="text-center text-gray-400 py-8 dark:text-gray-200">
                No se encontraron productos.
              </p>
            ) : (
              filtrados.map((p) => (
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
                    <div className="absolute top-1 letf-1 text-[9px] text-white bg-sky-500 rounded-md">
                      {p.badge_label}
                    </div>
                  </li>
                  <li className="w-32 font-medium text-gray-800 dark:text-gray-100">{p.title}</li>
                  <li className="w-48 text-gray-500 line-clamp-2 dark:text-gray-100">
                    {p.description}
                  </li>
                  <li className="w-24 text-gray-600 dark:text-gray-100">
                    {p.product_categories?.name}
                  </li>
                  <li className="w-20 text-gray-600 dark:text-gray-100">
                    {p.product_materials?.name}
                  </li>
                  <li className="w-16 text-gray-600 dark:text-gray-100">{p.height_cm}cm</li>

                  {/* Mapeo de colores (basado en la relación intermedia) */}
                  <li className="w-28 flex flex-wrap gap-1">
                    {p.colores?.map((item) => (
                      <span
                        key={item.colors.name}
                        className="text-white text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#" + item.colors.hex_code }}
                      >
                        {item.colors.name}
                      </span>
                    ))}
                  </li>

                  <li className="w-16">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.product_states?.name === "Activo"
                          ? "bg-green-100 text-green-700 dark:text-white dark:bg-green-700"
                          : "bg-red-100 text-red-600 dark:text-white dark:bg-red-600"
                      }`}
                    >
                      {p.product_states?.name}
                    </span>
                  </li>
                </ul>
              ))
            )}
          </div>
          <section></section>
        </article>
      </section>
    </div>
  );
}
