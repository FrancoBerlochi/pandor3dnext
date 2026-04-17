"use client";
import { useState, useEffect, useContext } from "react";
import { ViewDetailsContext } from "../../app/providers/event-details-provider";
import ViewDetails from "./ViewDetails";
import Swal from "sweetalert2";
import { useTheme } from "next-themes";

const MIN = 1;
const MAX = 200;

type ColorRelation = {
  colors: { name: string; hex_code: string };
};


const ProductCard = ({
  index,
  img,
  tittle,
  size,
  description,
  category,
  material,
  colores,
  estado,
}: {
  index: string;
  img: string;
  tittle: string;
  size: string;
  description: string | null;
  category: string | null;
  material: string | null;
  colores: ColorRelation[];
  estado: string | null;
}) => {
  const { amount, setAmount } = useContext(ViewDetailsContext);
  const { details, setDetails } = useContext(ViewDetailsContext);
  const { id, setId } = useContext(ViewDetailsContext);
  const { data, setData } = useContext(ViewDetailsContext);
  const { resolvedTheme } = useTheme();

  const [order, setOrder] = useState(() => {
    return JSON.parse(localStorage.getItem("products") || "[]");
  });

  const set = (next: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, next));
    setAmount(clamped);
  };

  const handleViewDetails = () => {
    setDetails(!details);
    setId(index);
    setData({
      ...data,
      img,
      title: tittle,
      size,
      amount,
      description,
      category,
      material,
      colores,
    });
  };

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(order));
  }, [order]);

  const orderStorage = () => {
    const orderToStorage = {
      img,
      title: tittle,
      size,
      amount,
      description,
      category,
      material,
      colores,
    };

    if (resolvedTheme === "dark") {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Pedido Guardado",
        color: "#fff",
        showConfirmButton: false,
        background: "#111",
        iconColor: "#fdaf08",
        timer: 1500,
      });
    } else {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Pedido Guardado",
        showConfirmButton: false,
        iconColor: "#21d3dd",
        timer: 1500,
      });
    }

    setOrder((prev) => {
      const existing = prev.find((p) => p.title === tittle);
      if (existing) {
        return prev.map((p) =>
          p.title === tittle ? { ...p, amount: p.amount + amount } : p,
        );
      }
      return [...prev, orderToStorage];
    });
  };

  const inactive = estado === "Inactivo";

  return (
    <div
      className={`group w-[30vw] h-[85vh] flex flex-col pb-4 fadeIn rounded-xl shadow-2xl transition-colors duration-200 overflow-hidden max-md:w-[95vw] max-md:mx-auto max-md:p-0 relative ${inactive ? "opacity-60 grayscale pointer-events-none" : ""}`}
    >
      {/* Badge desactivado */}
      {inactive && (
        <div className="absolute top-3 left-3 z-20 bg-red-500 text-white text-[10px] font-semibold px-2 py-1 rounded-md tracking-wide uppercase">
          No disponible
        </div>
      )}

      <div className="overflow-hidden">
        <img
          src={img}
          alt={tittle}
          className="w-full h-[55vh] object-cover group-hover:scale-105 transition-transform overflow-hidden max-md:w-116 max-md:h-100"
        />
      </div>

      <div className="max-md:mt-auto max-md:mx-2 max-md:mb-12 px-4">
        <div className="flex justify-between mt-8">
          <div className="flex flex-col">
            {category && (
              <p className="text-xs text-sky-400 dark:text-[hsl(41,98%,51%)] tracking-widest uppercase mb-1">
                {category}
              </p>
            )}
            <p className="text-2xl dark:text-white font-bold">{tittle}</p>
            <div className="flex gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
              {size && <span>{size} cm</span>}
              {material && <span>· {material}</span>}
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">
              Colores
            </p>
            <ul className="flex gap-1.5 mt-1 flex-wrap justify-end max-w-[120px]">
              {colores?.length > 0 ? (
                colores.map((item) => (
                  <li
                    key={item.colors.name}
                    title={item.colors.name}
                    className="w-6 h-6 rounded-full border border-gray-200 dark:border-black"
                    style={{ backgroundColor: `#${item.colors.hex_code}` }}
                  />
                ))
              ) : (
                <li className="text-xs text-gray-400">-</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 bg-black/5 rounded-full px-5 py-3 w-64 shadow-md mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-gray-900 dark:text-white">
            Cantidad
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => set(amount - 1)}
              disabled={amount <= MIN}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 text-xl font-light hover:bg-gray-100 hover:text-gray-900 active:scale-90 disabled:opacity-30 transition-all"
            >
              −
            </button>
            <input
              type="number"
              min={MIN}
              max={MAX}
              value={amount}
              onChange={(e) => set(Number(e.target.value))}
              className="w-8 text-center text-base font-medium text-gray-900 dark:text-gray-300 bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => set(amount + 1)}
              disabled={amount >= MAX}
              className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 text-xl font-light hover:bg-gray-100 hover:text-gray-900 active:scale-90 disabled:opacity-30 transition-all"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:mt-6 w-[80%] mx-auto">
          <button
            className="bg-cyan-500 border dark:border-black dark:bg-[hsl(41,98%,51%)] dark:hover:text-[hsl(41,98%,51%)] dark:hover:bg-[#333] dark:hover:border-[hsl(41,98%,51%)] text-white rounded-2xl py-2 cursor-pointer hover:bg-cyan-200 hover:text-cyan-600 hover:border-cyan-500 transition-colors duration-300"
            onClick={orderStorage}
          >
            Agregar Pedido
          </button>
          <button
            onClick={handleViewDetails}
            className="border-1 border-cyan-500 text-cyan-500 rounded-2xl dark:text-[hsl(41,98%,51%)] dark:border-[hsl(41,98%,51%)] dark:hover:text-[hsl(41,98%,51%)] dark:hover:bg-[#111] py-2 cursor-pointer hover:bg-cyan-200 hover:text-cyan-700 transition-colors duration-300"
          >
            Ver Detalles
          </button>
        </div>
      </div>

      {details && id === index && <ViewDetails order={orderStorage} />}
    </div>
  );
};


export default ProductCard;