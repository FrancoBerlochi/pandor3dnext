"use client"
import git from "@/public/github.png";
import HomeCard from "../components/cards/HomeCard";
import Header from "../components/cards/Header";
import { topCero } from "../lib/index";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useContext } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import linke from "@/public/linkedin.png";

const homeCards = [
  {
    id: 1,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-printer-icon lucide-printer text-cyan-500 dark:text-orange-400"
      >
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
        <path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" />
        <rect x="6" y="14" width="12" height="8" rx="1" />
      </svg>
    ),
    tittle: "Alta Calidad",
    text: "Impresiones 3D de alta fidelidad con los mejores materiales de impresión",
  },
  {
    id: 2,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-zap-icon lucide-zap text-cyan-500 dark:text-orange-400"
      >
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
      </svg>
    ),
    tittle: "Entrega Rápida",
    text: "Tiempos de producción optimizados para que recibas tu pedido en tiempo y forma",
  },
  {
    id: 3,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-package-icon lucide-package text-cyan-500 dark:text-orange-400"
      >
        <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
        <path d="M12 22V12" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <path d="m7.5 4.27 9 5.15" />
      </svg>
    ),
    tittle: "Stock Disponible",
    text: "Productos predefinidos o personalizados según tus necesidades",
  },
  {
    id: 4,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-message-circle-icon lucide-message-circle text-cyan-500 dark:text-orange-400"
      >
        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
      </svg>
    ),
    tittle: "Asesoramiento",
    text: "Te ayudamos a elegir el mejor producto para tu proyecto",
  },
];

const HomePage = () => {
  const cardsToShow = homeCards.map((homeCard) => (
    <HomeCard
      key={homeCard.id}
      icon={homeCard.icon}
      tittle={homeCard.tittle}
      text={homeCard.text}
    />
  ));
  
  const { resolvedTheme } = useTheme();

  return (
    <div id="inicio" className="">
      <Header></Header>
      <main className="dark:bg-[#333] pb-20 dark:fadeIn dark:transition-all dark:duration-100">
        <section className="flex justify-between h-[100vh] items-center max-md:justify-center max-md:flex-col">
          <div className="flex flex-col ml-60 h-[50%] justify-center mb-20 logo max-md:ml-0 max-md:mb-10">
            <h1 className="text-8xl font-semibold dark:text-white max-md:text-6xl">
              PANDOR3D
            </h1>
            <div className="w-120 border-l-4 border-[#5bacf6] pl-4 mt-4 dark:border-[hsl(41,98%,51%)] max-md:w-[90vw]">
              <h2 className="text-2xl font-semibold dark:text-white max-md:text-xl">
                Impresiones por stock y a pedido
              </h2>
              <p className="mt-3 text-gray-700 text-xl dark:text-gray-300 max-md:text-[1rem]">
                Contáctame para poder tener esa impresión que deseas al alcance
                de tu mano
              </p>
            </div>
            <div className="flex gap-4 mt-6">
              <Link
                onClick={topCero}
                href="/productos"
                className="py-2 px-6 rounded-2xl bg-[#5bacf6] text-white hover:opacity-90 dark:bg-[hsl(41,98%,51%)]"
              >
                Ver Productos
              </Link>
              <Link
                href="/personalizar"
                className="py-2 px-6 rounded-2xl bg-white text-[#5bacf6] border-1 border-[#5bacf6] hover:brightness-95 dark:bg-[#3a3a3a] dark:border-[hsl(41,98%,51%)] dark:text-[hsl(41,98%,51%)]"
              >
                Personalizar
              </Link>
            </div>
          </div>
          <div className="mr-60 mb-20 lg:pandor dark:bg-orange-400 dark:rounded-[50%] max-md:mr-0">
            <img
              src={""}
              alt=""
              className="max-md:w-[40vw] max-md:h-[40vw ]"
            />
          </div>
        </section>
        <section className="flex flex-col justify-center">
          <h2 className="text-4xl font-semibold mb-16 text-center dark:text-white">
            ¿Por qué elegir PANDOR3D?
          </h2>
          <article className="flex justify-between mx-24 max-md:justify-center max-md:flex-col max-md:mx-0 max-md:items-center max-md:gap-20 ">
            {cardsToShow}
          </article>
        </section>
        <section className="border-2 border-blue-200 dark:border-[hsl(41,98%,70%)] rounded-xl mt-30 flex justify-center mx-auto w-[90vw] shadow-2xs">
          <div className=" flex flex-col justify-center items-center py-16">
            <h2 className="text-4xl font-semibold dark:text-white max-md:text-2xl">
              ¿Tenés un diseño en mente?
            </h2>
            <p className="text-gray-600 text-xl mt-8 dark:text-gray-300 max-md:text-[1.1rem] max-md:text-center">
              Convertimos tus ideas en realidad. Contactanos y hablemos sobre tu
              proyecto personalizado.
            </p>
            <Link
              href="/personalizar"
              className="mt-8 bg-cyan-500 dark:bg-[hsl(41,98%,51%)] text-white rounded-2xl px-4 py-2 hover:opacity-90"
              onClick={topCero}
            >
              Personalizá tu diseño
            </Link>
          </div>
        </section>
      </main>
      <footer className="w-full dark:bg-[#333]">
        <div className="border-1 border-gray-300 flex gap-20 py-12 justify-around pr-100 dark:border-gray-300 max-md:pr-0 max-md:gap-10 max-md:w-full max-md:flex-col ">
          <div className="flex flex-col max-md:ml-4">
            <h3 className="text-xl font-semibold dark:text-white max-md:text-[1.1rem]">
              PANDOR3D
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-md:text-[1rem]">
              impresiones 3D de calidad para dar vida a tus diseños
            </p>
          </div>
          <div className="flex flex-col max-md:ml-4">
            <h3 className="font-semibold dark:text-white max-md:text-[1.1rem]">
              Enlaces
            </h3>
            <Link
              onClick={topCero}
              href="/productos"
              className="text-gray-600 hover:text-cyan-500 hover:opacity-70 dark:text-gray-300 dark:hover:text-[hsl(41,98%,70%)] max-md:text-[1rem]"
            >
              Productos
            </Link>
            <Link
              onClick={topCero}
              href="/personalizar"
              className="text-gray-600 hover:text-cyan-500 hover:opacity-70 dark:text-gray-300 dark:hover:text-[hsl(41,98%,70%)] max-md:text-[1rem]"
            >
              Personalizar
            </Link>
            <Link
              onClick={topCero}
              href="/contacto"
              className="text-gray-600 hover:text-cyan-500 hover:opacity-70 dark:text-gray-300 dark:hover:text-[hsl(41,98%,70%)] max-md:text-[1rem]"
            >
              Contacto
            </Link>
          </div>
          <hr className="max-md:block hidden w-[90vw] mx-auto border-[hsl(41,98%,51%)]" />
          <div className="flex flex-col max-md:text-center">
            <h3 className="font-semibold dark:text-white max-md:text-[1.1rem]">
              Contacto
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Email: pandor3d@gmail.com
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              WhatsApp: +54 numero de sergio
            </p>
          </div>
        </div>
        <div className="flex justify-around">
          <p className="text-center my-6 text-gray-700 dark:text-gray-300 max-md:text-sm">
            © 2025 PANDOR3D. Todos los derechos reservados.
          </p>
          <p className="text-center my-6 text-gray-700 dark:text-gray-300 max-md:text-sm">
            Desarrollado por{" "}
            <span className="dark:text-[hsl(41,98%,51%)]">Franco Berlochi</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
