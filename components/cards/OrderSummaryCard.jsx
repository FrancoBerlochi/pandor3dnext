const OrderSummaryCard = () => {
  return (
    <div className=" flex flex-col  max-md:mb-8 max-md:order-1 max-md:">
      <div className="flex flex-col border-2 bg-white border-gray-200 dark:bg-[hsl(36,100%,45%)] dark:border-[#111] rounded-2xl mx-2 shadow-xl ">
        <h3 className="text-[21px] tracking-wider font-semibold mt-4 ml-4 dark:text-white">
          Proceso de Pedido
        </h3>
        <ul className="pl-8 mt-8 mb-16 dark:text-white">
          <li className="flex mb-6 gap-3">
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
              class="lucide lucide-circle-check-icon lucide-circle-check text-cyan-500 dark:text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div className="flex flex-col">
              <p className="font-semibold">1. Enviá tu solicitud</p>
              <p className="text-gray-600 dark:text-gray-200">
                Completá el formulario con los detalles
              </p>
            </div>
          </li>
          <li className="flex mb-6 gap-3">
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
              class="lucide lucide-circle-check-icon lucide-circle-check text-cyan-500 dark:text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div className="flex flex-col">
              <p className="font-semibold">2. Recibí el presupuesto</p>
              <p className="text-gray-600 dark:text-gray-200">
                Te contactamos en 24-48hs
              </p>
            </div>
          </li>
          <li className="flex mb-6 gap-3">
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
              class="lucide lucide-circle-check-icon lucide-circle-check text-cyan-500 dark:text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div className="flex flex-col">
              <p className="font-semibold">3. Confirmá el pedido</p>
              <p className="text-gray-600 dark:text-gray-200">
                Aprobá el diseño y precio
              </p>
            </div>
          </li>
          <li className="flex gap-3">
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
              class="lucide lucide-circle-check-icon lucide-circle-check text-cyan-500 dark:text-white"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div className="flex flex-col">
              <p className="font-semibold">4. Recibí tu producto</p>
              <p className="text-gray-600 dark:text-gray-200">
                Entrega en 5-10 días hábiles
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-center border-2 border-cyan-500 dark:border-black rounded-2xl mt-8 mx-2 bg-blue-100 dark:bg-[hsl(36,100%,45%)]">
        <h3 className="mt-6 tracking-wider text-2xl font-semibold dark:text-black">
          ¿Necesitás ayuda?
        </h3>
        <p className="text-gray-600 text-md text-center mt-6 dark:text-gray-900">
          Estamos disponibles para responder a cualquier consulta que surga.
        </p>
        <a
          href={`https://wa.me/telnumber?text=Prueba%20prueba`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center my-6 border dark:bg-dark1 dark:border-dark1 dark:text-white dark:hover:bg-dark2 border-cyan-500 rounded-xl w-60 text-cyan-500 py-2 hover:bg-cyan-500 hover:text-white transition-colors duration-300"
        >
          Contactar por WhatsApp
        </a>
      </div>
    </div>
  );
}

export default OrderSummaryCard