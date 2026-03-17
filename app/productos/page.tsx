"use client"
import Header from "../../components/cards/Header";
import { useState } from "react";
import ProductCard from "../../components/cards/ProductCard";
import  Link from "next/link";
import { topCero } from "../../lib/index";

const Products = () => {
  const products = [
    {
      id: 1,
      img: "src/assets/rex.jpg",
      tittle: "T-Rex esqueleto",
      size: "20 x 50",
    },
    {
      id: 2,
      img: "url",
      tittle: "Peppa Pig",
      size: "40 x 50",
    },
    {
      id: 3,
      img: "url",
      tittle: "Steve (Minecraft)",
      size: "",
    },
    {
      id: 4,
      img: "url",
      tittle: "Goku (Dragon Ball Z)",
      size: "",
    },
    {
      id: 5,
      img: "url",
      tittle: "Maceta Geométrica",
      size: "",
    },
    {
      id: 6,
      img: "url",
      tittle: "f",
      size: "",
    },
    {
      id: 7,
      img: "url",
      tittle: "g",
      size: "",
    },
    {
      id: 8,
      img: "url",
      tittle: "h",
      size: "",
    },
    {
      id: 9,
      img: "url",
      tittle: "i",
      size: "",
    },
    {
      id: 10,
      img: "",
      tittle: "j",
      size: "",
    },
  ];

  const handleCharge = () => {
    setCount((prev) => prev + 3);
    setTimeout(() => {
      window.scrollBy({
        top: 300,
        behavior: "smooth",
      });
    }, 100);
  };

  const [count, setCount] = useState(6);

  return (
    <div id="inicio">
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
        <div className="grid grid-cols-3 gap-4 mx-12 max-md:grid-cols-1 max-md:mx-0">
          {products.slice(0, count).map((prod) => (
            <ProductCard
              key={prod.id}
              index={prod.id}
              img={prod.img}
              tittle={prod.tittle}
              size={prod.size}
            />
          ))}
        </div>
        {count < products.length && (
          <div className="flex justify-center mt-12">
            <button
              className="px-4 py-2 rounded-2xl bg-orange-400 dark:bg-cyan-500 text-white hover:opacity-80 cursor-pointer"
              onClick={handleCharge}
            >
              Cargar más
            </button>
          </div>
        )}
        <section className="border-2 border-blue-200 dark:border-[hsl(41,98%,71%)] dark:text-white rounded-xl mt-40 flex justify-center mx-auto w-[90vw] shadow-2xs">
          <div className=" flex flex-col justify-center items-center py-16">
            <h2 className="text-4xl font-semibold max-md:text-[1.4rem]">
              ¿No encontrás lo que buscás?
            </h2>
            <p className="text-gray-600 text-xl mt-8 w-220 text-center dark:text-gray-300 max-md:text-[1rem] max-md:w-fit">
              Podemos imprimir cualquier diseño que tengas en mente. Contactanos
              para un presupuesto personalizado
            </p>
            <Link
              href="/personalizar"
              className="mt-8 bg-cyan-500 dark:bg-[hsl(41,98%,51%)] text-white rounded-2xl px-4 py-2 hover:opacity-90"
              onClick={topCero}
            >
              Solicitá tu diseño
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Products;
