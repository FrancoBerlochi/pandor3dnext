"use client"
import Link from "next/link";
import { topCero } from "../lib/index";
import { ArrowRight, LayoutGridIcon } from "lucide-react";
export default function NotFound() {
  return (
    <div className="flex max-md:flex-col gap-12 w-screen h-screen justify-center items-center">
      <div className="flex flex-col gap-2 max-md:w-[95vw]">
        <p className="bg-blue-100 w-fit rounded-2xl px-2 py-0.5 text-sky-300 dark:text-white dark:bg-[hsl(41,98%,55%)] font-bold mb-2">
          Inovación Detenida
        </p>
        <h1 className="text-6xl max-md:text-3xl">Error de impresión:</h1>
        <h2 className="text-sky-500 text-5xl max-md:text-2xl dark:text-[hsl(35,100%,50%)] w-40">
          Capa no encontrada
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-xl max-md:text-[1rem] w-110 max-md:w-fit">
          Parece que el objeto que buscas no existe o la ruta falló. Volvé al
          inicio o explorá nuestros productos
        </p>
        <div className="flex gap-6 mt-2">
          <Link
            href="/"
            className="flex gap-3 p-3 max-md:gap-2 bg-sky-500 hover:bg-sky-600 dark:bg-[hsl(35,100%,50%)] dark:hover:bg-[hsl(35,100%,60%)] rounded-3xl text-white"
            onClick={topCero}
          >
            Volver al inicio
            <ArrowRight></ArrowRight>
          </Link>
          <Link
            href="/productos"
            className="flex gap-3 p-3 max-md:gap-2 bg-sky-500 hover:bg-sky-600 dark:bg-[hsl(35,100%,50%)] dark:hover:bg-[hsl(35,100%,60%)] rounded-3xl text-white"
            onClick={topCero}
          >
            Productos
            <LayoutGridIcon></LayoutGridIcon>
          </Link>
        </div>
      </div>
      <div className="relative flex justify-center items-center">
        <div className="absolute -bottom-8  md:-bottom-12 md:-left-12 select-none">
          <div className="relative group">
            <h2 className="text-[120px] md:text-[240px] font-black leading-none tracking-wider opacity-10">
              404
            </h2>
            <h2 className="absolute top-0 -left-2 text-[120px] md:text-[240px] font-black leading-none tracking-wider text-blue-300 dark:text-[hsl(35,100%,80%)]">
              404
            </h2>
            <h2 className="absolute top-0 left-0 text-[120px] md:text-[240px] font-black leading-none tracking-wider text-sky-500 dark:text-[hsl(35,100%,50%)]">
              404
            </h2>
          </div>
        </div>
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCWmBkl_3Dl0kSz6ATHTUMAret_EA9eCroEvmg71Kw0AQG1R_15EHJg4TtL4xKCbbKn7k6QHKoBou2F0wgaOIIQHnaR8qptXt3UDbzbOzYAJrYKJo2ut1odhLcZv9gSyhJx907KmX0BIUxPcCZZlMpmCj5lH4P0JCXwsUQB8FtW1GPr9_qgFtnY1PqGu0k13PiqWwG0erFKTZG13JGm3qj5MeWDu6L2KBrOlXvTeZApO24_RUhudXCwDF7TO4j1uVgivqWwskmgwjOD"
          alt=""
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
