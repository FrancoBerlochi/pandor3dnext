"use client" 
import { useState, useEffect } from "react";
import  Link  from "next/link";
import Header from "../../components/cards/Header";
import OrderSummaryCard from "../../components/cards/OrderSummaryCard";
import ProductCardOrder from "../../components/cards/ProductCardOrder";
import { LayoutGrid } from "lucide-react";
import { useTheme } from "next-themes";
import WhatsApp from "@/components/ui/whatsapp-button";

type ColorRelation = {
  colors: { name: string; hex_code: string };
};

interface OrderItem {
  img: string;
  title: string;
  amount: number;
  description: string;
  category: string;
  material: string;
  colores: ColorRelation[];
  size: number;
}

const Order = () => {
  const {resolvedTheme} = useTheme()
  const [orderList, setOrderList] = useState<OrderItem[]>(
    JSON.parse(localStorage.getItem("products") ?? "[]"),
  );

  
  const handleAmount = (tittle: string, amount: number) => {
    setOrderList(() => {
      const existing = orderList.find((p) => p.title === tittle);
      if (existing) {
        return orderList.map((p) =>
          p.title === tittle ? { ...p, amount: amount } : p,
        );
      }
      return [...orderList];
    });
  };
  

  const handleDelete = (title: string) => {
    const updated = orderList.filter((p) => p.title !== title);
    setOrderList(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const sendMsg = () => {
    if (orderList.length == 0) {
      alert("no tienes pedidos");
    }

    const msg = orderList
      .map(
        (p, i) =>
          `${i + 1}. ${p.title} - Cantidad: ${p.amount} - Tamaño: ${p.size} cm`,
      )
      .join("%0A");

    const txt = `*Pedido desde la web* %0A%0A${msg}%0A%0A`;

    window.open(`https://wa.me/5493402524738?text=${txt}`);
  };

   useEffect(() => {
      localStorage.setItem("products", JSON.stringify(orderList));
   }, [orderList]);
  
  return (
    <div id="inicio" className="dark:bg-[#333] bg-sky-50/60">
      <WhatsApp></WhatsApp>
      <Header></Header>
      <main className="flex flex-col pt-28 h-screen w-[60vw] mx-auto max-md:mx-0 max-md:h-fit">
        <h1 className="text-7xl my-4 font-semibold dark:text-white max-md:ml-16 max-md:w-fit">
          <span className="max-md:hidden border-b-sky-400 border-b-4 dark:border-b-amber-400 ">
            MIS
          </span>
          <span className="lg:hidden">MIS</span>{" "}
          PEDIDOS
          <div className="lg:hidden border-b-sky-400 border-b-4  dark:border-b-amber-400 w-12 h-1"></div>
        </h1>
        <section className="grid grid-cols-3 gap-4 mt-4 max-md:grid-cols-1 max-md:w-[100vw] ">
          <div className="col-span-2 max-md:order-1 max-md:mb-12 max-md:w-[98vw]">
            {orderList.length === 0 ? (
              <div className="h-[60vh] bg-white  dark:bg-dark2 rounded-xl shadow-xl flex flex-col justify-center items-center">
                <div className="bg-sky-200 dark:bg-dark1 rounded-full p-6 relative">
                  <div className="absolute bottom-2 right-2 border border-sky-300 dark:border-black bg-white shadow-2xs text-sky-500 dark:bg-dark2 dark:text-amber-400 text-xl w-8 h-8 rounded-full p-4 flex items-center justify-center">
                    !
                  </div>
                  {resolvedTheme === "dark" ? (
                    <img src="archiveDark.svg" className="w-32 h-32" alt="" />
                  ) : (
                    <img src="archive.svg" className="w-32 h-32" alt="" />
                  )}
                </div>
                <p className="text-4xl mt-2 font-bold mb-6 dark:text-[hsl(41,98%,51%)]">
                  ¡Aún no tenés pedidos!
                </p>
                <p className="text-2xl mb-6 w-100 text-center dark:text-white">
                  Explorá nuestro catálogo y dale vida a tus ideas en 3D!
                </p>
                <Link
                  href="/productos"
                  className="flex gap-4 mt-8 bg-blue-400 dark:bg-[hsl(41,98%,51%)] dark:text-black text-white font-bold rounded-2xl p-4 shadow-md hover:opacity-90"
                >
                  Ver todos los productos
                  <LayoutGrid></LayoutGrid>
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex bg-white dark:bg-dark2 flex-col max-h-140 overflow-y-auto gap-4 rounded-2xl shadow-xl">
                  {orderList.map((ol, index) => (
                    <ProductCardOrder
                      key={index}
                      img={ol.img}
                      title={ol.title}
                      size={ol.size}
                      amount={ol.amount}
                      description={ol.description}
                      category={ol.category}
                      material={ol.material}
                      colores={ol.colores}
                      handleAmount={handleAmount}
                      refresh={handleDelete}
                    ></ProductCardOrder>
                  ))}
                </div>
                <div className="mt-6 max-md:flex max-md:justify-center">
                  <button
                    onClick={sendMsg}
                    className=" border-1 border-cyan-500 rounded-2xl p-4 bg-sky-400 dark:border-[hsl(41,98%,51%)] dark:bg-[hsl(41,98%,51%)] dark:hover:bg-[hsl(41,98%,41%)] text-white hover:bg-cyan-600 cursor-pointer"
                  >
                    Enviar Pedidos
                  </button>
                </div>
              </div>
            )}
          </div>
          <OrderSummaryCard></OrderSummaryCard>
        </section>
      </main>
    </div>
  );
};

export default Order;
