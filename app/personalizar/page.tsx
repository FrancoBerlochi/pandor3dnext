"use client"
import Header from "../../components/cards/Header";
import { useState } from "react";
import OrderSummaryCard from "../../components/cards/OrderSummaryCard";
import Swal from "sweetalert2";
import { useTheme } from "next-themes";

interface FormErrors {
  nombre: boolean;
  email: boolean;
  telefono: boolean;
  cantidad: boolean;
  descripcion: boolean;
}

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  cantidad: number;
  descripcion: string;
  archivos: string[];
}

const Custom = () => {
  const cloudName = "dggothnbr";
  const uploadPreset = "sergio";

  const [loading, setLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const [errors, setErrors] = useState<FormErrors>({
    nombre: false,
    email: false,
    telefono: false,
    cantidad: false,
    descripcion: false,
  });

  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
    cantidad: 1,
    descripcion: "",
    archivos: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "telefono") {
      setForm((prev) => {
        const prevValue = prev.telefono;

        if (value.length < prevValue.length) {
          return { ...prev, telefono: value };
        }

        if (value.length === 3 && !value.includes("-")) {
          return { ...prev, telefono: value + "-" };
        }

        return { ...prev, telefono: value };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }

    setErrors({
      ...errors,
      nombre: false,
      email: false,
      telefono: false,
      cantidad: false,
      descripcion: false,
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setLoading(true);
    try {
      const uploadPromises = files.map(async (f: File) => {
        const data = new FormData();
        data.append("file", f);
        data.append("upload_preset", uploadPreset);
        data.append("api_key", "386253689225782");

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: data,
          },
        );

        const file = await response.json();
        return file.secure_url;
      });

      const uploadedImages = await Promise.all(uploadPromises);

      setForm((prev) => ({
        ...prev,
        archivos: [...(prev.archivos || []), ...uploadedImages],
      }));
    } catch (error) {
      console.error("Error subiendo imágenes:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se pudo cargar la imagen!",
        confirmButtonColor: "#22d3ee",
      });
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.nombre == "") {
      setErrors({ ...errors, nombre: true });
      return;
    } else if (!validateEmail(form.email)) {
      setErrors({ ...errors, email: true });
      return;
    } else if (form.telefono == "" || form.telefono.length > 11) {
      setErrors({ ...errors, telefono: true });
      return;
    } else if (form.cantidad <= 0) {
      setErrors({ ...errors, cantidad: true });
      return;
    } else if (form.descripcion == "") {
      setErrors({ ...errors, descripcion: true });
      return;
    }

    setForm({
      nombre: "",
      email: "",
      telefono: "",
      cantidad: 1,
      descripcion: "",
      archivos: [],
    });

    if (resolvedTheme === "dark") {
      Swal.fire({
        title: "Pedido Enviado!",
        icon: "success",
        iconColor: "#fdaf08",
        color: "#fff",
        confirmButtonColor: "#fdaf02",
        background: "#111",
        draggable: false,
      });
    } else {
      Swal.fire({
        title: "Pedido Enviado!",
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
    <div id="inicio" className="dark:bg-[#333] pb-4">
      <Header></Header>
      <main className="flex flex-col pt-35 mx-auto w-[60vw] max-md:items-center ">
        <h1 className="text-6xl font-semibold dark:text-white max-md:text-5xl max-md:mb-2">
          Pesonalizar Pedido
        </h1>
        <h2 className="text-2xl text-gray-600 dark:text-gray-300">
          Contanos sobre tu proyecto y te ayudaremos a hacerlo realidad.
        </h2>
        <div className="grid grid-cols-3 w-[60vw] mt-15 max-md:grid-cols-1 max-md:w-[95vw]">
          <div className="col-span-2 border-2 border-gray-200 dark:border-[#111] rounded-2xl mx-2 p-8 shadow-xl max-md:mb-8 max-md:order-2">
            <form onSubmit={handleSubmit} className="space-y-6 dark:text-white">
              <div>
                <label className="block font-semibold mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Juan Pérez"
                  value={form.nombre}
                  onChange={handleChange}
                  className={
                    errors.nombre
                      ? "w-full border border-gray-300 rounded-lg bg-red-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-[hsl(41,98%,51%)]"
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="juan@ejemplo.com"
                    value={form.email}
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
                  <label className="block font-semibold mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="341-1234567"
                    pattern="[0-9]{3}-[0-9]{7}"
                    value={form.telefono}
                    onChange={handleChange}
                    className={
                      errors.telefono
                        ? "w-full border border-gray-300 rounded-lg bg-red-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                        : "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-[hsl(41,98%,51%)]"
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  min="1"
                  value={form.cantidad}
                  onChange={handleChange}
                  className={
                    errors.cantidad
                      ? "w-full border border-gray-300 rounded-lg bg-red-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-[hsl(41,98%,51%)]"
                  }
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Descripción del Proyecto
                </label>
                <textarea
                  name="descripcion"
                  placeholder="Describí tu proyecto en detalle: dimensiones, color, material preferido, uso previsto, etc."
                  value={form.descripcion}
                  onChange={handleChange}
                  rows={4}
                  className={
                    errors.descripcion
                      ? "w-full border border-gray-300 rounded-lg bg-red-300 p-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                      : "w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-[hsl(41,98%,51%)]"
                  }
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Subir Archivos (Opcional)
                </label>
                <div
                  id="dropDiv"
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-sky-400 transition dark:hover:border-[hsl(41,98%,51%)]"
                >
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    accept=".stl,.obj,.png,.jpg"
                    className="text-transparent absolute z-10 inset-0 cursor-pointer"
                    id="fileUpload"
                  />
                  {form.archivos.length === 0 ? (
                    <div className="cursor-pointer flex flex-col items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10 mb-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                      <p className="text-gray-500">
                        Arrastrá tus archivos aquí o hacé click para seleccionar
                      </p>
                      <p className="text-sm text-gray-400">
                        STL, OBJ, PNG, JPG (máx. 10MB)
                      </p>
                    </div>
                  ) : loading ? (
                    <div className="w-full h-full">Cargando....</div>
                  ) : (
                    <div className="grid grid-cols-3 gap-4">
                      {form.archivos.map((img, index) => (
                        <img
                          key={index}
                          src={
                            typeof img === "string"
                              ? img
                              : URL.createObjectURL(img)
                          }
                          alt={`img-${index}`}
                          className="w-30 h-30"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-500 text-white dark:bg-[hsl(41,98%,51%)] dark:hover:bg-[hsl(41,98%,31%)] cursor-pointer font-semibold py-2 rounded-lg hover:bg-sky-600 transition"
              >
                Enviar Solicitud
              </button>
            </form>
          </div>
          <OrderSummaryCard></OrderSummaryCard>
        </div>
      </main>
    </div>
  );
};

export default Custom;
