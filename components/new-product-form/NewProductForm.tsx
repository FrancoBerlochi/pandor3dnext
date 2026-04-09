"use client";
import { Plus } from "lucide-react";
import AddOptionModal from "../../app/admin/new-product/AddOptionalModal";
import { uploadProductImage } from "@/lib/supabase/upload";
import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { PenLine, Grid2x2 } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import {
  createProduct,
  createCategory,
  createMaterial,
  createColor,
  deleteCategory,
  deleteMaterial,
  deleteColor,
} from "../../app/admin/new-product/actions";

type Color = { id: number; name: string; hex_code: string };
type Option = { id: number; name: string };

type Props = {
  categories: Option[];
  materials: Option[];
  states: Option[];
  colors: Color[];
};

const BADGES = ["Ninguna", "Mas vendido", "Nuevo", "Descontinuado"];

export default function NewProductForm({ categories, materials, states, colors }: Props) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [badge, setBadge] = useState("None");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryList, setCategoryList] = useState(categories);
  const [materialList, setMaterialList] = useState(materials);
  const [colorList, setColorList] = useState(colors);
  const [modal, setModal] = useState<"category" | "material" | "color" | null>(
    null,
  );
  const [modalLoading, setModalLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHex, setNewHex] = useState("#000000");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function toggleColor(id: number) {
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    selectedColors.forEach((id) => formData.append("color_ids", String(id)));
    formData.set("badge_label", badge === "None" ? "" : badge);

    const result = await createProduct(formData);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error ?? "Error al crear el producto");
      setLoading(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local inmediato
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const url = await uploadProductImage(file);
      setImageUrl(url);
    } catch (err) {
      console.error("Error completo:", err);
      setError(err instanceof Error ? err.message : "Error subiendo la imagen");
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  }

  async function handleAddCategory() {
    if (!newName.trim()) return;
    setModalLoading(true);
    const result = await createCategory(newName.trim());
    if (result.success && result.data) {
      setCategoryList((prev) => [...prev, result.data]);
    }
    setModalLoading(false);
    setModal(null);
    setNewName("");
  }

  async function handleAddMaterial() {
    if (!newName.trim()) return;
    setModalLoading(true);
    const result = await createMaterial(newName.trim());
    if (result.success && result.data) {
      setMaterialList((prev) => [...prev, result.data]);
    }
    setModalLoading(false);
    setModal(null);
    setNewName("");
  }

  async function handleAddColor() {
    setModalLoading(true);
    const result = await createColor(newName || newHex, newHex);
    if (result.success && result.data) {
      setColorList((prev) => [...prev, result.data]);
      setSelectedColors((prev) => [...prev, result.data.id]);
    }
    setModalLoading(false);
    setModal(null);
    setNewName("");
    setNewHex("#000000");
  }

  async function handleDeleteCategory(id: number) {
    const result = await deleteCategory(id);
    if (result.success) {
      setCategoryList((prev) => prev.filter((c) => c.id !== id));
    }
  }

  async function handleDeleteMaterial(id: number) {
    const result = await deleteMaterial(id);
    if (result.success) {
      setMaterialList((prev) => prev.filter((m) => m.id !== id));
    }
  }

  async function handleDeleteColor(id: number) {
    const result = await deleteColor(id);
    if (result.success) {
      setColorList((prev) => prev.filter((c) => c.id !== id));
      setSelectedColors((prev) => prev.filter((c) => c !== id));
    }
  }

  return (
    <main className="w-full min-h-screen bg-[#f0f2f5] dark:bg-dark3 pt-12 pb-16 flex gap-12 flex-col items-center justify-center relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle></ThemeToggle>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-xl text-sky-500 dark:text-[hsl(41,98%,65%)] tracking-wide">
          Gestión de productos
        </h2>
        <h1 className="text-6xl relative">
          Crear Nuevo Producto
          <span className="absolute w-20 border-b-4 bottom-0 left-[calc(50%-40px)] border-sky-500 dark:border-[hsl(41,98%,65%)] rounded-xl"></span>
        </h1>
      </div>
      <form
        ref={formRef}
        action={handleSubmit}
        className="w-full max-w-4xl px-4 grid grid-cols-[1fr_280px] gap-4 items-center dark:bg-dark3"
      >
        {/* ── Columna izquierda ── */}
        <div className="flex flex-col gap-4">
          {/* Product Identity */}
          <div className="bg-white rounded-2xl border border-gray-200 dark:border-black p-6 dark:bg-dark3">
            <h2 className="flex items-center gap-2 text-xl font-medium mb-5 text-gray-800 tracking-wider dark:text-white">
              <PenLine
                size={16}
                className="text-sky-500 dark:text-[hsl(41,98%,65%)]"
              />
              Identidad del Producto
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                  Título
                </label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="e.g. Aeronautical Bracket V4"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)] transition-colors"
                />
              </div>
              <div>
                <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  rows={5}
                  placeholder="Describe the mechanical properties and intended use cases..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)] transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-2xl border border-gray-200 dark:border-black p-6 dark:bg-dark3">
            <h2 className="flex items-center gap-2 tracking-wider text-xl font-medium mb-5 text-gray-800 dark:text-gray-200">
              <Grid2x2
                size={16}
                className="text-sky-500 dark:text-[hsl(41,98%,65%)]"
              />
              Especificaciones Técnicas
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                  Dimensions (cm)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    name="length_cm"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="L"
                    className="w-full border border-gray-200 dark:bg-dark2/65 rounded-lg px-2 py-2 text-sm outline-none focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)]"
                  />
                  <span className="text-gray-300 text-xs shrink-0">×</span>
                  <input
                    name="width_cm"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="W"
                    className="w-full border border-gray-200 dark:bg-dark2/65 rounded-lg px-2 py-2 text-sm outline-none focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)]"
                  />
                  <span className="text-gray-300 text-xs shrink-0">×</span>
                  <input
                    name="height_cm"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="H"
                    className="w-full border border-gray-200 dark:bg-dark2/65 rounded-lg px-2 py-2 text-sm outline-none focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                  Categoría
                </label>
                <div className="flex gap-2">
                  <select
                    name="category_id"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none dark:bg-dark2/65 dark:text-gray-300 focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)] bg-white text-gray-700"
                  >
                    <option value="">Elige una Categoría</option>
                    {categoryList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setNewName("");
                      setModal("category");
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200  hover:border-sky-400 dark:hover:border-[hsl(41,98%,65%)] hover:text-sky-500 dark:hover:text-[hsl(41,98%,65%)] transition-colors text-gray-400 dark:text-gray-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                  Materiales
                </label>
                <div className="flex gap-2">
                  <select
                    name="material_id"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none dark:bg-dark2/65 dark:text-gray-300 focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)] bg-white text-gray-700"
                  >
                    <option value="">Selecciona un Material</option>
                    {materialList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setNewName("");
                      setModal("material");
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 hover:border-sky-400 dark:hover:border-[hsl(41,98%,65%)] hover:text-sky-500 dark:hover:text-[hsl(41,98%,65%)] transition-colors text-gray-400 dark:text-gray-200"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                  Estado
                </label>
                <select
                  name="state_id"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none dark:bg-dark2/65 dark:text-gray-300 focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)] bg-white text-gray-700"
                >
                  <option value="">Sin estado</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-4">
          <div className="bg-white dark:bg-dark3 rounded-2xl border border-gray-200 dark:border-black p-5 flex flex-col gap-5">
            {/* Placeholder imagen — lo conectamos después con Storage */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-gray-100 dark:bg-dark2 rounded-xl flex items-center justify-center border border-dashed border-gray-300 hover:border-sky-400 dark:hover:border-[hsl(41,98%,65%)] transition-colors cursor-pointer overflow-hidden relative"
            >
              {/* Badge preview */}
              {badge !== "None" && (
                <div className="absolute top-2 left-2 z-10 bg-sky-400 dark:bg-[hsl(41,98%,65%)] text-sky-900 dark:text-white text-[10px] font-medium px-2 py-1 rounded-md tracking-wide uppercase">
                  {badge}
                </div>
              )}

              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <p className="text-white text-xs font-medium">
                        Subiendo...
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center px-4 ">
                  <p className="text-xs text-gray-400 ">
                    Click para subir imagen
                  </p>
                  <p className="text-[11px] text-gray-300 mt-1">
                    PNG, JPG, WEBP · máx 50MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
            <input name="image_url" type="hidden" value={imageUrl} />
            {/* Badge */}
            <div>
              <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-2">
                Etiqueta
              </label>
              <div className="flex flex-wrap gap-2">
                {BADGES.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBadge(b)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      badge === b
                        ? "bg-sky-400 dark:bg-[hsl(41,98%,65%)] border-sky-400 dark:border-orange-600 text-sky-900 dark:text-[hsl(41,58%,25%)] font-medium"
                        : "border-gray-200 text-gray-500 hover:border-gray-400 dark:text-gray-200 dark:hover:border-orange-500"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            {/* Colores */}

            <div>
              <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-2">
                Color palette
              </label>
              <div className="flex flex-wrap gap-2 items-center">
                {colorList.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleColor(c.id)}
                    title={c.name}
                    style={{ backgroundColor: `#${c.hex_code}` }}
                    className={`w-7 h-7 rounded-full transition-all ${
                      selectedColors.includes(c.id)
                        ? "ring-2 ring-offset-2 ring-gray-800 scale-110"
                        : "hover:scale-105"
                    }`}
                  />
                ))}
                {/* Botón agregar color */}
                <button
                  type="button"
                  onClick={() => {
                    setNewHex("#000000");
                    setModal("color");
                  }}
                  className="w-7 h-7 rounded-full bg-gray-100 dark:bg-dark3 border border-dashed border-gray-300  hover:border-sky-400 dark:hover:border-[hsl(41,98%,65%)] flex items-center justify-center transition-colors"
                >
                  <Plus
                    size={12}
                    className="text-gray-400 dark:text-gray-200"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="bg-white dark:bg-dark3 rounded-2xl border border-gray-200 dark:border-black p-5 flex flex-col gap-3">
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sky-400 hover:bg-sky-500 dark:bg-[hsl(41,98%,65%)] cursor-pointer dark:text-white text-sky-900 font-medium text-sm rounded-xl tracking-widest disabled:opacity-50 transition-colors"
            >
              {loading ? "PUBLISHING..." : "PUBLISH PRODUCT"}
            </button>
          </div>
        </div>

        {modal === "category" && (
          <AddOptionModal
            title="Categorías"
            onClose={() => setModal(null)}
            onConfirm={handleAddCategory}
            onDelete={handleDeleteCategory}
            loading={modalLoading}
            list={categoryList}
          >
            <div>
              <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Figuras"
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)]"
              />
            </div>
          </AddOptionModal>
        )}

        {modal === "material" && (
          <AddOptionModal
            title="Materiales"
            onClose={() => setModal(null)}
            onConfirm={handleAddMaterial}
            onDelete={handleDeleteMaterial}
            loading={modalLoading}
            list={materialList}
          >
            <div>
              <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Resina"
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)]"
              />
            </div>
          </AddOptionModal>
        )}

        {modal === "color" && (
          <AddOptionModal
            title="Colores"
            onClose={() => setModal(null)}
            onConfirm={handleAddColor}
            onDelete={handleDeleteColor}
            loading={modalLoading}
            list={colorList}
          >
            <div>
              <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                Nombre (opcional)
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Azul Marino"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 dark:focus:border-[hsl(41,98%,65%)]"
              />
            </div>
            <div>
              <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-2">
                Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer p-1"
                />
                <span className="text-sm text-gray-500 font-mono">
                  {newHex}
                </span>
              </div>
            </div>
          </AddOptionModal>
        )}
      </form>
    </main>
  );
}
