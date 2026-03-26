"use client";
import { useState, useEffect, useContext, useRef } from "react";
import { ViewDetailsContext } from "../../app/providers/event-details-provider";
import ViewDetails from "./ViewDetails";
import Swal from "sweetalert2";
import { useTheme } from "next-themes";

const MIN = 1;
const MAX = 200;

const ProductCard = ({ index, img, tittle, size }) => {
  const [value, setValue] = useState(1);
  const { details, setDetails } = useContext(ViewDetailsContext);
  const { id, setId } = useContext(ViewDetailsContext);
  const { data, setData } = useContext(ViewDetailsContext);
  const { resolvedTheme } = useTheme();
  const spanRef = useRef<HTMLSpanElement>(null);

  const [order, setOrder] = useState(() => {
    return JSON.parse(localStorage.getItem("products")) || [];
  });

  const set = (next: number) => {
    const clamped = Math.min(MAX, Math.max(MIN, next));
    setValue(clamped);
    if (spanRef.current) spanRef.current.textContent = String(clamped);
  };

  const handleBlur = () => {
    const raw = Number(spanRef.current?.textContent ?? value);
    set(isNaN(raw) ? value : raw);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      spanRef.current?.blur();
    }
    if (
      !/[\d]/.test(e.key) &&
      !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const handleViewDetails = () => {
    setDetails(!details);
    setId(index);
    setData({ ...data, img, title: tittle, size, amount: value });
  };

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(order));
  }, [order]);

  const orderStorage = () => {
    const orderToStorage = { img, title: tittle, size, amount: value };

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
          p.title === tittle ? { ...p, amount: p.amount + value } : p,
        );
      }
      return [...prev, orderToStorage];
    });
  };

  return (
    <div className="group w-[30vw] h-[85vh] flex flex-col pb-4 fadeIn rounded-xl shadow-2xl transition-colors duration-200 overflow-hidden max-md:w-[95vw] max-md:mx-auto max-md:p-0">
      <div className="overflow-hidden">
        <img
          src={img}
          alt=""
          className="w-full h-[55vh] object-cover group-hover:scale-105 transition-transform overflow-hidden max-md:w-116 max-md:h-100"
        />
      </div>
      <div className="max-md:mt-auto max-md:mx-2 max-md:mb-12 px-4">
        <p className="text-2xl mt-8 dark:text-white font-bold">{tittle}</p>
        <div className="flex justify-between items-center">
          <p className="text-cyan-500 text-xl dark:text-[hsl(41,98%,51%)]">
            {size} cm
          </p>

          <div className="flex items-center justify-between bg-black/5 rounded-full px-5 py-3 w-64 shadow-md">
            <span className="text-xs font-semibold tracking-widest uppercase text-gray-900">
              Cantidad
            </span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => set(value - 1)}
                disabled={value <= MIN}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 text-xl font-light hover:bg-gray-100 hover:text-gray-900 active:scale-90 disabled:opacity-30 transition-all"
              >
                −
              </button>
              <span
                ref={spanRef}
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="text-base font-medium text-gray-900 w-6 text-center outline-none cursor-text"
              >
                {value}
              </span>
              <button
                onClick={() => set(value + 1)}
                disabled={value >= MAX}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 text-xl font-light hover:bg-gray-100 hover:text-gray-900 active:scale-90 disabled:opacity-30 transition-all"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:mt-12 w-[80%] mx-auto ">
          <button
            className=" bg-cyan-500 border dark:bg-[hsl(41,98%,51%)] dark:hover:text-[hsl(41,98%,51%)] dark:hover:bg-[#333] dark:hover:border-[hsl(41,98%,51%)] text-white rounded-2xl py-2 cursor-pointer hover:bg-cyan-200 hover:text-cyan-6  00  hover:border-cyan-500 transition-colors duration-300"
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
