import { useState, useEffect, useContext } from "react";
import { ViewDetailsContext } from "../context/ViewDetailsContext";
import ViewDetails from "./ViewDetails";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext";

const ProductCard = ({ index, img, tittle, size }) => {
  const [amount, setAmount] = useState(1);
  const { details, setDetails } = useContext(ViewDetailsContext);
  const { id, setId } = useContext(ViewDetailsContext);
  const { data, setData } = useContext(ViewDetailsContext);
  const { isDark } = useContext(ThemeContext);
  const [order, setOrder] = useState(() => {
    return JSON.parse(localStorage.getItem("products")) || [];
  });
  const handleChange = (e) => {
    setAmount(parseInt(e.target.value));
  };

  const handleViewDetails = () => {
    setDetails(!details);
    setId(index);
    setData({ ...data, img: img, title: tittle, size: size, amount: amount });
  };

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(order));
  }, [order]);

  const orderStorage = () => {
    const local = JSON.parse(localStorage.getItem("products")) || [];
    setOrder([...local]);

    const orderToStorage = {
      img: img,
      title: tittle,
      size: size,
      amount: amount,
    };

    if (isDark) {
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
          p.title === tittle ? { ...p, amount: p.amount + amount } : p
        );
      }

      return [...prev, orderToStorage];
    });
  };

  return (
    <div className="group w-[30vw] h-[75vh] flex flex-col p-4 fadeIn border-2 border-gray-300 rounded-xl hover:border-cyan-500 dark:border-[#111] dark:hover:border-[hsl(41,98%,65%)] transition-colors duration-200 overflow-hidden max-md:w-[95vw] max-md:mx-auto max-md:p-0">
      <div className="overflow-hidden">
        <img
          src={img}
          alt=""
          className={`w-full h-[55vh] object-cover group-hover:scale-105 transition-transform overflow-hidden max-md:w-116 max-md:h-100`}
        />
      </div>
      <div className="max-md:mt-auto max-md:mx-2 max-md:mb-12">
        <h2 className="text-2xl mt-8 dark:text-white">{tittle}</h2>
        <div className="flex justify-between mx-2">
          <p className="text-cyan-500 mt-4 text-2xl dark:text-[hsl(41,98%,51%)]">
            {size} cm
          </p>
          <input
            type="number"
            name="cantidad"
            min="1"
            value={amount}
            onChange={handleChange}
            className="w-20 border border-gray-300 dark:border-gray-300 dark:text-white dark:focus:ring-[hsl(41,98%,51%)] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <button
            className="col-span-2 bg-cyan-500 dark:bg-[hsl(41,98%,51%)] dark:hover:text-[hsl(41,98%,51%)] dark:hover:bg-[#333] dark:hover:border-[hsl(41,98%,51%)] text-white rounded-2xl py-2 cursor-pointer hover:bg-white hover:text-cyan-500 hover:border-1 hover:border-cyan-500 transition-colors duration-300"
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

      {details && id === index && <ViewDetails order={orderStorage}></ViewDetails>}
    </div>
  );
};

export default ProductCard;
