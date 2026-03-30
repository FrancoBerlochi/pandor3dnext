"use client";
import { Archive } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  return (
    <div className="w-full">
      <section className="w-full bg-white py-4 shadow-2xs flex">
        <div className="flex flex-col ml-4">
          <div className="">PANDOR3D</div>
          <p className="text-sky-500">Panel de Administrador</p>
        </div>
        <div className="w-full ml-32 lg:w-[40%]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            id="search-input"
            className="border border-gray-100 @max-xs:h-9 shadow-md dark:shadow-[#111] dark:border-stone-800 h-10 px-4 rounded-2xl w-full dark:bg-stone-900 dark:text-white"
            placeholder="🔍 Buscar inventario..."
          />
        </div>
      </section>
      <section>
        <h1>Crear Nuevo Producto</h1>
      </section>
    </div>
  );
}
