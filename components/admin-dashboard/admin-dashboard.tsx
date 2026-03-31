"use client";
import Link from "next/link";
import { useState } from "react";

const productos = [
  {
    id: 1,
    img: "https://placehold.co/48x48",
    titulo: "Figura Dragon",
    descripcion: "Figura impresa en resina de alta calidad",
    categoria: "Figuras",
    material: "Resina",
    tamaño: "15cm",
    colores: ["Rojo", "Negro"],
    estado: "Activo",
  },
  {
    id: 2,
    img: "https://placehold.co/48x48",
    titulo: "Soporte Celular",
    descripcion: "Soporte de escritorio articulado",
    categoria: "Accesorios",
    material: "PLA",
    tamaño: "10cm",
    colores: ["Blanco"],
    estado: "Activo",
  },
  {
    id: 3,
    img: "https://placehold.co/48x48",
    titulo: "Maceta Geométrica",
    descripcion: "Maceta con diseño hexagonal moderno",
    categoria: "Decoración",
    material: "PETG",
    tamaño: "12cm",
    colores: ["Verde", "Gris"],
    estado: "Inactivo",
  },
  {
    id: 4,
    img: "https://placehold.co/48x48",
    titulo: "Llavero Robot",
    descripcion: "Llavero articulado con forma de robot",
    categoria: "Llaveros",
    material: "PLA",
    tamaño: "5cm",
    colores: ["Azul", "Plateado"],
    estado: "Activo",
  },
  {
    id: 5,
    img: "https://placehold.co/48x48",
    titulo: "Caja Organizadora",
    descripcion: "Caja con compartimentos para escritorio",
    categoria: "Organización",
    material: "ABS",
    tamaño: "20cm",
    colores: ["Negro"],
    estado: "Activo",
  },
];

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
}

interface AdminDashboardProps {
  productosIniciales: Producto[];
}

export default function AdminDashboard({ productosIniciales }: AdminDashboardProps) {
  const [search, setSearch] = useState("");
  console.log(productosIniciales)

  const filtrados = productosIniciales.filter((p) => {
    const query = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.product_categories?.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full">
      <section className="w-full bg-white py-4 shadow-2xs flex">
        <div className="flex w-full justify-between">
          <div className="flex w-320">
            <div className="flex-col ml-4">
              <div className="">PANDOR3D</div>
              <p className="text-sky-500">Panel de Administrador</p>
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
          <Link
            href="admin/new-product"
            className="p-2 px-4 mr-4 text-white rounded-2xl flex items-center bg-sky-500"
          >
            Nuevo Producto
          </Link>
        </div>
      </section>

      <section className="flex flex-col items-center">
        <h1 className="text-center w-full text-6xl mt-12">
          Lista De Productos
        </h1>
        <article className="w-full bg-white mt-4">
          <p className="my-4 ml-4 text-xl font-medium">Catalogo Activo</p>
          <ul className="flex justify-between bg-gray-400/15 mx-6 items-center mt-2 text-sm font-semibold text-gray-600  p-2">
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
              <p className="text-center text-gray-400 py-8">
                No se encontraron productos.
              </p>
            ) : (
              filtrados.map((p) => (
                <ul
                  key={p.id}
                  className="flex justify-between items-center py-3 text-sm"
                >
                  <li className="w-16">
                    <img
                      src={p.image_url || "https://placehold.co/48x48"}
                      alt={p.title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  </li>
                  <li className="w-32 font-medium text-gray-800">{p.title}</li>
                  <li className="w-48 text-gray-500 line-clamp-2">
                    {p.description}
                  </li>
                  <li className="w-24 text-gray-600">
                    {p.product_categories?.name}
                  </li>
                  <li className="w-20 text-gray-600">
                    {p.product_materials?.name}
                  </li>
                  <li className="w-16 text-gray-600">{p.height_cm}cm</li>

                  {/* Mapeo de colores (basado en la relación intermedia) */}
                  <li className="w-28 flex flex-wrap gap-1">
                    {p.colores?.map((item) => (
                      <span
                        key={item.colors.name}
                        className="text-white text-[10px] px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: item.colors.hex_code }}
                      >
                        {item.colors.name}
                      </span>
                    ))}
                  </li>

                  <li className="w-16">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.product_states?.name === "Activo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {p.product_states?.name}
                    </span>
                  </li>
                </ul>
              ))
            )}
          </div>
        </article>
      </section>
    </div>
  );
}
