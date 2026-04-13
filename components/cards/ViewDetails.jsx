"use client"
import { useContext, useEffect, useRef } from "react";
import { ViewDetailsContext } from "../../app/providers/event-details-provider";
import { ShoppingCart} from "lucide-react";
const ViewDetails = ({ order }) => {
  const { details, setDetails } = useContext(ViewDetailsContext);
  const { data } = useContext(ViewDetailsContext);
  const { amount, setAmount } = useContext(ViewDetailsContext); 
  const handleOpen = () => setDetails(!details);

  const spanRef = useRef<HTMLSpanElement>(null);

  const MIN = 1, MAX = 200;

  const set = (next) => {
    const clamped = Math.min(MAX, Math.max(MIN, next));
    setAmount(clamped);
    if (spanRef.current) spanRef.current.textContent = String(clamped);
  };

  // const handleBlur = () => {
  //   const raw = Number(spanRef.current?.textContent ?? amount);
  //   set(isNaN(raw) ? amount : raw);
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") { e.preventDefault(); spanRef.current?.blur(); }
  //   if (!/[\d]/.test(e.key) && !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)) {
  //     e.preventDefault();
  //   }
  // };

   useEffect(() => {
     if (spanRef.current && spanRef.current.textContent !== String(amount)) {
       spanRef.current.textContent = String(amount);
     }
   }, [amount]);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", details);
    return () => document.body.classList.remove("no-scroll");
  }, [details]);


  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-20 "
      onClick={handleOpen}
    >
      <div
        className="relative flex rounded-xl bg-white  dark:bg-dark2 w-[75vw] h-[80vh] max-md:w-[100vw] max-md:h-[100vh] max-md:flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 w-9 h-9 text-center flex max-md:pb-1 justify-center items-center text-black hover:bg-gray-200 text-2xl bg-gray-100  rounded-3xl cursor-pointer"
          onClick={handleOpen}
        >
          x
        </button>
        <div className="w-full flex items-center max-md:h-[45vh] max-md:  justify-center bg-gray-200 dark:bg-dark1">
          <img
            src={data.img}
            className="w-[85%] h-[60vh] max-md:h-[80%] max-md:w-[90%] max-md:object-cover   bg-white object-cover  rounded-xl"
            alt="producto"
          />
        </div>

        <div className="flex flex-col mt-20 ml-10 mr-20 dark:text-white max-md:ml-5 max-md:mr-0 max-md:mt-2">
          <p className="text-cyan-400 font-bold max-md:text-[12px] dark:text-[hsl(36,100%,50%)]">
            CATEGORÍA: {data.category}
          </p>
          <h3 className="text-6xl tracking-wide mb-8 max-md:mt-2 font-semibold max-md:mb-4 w-60 max-md:text-4xl">
            {data.title}
          </h3>
          <div className="flex gap-8 max-md:mb-4">
            <div className="flex flex-col ">
              <p className="text-gray-600 dark:text-gray-300 max-md:text-[12px]">
                DIMENSIONES
              </p>
              <p className="text-2xl text-cyan-500 max-md:text-base dark:text-[hsl(41,98%,51%)] ">
                {data.size} cm
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 dark:text-gray-300 max-md:text-[12px]">
                MATERIAL
              </p>
              <p className="text-2xl text-cyan-500 max-md:text-base dark:text-[hsl(41,98%,51%)]">
                {data.material}
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-600 dark:text-gray-300 max-md:text-[12px]">
              COLORES DISPONIBLES:
            </p>
            <ul className="flex gap-2 mt-1">
              {data.colores.map((c) => (
                <li
                  key={c.colors.name}
                  className={`w-8 h-8 max-md:w-6 max-md:h-6 rounded-md`}
                  style={{ backgroundColor: `#${c.colors.hex_code}` }}
                ></li>
              ))}
            </ul>
          </div>

          <p className="text-[18px] max-md:text-[0.9rem] mt-12  max-md:mt-4  max-md:w-fit max-md:pr-2 w-100 break-all">
            {data.description}
          </p>
          <div className="flex max-md:mt-6 lg:mt-16 max-md:gap-2 max-md:justify-around max-md:items-center max-md:mr-4 max-md:mb-3 lg:gap-4 items-center">
            {/* Mini input cantidad */}
            <div className="flex items-center justify-between max-md:justify-center bg-black/5 rounded-full px-5 py-3 max-md:w-32 w-64 shadow-md">
              <span className="max-md:hidden text-xs font-semibold tracking-widest uppercase text-gray-900 dark:text-white">
                Cantidad
              </span>
              <div className="flex items-center gap-3 ">
                <button
                  onClick={() => set(amount - 1)}
                  disabled={amount <= MIN}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-gray-500 dark:text-gray-300 text-xl font-light hover:bg-gray-100 dark:hover:text-gray-700 hover:text-gray-900 active:scale-90 disabled:opacity-30 transition-all"
                >
                  −
                </button>

                <input
                  type="number"
                  min={MIN}
                  max={MAX}
                  value={amount}
                  onChange={(e) => set(Number(e.target.value))}
                  className="w-8 text-center text-base font-medium text-gray-900 dark:text-gray-200 bg-transparent border-none outline-none
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                  onClick={() => set(amount + 1)}
                  disabled={amount >= MAX}
                  className="w-7 h-7 flex items-center justify-center rounded-full dark:text-gray-300 text-gray-500 text-xl font-light hover:bg-gray-100 dark:hover:text-gray-700 hover:text-gray-900 active:scale-90 disabled:opacity-30 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botón agregar */}
            <button
              className="flex items-center text-white gap-2 px-6 py-2 bg-cyan-500 dark:bg-[hsl(36,100%,50%)] dark:text-black lg:w-[10vw] lg:mb-0 hover:bg-cyan-600 cursor-pointer text-xl max-md:text-[1rem] max-md:p-2 rounded-4xl"
              onClick={order}
            >
              <ShoppingCart className="w-6 h-6 max-md:w-8 max-md:h-8" />
              Añadir al Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
