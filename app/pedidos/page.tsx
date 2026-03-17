"use client" 
import { useState } from "react";
import  Link  from "next/link";
import Header from "../../components/cards/Header";
import OrderSummaryCard from "../../components/cards/OrderSummaryCard";
import ProductCardOrder from "../../components/cards/ProductCardOrder";

const Order = () => {

  const [orderList, setOrderList] = useState(
    JSON.parse(localStorage.getItem("products")) || [],
  );

  const handleDelete = (title) => {
    const updated = orderList.filter((p) => p.title !== title);
    setOrderList(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const sendMsg = () => {
    if (orderList.lenght == 0) {
      alert("no tienes pedidos");
    }

    const msg = orderList
      .map(
        (p, i) =>
          `${i + 1}. ${p.title} - Cantidad: ${p.amount} - Tamaño: CM${p.size}`,
      )
      .join("%0A");

    const txt = `*Pedido desde la web* %0A%0A${msg}%0A%0A`;

    window.open(`https://wa.me/5493402524738?text=${txt}`);
  };

  return (
    <div id="inicio" className="dark:bg-[#333]">
      <Header></Header>
      <main className="flex flex-col pt-28 h-screen w-[60vw] mx-auto max-md:mx-0 max-md:h-fit">
        <h1 className="text-6xl font-semibold dark:text-white max-md:ml-16 max-md:w-fit">
          Pedidos
        </h1>
        <h3 className="text-gray-600 dark:text-gray-300 max-md:ml-18 max-md:w-40">
          productos pedidos
        </h3>
        <section className="grid grid-cols-3 mt-10 max-md:grid-cols-1 max-md:w-[100vw] ">
          <div className="col-span-2 max-md:order-1 max-md:mb-12 max-md:w-[98vw]">
            {orderList == "" ? (
              <div className="">
                <p className="text-4xl text-[#5bacf6] mb-6 dark:text-[hsl(41,98%,51%)]">
                  No tenés pedidos!
                </p>
                <p className="text-2xl mb-6 dark:text-white">
                  Revisa nuestros productos que seguro te van a gustar
                </p>
                <Link
                  to="/productos"
                  className="py-2 px-6 rounded-2xl bg-[#5bacf6] text-white dark:bg-[hsl(41,98%,51%)] hover:opacity-90"
                >
                  Ver Productos
                </Link>
              </div>
            ) : (
              <div>
                <div className="flex flex-col max-h-140 overflow-y-auto gap-4 rounded-2xl shadow-xl">
                  {orderList.map((ol, index) => (
                    <ProductCardOrder
                      key={index}
                      img={ol.img}
                      title={ol.title}
                      size={ol.size}
                      amount={ol.amount}
                      refresh={handleDelete}
                    ></ProductCardOrder>
                  ))}
                </div>
                <div className="mt-6 max-md:flex max-md:justify-center">
                  <button
                    onClick={sendMsg}
                    className=" border-1 border-cyan-500 rounded-2xl p-4 bg-cyan-500 dark:border-[hsl(41,98%,51%)] dark:bg-[hsl(41,98%,51%)] dark:hover:bg-[hsl(41,98%,41%)] text-white hover:bg-cyan-600 cursor-pointer"
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
