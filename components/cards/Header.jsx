"use client"
import Link  from "next/link";
import logo from "@/public/logo.jpg";
import darkLogo from "@/public/logoDark.png";
import { topCero } from "../../lib/index";
import {ThemeToggle} from "../ui/theme-toggle";
import { useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Header = () => {
  const { resolvedTheme } = useTheme();
  const [menu, setMenu] = useState(false)
  

  const handleMenu = () => setMenu(!menu)

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menu);
    return () => document.body.classList.remove("no-scroll");
  },[menu])

  return (
    <header className="dark:bg-[#3a3a3a] dark:text-white dark:fadeIn dark:transition-all dark:duration-100 flex justify-between py-3 dark:border-gray-800 border-b-1 border-gray-300 items-center fadeIn fixed w-full bg-white z-20 max-md:pr-4">
      <div className="gap-2 flex ml-8 items-center max-md:ml-4">
        <a href="#inicio" className="w-[3vw] logo max-md:w-[15vw]">
          <img src={resolvedTheme === "dark" ? darkLogo.src : logo.src} alt="Logo" />
        </a>
        <a
          href="#inicio"
          className="text-2xl font-semibold pandor hover:opacity-70 max-md:hidden"
        >
          Pandor3D
        </a>
      </div>
      <button className="hidden max-md:block" onClick={handleMenu}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-menu-icon lucide-menu"
        >
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
        </svg>
      </button>
      <nav
        className={`flex ${
          menu ? "max-md:h-screen" : "max-md:h-0 max-md:w-0 lg:hidden"
        } z-30 absolute bg-[#c7ecf7] text-blue-800 dark:text-white dark:bg-[#333] translate-y-[45vh] w-screen items-center flex-col justify-center text-6xl gap-16 transition-all duration-300 pb-6`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`${
            menu
              ? "max-md:h-fit max-md:translate-x-[40vw] max-md:translate-[5vw]"
              : "max-md:h-0"
          } transition-all duration-300`}
          onClick={handleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${
              menu ? "max-md:h-fit " : "max-md:h-0 "
            } transition-all duration-300`}
          >
            <path d="M4 5h16" />
            <path d="M4 12h16" />
            <path d="M4 19h16" />
          </svg>
        </button>
        <Link
          href="/"
          className={`${
            menu
              ? "max-md:h-fit max-md:text-6xl"
              : "max-md:h-0 max-md:text-[0px]"
          } transition-all duration-300`}
          onClick={topCero}
        >
          Inicio
        </Link>
        <Link
          href="/productos"
          className={`${
            menu
              ? "max-md:h-fit max-md:text-6xl"
              : "max-md:h-0 max-md:text-[0px]"
          } transition-all duration-300`}
          onClick={topCero}
        >
          Productos
        </Link>
        <Link
          href="/personalizar"
          className={`${
            menu
              ? "max-md:h-fit max-md:text-6xl"
              : "max-md:h-0 max-md:text-[0px]"
          } transition-all duration-300`}
          onClick={topCero}
        >
          Personalizar
        </Link>
        <Link
          href="/pedidos"
          onClick={topCero}
          className={`${
            menu
              ? "max-md:h-fit max-md:text-6xl"
              : "max-md:h-0 max-md:text-[0px]"
          } transition-all duration-300`}
        >
          Pedidos
        </Link>
        <Link
          href="/contacto"
          onClick={topCero}
          className={`${
            menu
              ? "max-md:h-fit max-md:text-6xl"
              : "max-md:h-0 max-md:text-[0px]"
          } transition-all duration-300`}
        >
          Contacto
        </Link>
        {menu && <ThemeToggle></ThemeToggle>}
      </nav>
      <nav className="flex gap-10 max-md:hidden items-center">
        <Link href="/" className="anchor relative" onClick={topCero}>
          Inicio
        </Link>
        <Link href="/productos" className="anchor relative" onClick={topCero}>
          Productos
        </Link>
        <Link href="/personalizar" className="anchor relative" onClick={topCero}>
          Personalizar
        </Link>
        <Link href="/pedidos" onClick={topCero} className="anchor relative">
          Pedidos
        </Link>
        <ThemeToggle></ThemeToggle>
      </nav>
      <Link
        href="/contacto"
        className="dark:bg-[hsl(41,95%,50%)] mr-8 bg-cyan-500 text-white py-2 px-4 rounded-xl hover:opacity-90 max-md:hidden"
      >
        Contacto
      </Link>
    </header>
  );
};

export default Header;
