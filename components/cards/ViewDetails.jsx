import { useContext, useEffect } from "react";
import { ViewDetailsContext } from "../context/ViewDetailsContext";

const ViewDetails = ({ order }) => {
  const { details, setDetails } = useContext(ViewDetailsContext);
  const { data } = useContext(ViewDetailsContext);
  const handleOpen = () => setDetails(!details);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", details);
    return () => document.body.classList.remove("no-scroll");
  }, [details]);

  return (
    <div
      className="fixed inset-0 bg-[#3339] flex justify-center items-center z-20 "
      onClick={handleOpen}
    >
      <div
        className="flex border-2 bg-[#def] dark:bg-[#555] w-[70vw] h-[60vh] max-md:w-[95vw] max-md:h-[80vh] max-md:flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={data.img}
          className="w-[35vw] bg-white max-md:w-full max-md:h-[40vh]"
          alt="producto"
        />
        <div className="flex flex-col mt-20 ml-20 mr-20 dark:text-white max-md:ml-5 max-md:mr-0 max-md:mt-10">
          <h3 className="text-4xl mb-8 font-semibold max-md:mb-6">
            {data.title}
          </h3>
          <p className="text-2xl mb-10 text-cyan-500 dark:text-[hsl(41,98%,51%)] max-md:mb-8">
            {data.size} cm
          </p>
          <p className="text-xl max-md:text-[1rem] max-md:w-full max-md:mb-5">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
            voluptate quasi, nemo cumque eos, officiis error non optio libero
            doloribus inventore cupiditate. Distinctio quasi odio id eius
            voluptate doloribus provident?
          </p>
          <div className="flex lg:mt-16 max-md:gap-2 max-md:justify-around max-md:items-center max-md:mr-4 max-md:mb-3 lg:gap-8">
            <button
              className="bg-[hsl(41,98%,51%)] lg:w-[10vw] lg:mb-20 hover:bg-[hsl(41,98%,41%)] cursor-pointer text-xl max-md:p-4 rounded-2xl"
              onClick={order}
            >
              Añadir Pedido
            </button>
            <button
              className="p-4 hover:bg-red-500 text-white text-xl bg-red-400 w-[10vw] rounded-3xl self-end mt-auto mb-20 cursor-pointer max-md:w-25 max-md:h-15 max-md:mt-0 max-md:mb-0 max-md:p-3 max-md:self-start"
              onClick={handleOpen}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;
