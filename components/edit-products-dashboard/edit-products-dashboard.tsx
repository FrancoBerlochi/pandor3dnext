"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { X, PenLine, Grid2x2, Plus, Trash2 } from "lucide-react";
import { updateProduct } from "../../app/admin/edit-products/actions";
import { uploadProductImage } from "@/lib/supabase/upload";

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

const BADGES = ["None", "Best Seller", "New", "Discount"];

export default function EditProductsClient({
  products: initialProducts,
  categories,
  materials,
  states,
  colors,
}: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState<Product | null>(null);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("image_url", imageUrl);

    const result = await updateProduct(selected.id, formData, selectedColors);

    if (result.success) {
      // Actualizamos la card en la grilla sin recargar
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

  return (
    <main className="w-full min-h-screen bg-[#f0f2f5] pt-12 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-2xl font-medium text-gray-800 mb-8">
          Editar productos
        </h1>

        {/* Grilla */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => openModal(product)}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:border-sky-400 hover:shadow-sm transition-all group"
            >
              <div className="aspect-square bg-gray-100 relative">
                {product.badge_label && (
                  <div className="absolute top-2 left-2 z-10 bg-sky-400 text-sky-900 text-[10px] font-medium px-2 py-1 rounded-md tracking-wide uppercase">
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <PenLine
                    size={20}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {product.title}
                </p>
                <div className="flex gap-1 mt-2">
                  {product.product_colors.slice(0, 4).map((pc) => {
                    const color = colors.find((c) => c.id === pc.color_id);
                    return color ? (
                      <div
                        key={pc.color_id}
                        className="w-3 h-3 rounded-full border border-gray-200"
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <div>
                <p className="text-[11px] tracking-widest text-sky-500 uppercase font-medium">
                  Product editor
                </p>
                <h2 className="text-xl font-medium text-gray-800">
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
                  <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-1">
                    Título
                  </label>
                  <input
                    name="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-1">
                      Categoría
                    </label>
                    <select
                      name="category_id"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 bg-white"
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
                    <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-1">
                      Material
                    </label>
                    <select
                      name="material_id"
                      value={materialId}
                      onChange={(e) => setMaterialId(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 bg-white"
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
                    <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-1">
                      Estado
                    </label>
                    <select
                      name="state_id"
                      value={stateId}
                      onChange={(e) => setStateId(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 bg-white"
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
                    <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-1">
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
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-sky-400"
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
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-sky-400"
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
                        className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-sky-400"
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
                            ? "bg-sky-400 border-sky-400 text-sky-900 font-medium"
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
                        className={`w-7 h-7 rounded-full transition-all ${
                          selectedColors.includes(c.id)
                            ? "ring-2 ring-offset-2 ring-gray-800 scale-110"
                            : "hover:scale-105"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Columna derecha — imagen */}
              <div className="flex flex-col gap-3">
                <label className="text-[11px] tracking-widest text-gray-400 uppercase block">
                  Imagen
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center border border-dashed border-gray-300 hover:border-sky-400 transition-colors cursor-pointer overflow-hidden relative"
                >
                  {badge !== "None" && (
                    <div className="absolute top-2 left-2 z-10 bg-sky-400 text-sky-900 text-[10px] font-medium px-2 py-1 rounded-md tracking-wide uppercase">
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
                <div className="flex gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="px-5 py-2 bg-sky-400 hover:bg-sky-500 text-sky-900 font-medium text-sm rounded-xl disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
