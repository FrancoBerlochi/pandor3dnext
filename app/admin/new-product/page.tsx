import git from "@/public/github.png";
import { PenLine, Hammer } from "lucide-react";

export default function NewProduct() {
  return (
    <main className="w-full pt-16 bg-emerald-300 flex justify-center flex-col items-center">
      <h1 className="text-6xl flex justify-center">Crear Nuevo Producto</h1>
      <p className="text-xl justify-center flex mt-2">
        Creá Tu producto de manera sencilla.
      </p>
      <section className="w-[80%] bg-red-200 flex gap-12 mt-12">
        <article className="w-[60%] pt-6 bg-white">
          <h2 className="text-3xl ml-12 mb-6 flex gap-3  items-center tracking-wide">
            <PenLine className="text-sky-500"></PenLine> Producto
          </h2>
          <section className="mb-8">
            <form className="flex flex-col gap-6">
              <div className="flex flex-col mx-6">
                <label className="text-gray-600">Título</label>
                <input
                  type="text"
                  className="mt-1 p-2   rounded-md bg-gray-300/35"
                  placeholder="e.g Triceratops"
                />
              </div>
              <div className="flex flex-col mx-6">
                <label className="text-gray-600">Descripción</label>
                <textarea
                  name=""
                  id=""
                  rows={6}
                  placeholder="Describe brevemente el producto"
                  className="mt-1 p-2   rounded-md bg-gray-300/35"
                ></textarea>
              </div>
            </form>
          </section>
        </article>
        <article className="bg-violet-300 w-[25%] flex flex-col items-center">
          <div className="flex flex-col mt-4 bg-orange-200 h-fit">
            <img src={git.src} alt="" className="w-64 h-64" />
            <div className="flex flex-col items-center justify-center">
              <p>Etiqueta</p>
              <ul className="flex flex-wrap w-50 gap-4">
                <li>None</li>
                <li>Mas vendido</li>
                <li>Nuevo</li>
              </ul>
            </div>
          </div>
          <div>
            <p>Paleta de Colores</p>
            <div>
              <input type="color" value="#ff0000" />
            </div>
          </div>
        </article>
      </section>
      <section className="w-[80%] mt-12">
        <article className="w-[60%] pt-6 bg-white">
          <h2 className="text-3xl ml-12 mb-6 flex gap-3  items-center tracking-wide">
            <Hammer className="text-sky-500"></Hammer> Especificaciones Técnicas
          </h2>
          <section>
            <form>
              <div>
                <label></label>
                <input type="text" />
              </div>
              <div>
                <label></label>
                <input type="text" />
              </div>
              <div>
                <label></label>
                <input type="text" />
              </div>
              <div>
                <label></label>
                <input type="text" />
              </div>
            </form>
          </section>
        </article>
        <article>
          
        </article>
      </section>
    </main>
  );
}
