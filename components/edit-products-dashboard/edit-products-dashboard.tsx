"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, PenLine, Grid2x2, Plus, Trash2, ArrowLeft } from "lucide-react";
import { updateProduct, deleteProduct } from "../../app/admin/edit-products/actions";
import { uploadProductImage } from "@/lib/supabase/upload";
import { ThemeToggle } from "../ui/theme-toggle";

type Color = { id: number; name: string; hex_code: string };
type Option = { id: number; name: string };
type Product = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: number | null;
  material_id: number | null;
  state_id: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  badge_label: string | null;
  product_colors: { color_id: number }[];
};

type Props = {
  products: Product[];
  categories: Option[];
  materials: Option[];
  states: Option[];
  colors: Color[];
};

const BADGES = ["Ninguna", "Mas vendido", "Nuevo", "Descontinuado"];

export default function EditProductsClient({
  products: initialProducts,
  categories,
  materials,
  states,
  colors,
}: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Estados del modal
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [materialId, setMaterialId] = useState("");
  const [stateId, setStateId] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [widthCm, setWidthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [badge, setBadge] = useState("None");
  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openModal(product: Product) {
    setSelected(product);
    setTitle(product.title);
    setDescription(product.description ?? "");
    setImageUrl(product.image_url ?? "");
    setImagePreview(product.image_url ?? "");
    setCategoryId(String(product.category_id ?? ""));
    setMaterialId(String(product.material_id ?? ""));
    setStateId(String(product.state_id ?? ""));
    setLengthCm(String(product.length_cm ?? ""));
    setWidthCm(String(product.width_cm ?? ""));
    setHeightCm(String(product.height_cm ?? ""));
    setBadge(product.badge_label ?? "None");
    setSelectedColors(product.product_colors.map((pc) => pc.color_id));
    setError(null);
  }

  function closeModal() {
    setSelected(null);
    setImagePreview("");
  }

  function toggleColor(id: number) {
    setSelectedColors((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      setImageUrl(url);
    } catch {
      setError("Error subiendo la imagen");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!selected) return;
    setDeleting(true);
    setError(null);

    const result = await deleteProduct(selected.id);

    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== selected.id));
      setShowDeleteConfirm(false);
      closeModal();
    } else {
      setError(result.error ?? "Error al eliminar");
      setShowDeleteConfirm(false);
    }
    setDeleting(false);
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("image_url", imageUrl);
    formData.set("badge_label", badge === "None" ? "" : badge);

    const result = await updateProduct(selected.id, formData, selectedColors);

    if (result.success) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selected.id
            ? {
                ...p,
                title,
                description,
                image_url: imageUrl,
                category_id: Number(categoryId) || null,
                material_id: Number(materialId) || null,
                state_id: Number(stateId) || null,
                length_cm: Number(lengthCm) || null,
                width_cm: Number(widthCm) || null,
                height_cm: Number(heightCm) || null,
                badge_label: badge === "None" ? null : badge,
                product_colors: selectedColors.map((id) => ({ color_id: id })),
              }
            : p,
        ),
      );
      closeModal();
    } else {
      setError(result.error ?? "Error al guardar");
    }
    setLoading(false);
  }
  
  const comeBack = () => {
    window.location.href = "/admin";
  }

  return (
    <main className="w-full relative min-h-screen bg-[#f0f2f5] dark:bg-dark3 pt-12 pb-16">
      <div className="absolute top-6 right-6">
        <ThemeToggle></ThemeToggle>
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-6 mb-8">
          <p
            className="text-xs flex items-center gap-2 cursor-pointer hover:text-sky-400 dark:hover:text-orange-300"
            onClick={comeBack}
          >
            {" "}
            <ArrowLeft className="w-4  h-4"></ArrowLeft> Volver al Dashboard
          </p>
          <h1 className="text-2xl font-medium text-gray-800 dark:text-gray-200 tracking-wide ">
            Editar productos
          </h1>
        </div>

        {/* Grilla */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => openModal(product)}
              className="bg-white dark:bg-dark2 rounded-2xl border border-gray-200 dark:border-black overflow-hidden cursor-pointer hover:border-sky-400 hover:shadow-sm transition-all group"
            >
              <div className="aspect-square bg-gray-100 relative">
                {product.badge_label && (
                  <div className="absolute top-2 left-2 z-10 bg-sky-400 dark:bg-[hsl(41,98%,65%)] text-sky-900 dark:text-gray-500 text-[10px] font-medium px-2 py-1 rounded-md tracking-wide uppercase">
                    {product.badge_label}
                  </div>
                )}
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <img
                    src="https://placehold.co/400"
                    alt="imagen"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-3">
                  <PenLine
                    size={20}
                    className="text-white dark:text-black opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(product);
                      setTimeout(() => setShowDeleteConfirm(true), 0);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2
                      size={20}
                      className="text-red-400 dark:text-red-400"
                    />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {product.title}
                </p>
                <div className="flex gap-1 mt-2">
                  {product.product_colors.slice(0, 4).map((pc) => {
                    const color = colors.find((c) => c.id === pc.color_id);
                    return color ? (
                      <div
                        key={pc.color_id}
                        className="w-3 h-3 rounded-full border border-gray-200 dark:border-black"
                        style={{ backgroundColor: `#${color.hex_code}` }}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white dark:bg-dark3 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <p className="text-[11px] tracking-widest text-sky-500 dark:text-[hsl(41,98%,65%)] uppercase font-medium">
                  Editor de producto
                </p>
                <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
                  {selected.title}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-[1fr_220px] gap-6"
            >
              {/* Columna izquierda */}
              <div className="flex flex-col gap-5">
                <div>
                  <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                    Título
                  </label>
                  <input
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border border-gray-200 dark:focus:border-[hsl(41,98%,65%)] rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-200 dark:focus:border-[hsl(41,98%,65%)] rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                      Categoría
                    </label>
                    <select
                      name="category_id"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full border border-gray-200 dark:focus:border-[hsl(41,98%,65%)] dark:text-gray-200 dark:bg-dark2/65 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 bg-white"
                    >
                      <option value="">Sin categoría</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                      Material
                    </label>
                    <select
                      name="material_id"
                      value={materialId}
                      onChange={(e) => setMaterialId(e.target.value)}
                      className="w-full border border-gray-200 dark:focus:border-[hsl(41,98%,65%)] dark:text-gray-200 dark:bg-dark2/65 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 bg-white"
                    >
                      <option value="">Sin material</option>
                      {materials.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                      Estado
                    </label>
                    <select
                      name="state_id"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      className="w-full border border-gray-200 dark:focus:border-[hsl(41,98%,65%)] dark:text-gray-200 dark:bg-dark2/65 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 bg-white"
                    >
                      <option value="">Sin estado</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                      Dimensiones (cm)
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        name="length_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={lengthCm}
                        onChange={(e) => setLengthCm(e.target.value)}
                        placeholder="L"
                        className="w-full border border-gray-200 dark:focus:border-[hsl(41,98%,65%)] dark:text-gray-200 dark:bg-dark2/65 rounded-lg px-2 py-2 text-sm outline-none focus:border-sky-400"
                      />
                      <span className="text-gray-300 text-xs shrink-0">×</span>
                      <input
                        name="width_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={widthCm}
                        onChange={(e) => setWidthCm(e.target.value)}
                        placeholder="W"
                        className="w-full border border-gray-200 dark:focus:border-[hsl(41,98%,65%)] dark:text-gray-200 dark:bg-dark2/65 rounded-lg px-2 py-2 text-sm outline-none focus:border-sky-400"
                      />
                      <span className="text-gray-300 text-xs shrink-0">×</span>
                      <input
                        name="height_cm"
                        type="number"
                        step="0.1"
                        min="0"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        placeholder="H"
                        className="w-full border border-gray-200 dark:focus:border-[hsl(41,98%,65%)] dark:text-gray-200 dark:bg-dark2/65 rounded-lg px-2 py-2 text-sm outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Badge */}
                <div>
                  <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-2">
                    Badge label
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BADGES.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBadge(b)}
                        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                          badge === b
                            ? "bg-sky-400 border-sky-400 dark:bg-[hsl(41,98%,65%)] dark:border-orange-500 dark:text-gray-600 text-sky-900 font-medium"
                            : "border-gray-200 text-gray-500 hover:border-gray-400"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Colores */}
                <div>
                  <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-2">
                    Colores
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleColor(c.id)}
                        title={c.name}
                        style={{ backgroundColor: `#${c.hex_code}` }}
                        className={`w-7 h-7 rounded-full transition-all cursor-pointer ${
                          selectedColors.includes(c.id)
                            ? "ring-2 ring-offset-2 ring-gray-800 dark:ring-black scale-110"
                            : "hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna derecha — imagen */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block">
                  Imagen
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-gray-100 dark:bg-dark2 rounded-xl flex items-center justify-center border border-dashed border-gray-300 hover:border-sky-400 dark:hover:border-[hsl(41,98%,55%)] transition-colors cursor-pointer overflow-hidden relative"
                >
                  {badge !== "None" && (
                    <div className="absolute top-2 left-2 z-10 bg-sky-400 dark:bg-[hsl(41,98%,65%)] text-sky-900 dark:text-gray-600 text-[10px] font-medium px-2 py-1 rounded-md tracking-wide uppercase">
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
                          <p className="text-white text-xs">Subiendo...</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400">Click para subir</p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* Footer */}
              <div className="col-span-2 flex items-center justify-between pt-4 border-t border-gray-100">
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-800 dark:bg-dark2/65 dark:text-red-400 dark:hover:text-red-500 border-red-6 00 rounded-2xl p-2 bg-red-200 border transition-colors"
                >
                  <Trash2 size={15} />
                  Eliminar
                </button>
                <div className="flex gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-pointer dark:text-gray-200 dark:hover:border-[hsl(41,98%,65%)] hover:border-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-5 py-2 bg-sky-400 hover:bg-sky-500 dark:bg-[hsl(41,98%,65%)] dark:hover:bg-[hsl(41,98%,45%)] dark:text-gray-600 cursor-pointer text-sky-900 font-medium text-sm rounded-xl disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            </form>
          </div>
          {showDeleteConfirm && (
            <div className="absolute inset-0 z-10 bg-black/30 flex items-center justify-center rounded-2xl">
              <div className="bg-white dark:bg-dark2 rounded-xl shadow-lg p-6 mx-4 max-w-sm w-full">
                <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 mb-1 tracking-wider">
                  ¿Eliminar producto?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 ">
                  Esta acción no se puede deshacer. Se eliminará{" "}
                  <span className="font-semibold text-gray-700   dark:text-gray-300">
                    {selected?.title}
                  </span>{" "}
                  permanentemente.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-200 cursor-pointer rounded-xl text-sm text-gray-600 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-colors"
                  >
                    {deleting ? "Eliminando..." : "Sí, eliminar"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
