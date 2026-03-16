import Swal from "sweetalert2";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ProductCardOrder = ({ img, title, size, amount, refresh }) => {
  const {isDark} = useContext(ThemeContext)
  const handleDeleteModal = () => {
    if (isDark) {
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
    
  
 

  return (
    <div className="flex border-2 border-gray-300 dark:border-[#111] shadow-md rounded-2xl">
      <img className="w-50 h-50" src={img} alt="" />
      <div className="flex flex-col mt-10 gap-4 ml-4">
        <h2 className="text-xl font-semibold dark:text-white">{title}</h2>
        <p className="text-cyan-500 text-2xl dark:text-[hsl(41,98%,51%)]">
          {size} cm
        </p>
        <div className="flex gap-4 items-center">
          <p className="dark:text-white text-xl">{amount}</p>
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
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-trash2-icon lucide-trash-2"
            >
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCardOrder;
