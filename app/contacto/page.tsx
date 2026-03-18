"use client"
import Header from "../../components/cards/Header";
import { useState} from "react";
import Swal from "sweetalert2";
import { useTheme } from "next-themes";

const Contact = () => {
  const { resolvedTheme } = useTheme();
  const [errors, setErrors] = useState({
    nombre: false,
    email: false,
    asunto: false,
    mensaje: false,
  });

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      nombre: false,
      email: false,
      asunto: false,
      mensaje: false,
    });
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.nombre == "") {
      setErrors({ ...errors, nombre: true });
      return;
    } else if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: true });
      return;
    } else if (formData.asunto == "") {
      setErrors({ ...errors, asunto: true });
      return;
    } else if (formData.mensaje == "") {
      setErrors({ ...errors, mensaje: true });
      return;
    }

    setFormData({
      nombre: "",
      email: "",
      asunto: "",
      mensaje: "",
    });

    if (resolvedTheme === "dark") {
      Swal.fire({
        title: "Mensaja enviado!",
        icon: "success",
        iconColor: "#fdaf08",
        color: "#fff",
        confirmButtonColor: "#fdaf02",
        background: "#111",
        draggable: false,
      });
    } else {
      Swal.fire({
        title: "Mensaja enviado!",
        icon: "success",
        iconColor: "#21d3dd",
        color: "#444",
        confirmButtonColor: "#22d3ee",
        background: "white",
        draggable: false,
      });
    }
    //EMAILJS
  };

  return (
    <div id="inicio" className="flex justify-center dark:bg-[#333]">
      <Header></Header>
      <main className="pt-32 flex flex-col items-center h-screen w-[60vw] max-md:w-[100vw] max-md:h-fit">
        <h1 className="text-7xl font-semibold dark:text-white">Contacto</h1>
        <h2 className="text-xl text-gray-600 mt-4 dark:text-gray-300 max-md:w-70 ">
          Estamos acá para ayudarte. Envianos tu consulta y te responderemos a
          la brevedad
        </h2>
        <section className="grid grid-cols-3 w-[50vw] mt-16 gap-8 max-md:grid-cols-1 max-md:w-[98vw]">
          <div className="col-span-2 border-2 border-gray-200 dark:border-[#111] rounded-2xl mx-2 p-8 shadow-xl w-full max-md:mx-0">
            <form onSubmit={handleSubmit} className="space-y-6 dark:text-white">
              <div>
                <label className="block font-semibold mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={
                    errors.nombre
                      ? "w-full border border-gray-300 rounded-lg bg-red-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-[hsl(41,98%,51%)]"
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={
                    errors.email
                      ? "w-full border border-gray-300 rounded-lg bg-red-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-[hsl(41,98%,51%)]"
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Asunto</label>
                <input
                  type="text"
                  name="asunto"
                  placeholder="Pedido personalizado"
                  value={formData.asunto}
                  onChange={handleChange}
                  className={
                    errors.asunto
                      ? "w-full border border-gray-300 rounded-lg bg-red-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-[hsl(41,98%,51%)]"
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Mensaje</label>
                <textarea
                  name="mensaje"
                  placeholder="Describí tu preocupación o duda"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={4}
                  className={
                    errors.mensaje
                      ? "w-full border border-gray-300 rounded-lg bg-red-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-[hsl(41,98%,51%)]"
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-sky-400 text-white font-semibold dark:bg-[hsl(41,98%,51%)] dark:hover:bg-[hsl(41,98%,41%)] py-2 rounded-lg hover:bg-sky-600 transition cursor-pointer flex justify-center gap-4"
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
                  className="lucide lucide-send-icon lucide-send"
                >
                  <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
                  <path d="m21.854 2.147-10.94 10.939" />
                </svg>
                <p>Enviar Consulta</p>
              </button>
            </form>
          </div>
          <div className="flex flex-col max-md:w-[98vw] max-md:mr-[1vw] max-md:mb-6">
            <div className="shadow-xl rounded-2xl h-60 border-2 border-gray-200 dark:border-[#111]">
              <ul className="pl-10 mt-8 mb-16">
                <li className="flex gap-4 mb-4">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-[hsl(41,98%,75%)] items-center flex justify-center rounded-xl">
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
                      className="lucide lucide-mail-icon lucide-mail text-cyan-500 dark:text-orange-400"
                    >
                      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold dark:text-white">Email</h3>
                    <p className="text-gray-600 text-sm dark:text-gray-300">
                      pandor3d@gmail.com
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 mb-4">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-[hsl(41,98%,75%)] items-center flex justify-center rounded-xl">
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
                      className="lucide lucide-phone-icon lucide-phone text-cyan-500 dark:text-orange-400"
                    >
                      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold dark:text-white">Teléfono</h3>
                    <p className="text-gray-600 text-sm dark:text-gray-300">
                      +54 341 1234567
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 mb-4">
                  <div className="w-10 h-10 bg-cyan-100 dark:bg-[hsl(41,98%,75%)] items-center flex justify-center rounded-xl">
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
                      className="lucide lucide-map-pin-icon lucide-map-pin text-cyan-500 dark:text-orange-400"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-semibold dark:text-white">Ubicación</h3>
                    <p className="text-gray-600 text-sm dark:text-gray-300">
                      Santa Fe, Argentina
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-sky-200 border-1 border-sky-300 dark:bg-[hsl(41,68%,51%)] dark:border-[hsl(41,98%,51%)] rounded-2xl mt-6">
              <div className="flex flex-col mx-6">
                <h3 className="text-xl font-semibold mb-6 mt-8 dark:text-white">
                  Horarios de Atención
                </h3>
                <div className="flex flex-col mb-8 gap-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600 text-sm dark:text-gray-100">
                      Lunes - Viernes
                    </p>
                    <p className="text-sm dark:text-gray-100">9:00 - 18:00</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600 text-sm dark:text-gray-100">
                      Sábados
                    </p>
                    <p className="text-sm dark:text-gray-100">3:00 - 6:00</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600 text-sm dark:text-gray-100">
                      Domingos
                    </p>
                    <p className="text-sm dark:text-gray-100">13:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
