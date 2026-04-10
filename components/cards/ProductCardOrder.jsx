import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";


const ProductCardOrder = ({ img, title, size, amount, handleAmount,refresh }) => {
  const { resolvedTheme } = useTheme();
  const [amountDetails, setAmountDetail]  = useState(amount)
  const MIN = 1, MAX = 200;

  const handleDeleteModal = () => {
    if (resolvedTheme === "dark") {
      Swal.fire({
        title: "Estás seguro?",
        text: `Vas a eliminar tu pedido de ${title}`,
        icon: "warning",
        iconColor:"#fdaf09",
        color:"white",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#fdaf09",
        cancelButtonColor: "#e33",
        background: "#111",
        confirmButtonText: "Sí, eliminalo!",
      }).then((result) => {
        if (result.isConfirmed) {
          refresh(title);
          Swal.fire({
            title: "Pedido eliminado!",
            text: "Pedido eliminado con éxito",
            confirmButtonColor: "#fdaf09",
            color: "white",
            background:"#111",
            icon: "success",
            iconColor: "#fdaf09",
          });
        }
      });
    } else {
      Swal.fire({
        title: "Estás seguro?",
        text: `Vas a eliminar tu pedido de ${title}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#22d3ee",
        cancelButtonColor: "#e33",
        confirmButtonText: "Sí, eliminalo!",
      }).then((result) => {
        if (result.isConfirmed) {
          refresh(title);
          Swal.fire({
            title: "Pedido eliminado!",
            text: "Pedido eliminado con éxito",
            confirmButtonColor: "#22d3ee",
            icon: "success",
            iconColor: "#21d3dd",
          });
        }
      });
    }
  }

  useEffect(() => { 
     const handleUpdateAmount = () => {
       handleAmount(title, amountDetails);
    }
    handleUpdateAmount()
  },
  [amountDetails])
  
  return (
    <div className="flex border-2 border-gray-300 dark:border-[#111] dark:bg-dark3 shadow-md rounded-2xl">
      <img className="w-50 h-50" src={img} alt="" />
      <div className="flex flex-col mt-4 gap-4 ml-4 mr-auto">
        <p className="text-base text-cyan-500 dark:text-amber-400">
          Categoría:
        </p>
        <p className="text-xl font-semibold dark:text-white">{title}</p>
        <p className="text-base text-gray-600 w-62 dark:text-gray-200">
          material
        </p>
        <p className="text-cyan-500 text-base dark:text-[hsl(41,98%,51%)]">
          {size} cm
        </p>
      </div>
      <div className="flex flex-col justify-center gap-4 items-center">
        <div className="">
          Color seleccionado:{" "}
          <div className="w-6 h-6 bg-blue-600 rounded-md"></div>
        </div>
        <div className="flex items-center">
          <div className="flex  bg-black/5 rounded-full px-5 py-3  shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setAmountDetail(amountDetails - 1);
                }}
                disabled={amountDetails <= MIN}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-600 hover:text-gray-100 dark:text-gray-400 text-xl font-light dark:hover:bg-gray-100 dark:hover:text-gray-900 active:scale-90 disabled:opacity-30 transition-all"
              >
                −
              </button>

              <input
                type="number"
                min={MIN}
                max={MAX}
                value={amountDetails}
                onChange={(e) => {
                  setAmountDetail(Number(e.target.value));
                }}
                className="w-8 text-center text-base font-medium text-gray-900 dark:text-gray-200 bg-transparent border-none outline-none
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />

              <button
                onClick={() => {
                  setAmountDetail(amountDetails + 1);
                }}
                disabled={amountDetails >= MAX}
                className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-600 hover:text-gray-100 dark:text-gray-400 text-xl font-light dark:hover:bg-gray-100 dark:hover:text-gray-900 active:scale-90 disabled:opacity-30 transition-all"
              >
                +
              </button>
            </div>
          </div>
          <button
            onClick={handleDeleteModal}
            className="flex gap-2 py-2 px-4 text-red-400 hover:text-red-600 cursor-pointer"
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
              class="lucide lucide-trash2-icon lucide-trash-2"
            >
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCardOrder;
