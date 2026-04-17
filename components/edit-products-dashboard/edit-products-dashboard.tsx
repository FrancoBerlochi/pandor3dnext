"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, PenLine, Grid2x2, Plus, Trash2, ArrowLeft, Check } from "lucide-react";
import { updateProduct, deleteProduct } from "../../app/admin/edit-products/actions";
import { uploadProductImage } from "@/lib/supabase/upload";
import { ThemeToggle } from "../ui/theme-toggle";
import AddOptionModal from "../../app/admin/new-product/AddOptionalModal";
import {
  createCategory,
  createMaterial,
  createColor,
  deleteCategory,
  deleteMaterial,
  deleteColor,
} from "../../app/admin/new-product/actions";

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
  const [categoryList, setCategoryList] = useState(categories);
  const [materialList, setMaterialList] = useState(materials);
  const [colorList, setColorList] = useState(colors);
  const [modal, setModal] = useState<"category" | "material" | "color" | null>(
    null,
  );
  const [modalLoading, setModalLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [newHex, setNewHex] = useState("#000000");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successModal, setSuccessModal] = useState(false)
  const [errorModal, setErrorModal] = useState(false);

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
      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
      }, 3000);
    } else {
      setErrorModal(true); 
      setTimeout(() => setErrorModal(false), 3000);
      setError(result.error ?? "Error al guardar");
    }
    setLoading(false);
  }
  
  const comeBack = () => {
    window.location.href = "/admin";
  }

   useEffect(() => {
      if (selected) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
  
      return () => {
        document.body.classList.remove("no-scroll");
      };
    }, [selected]);

  async function handleAddCategory() {
    if (!newName.trim()) return;
    setModalLoading(true);
    const result = await createCategory(newName.trim());
    if (result.success && result.data)
      setCategoryList((prev) => [...prev, result.data]);
    setModalLoading(false);
    setModal(null);
    setNewName("");
  }

  async function handleAddMaterial() {
    if (!newName.trim()) return;
    setModalLoading(true);
    const result = await createMaterial(newName.trim());
    if (result.success && result.data)
      setMaterialList((prev) => [...prev, result.data]);
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
    if (result.success)
      setCategoryList((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleDeleteMaterial(id: number) {
    const result = await deleteMaterial(id);
    if (result.success)
      setMaterialList((prev) => prev.filter((m) => m.id !== id));
  }

  async function handleDeleteColor(id: number) {
    const result = await deleteColor(id);
    if (result.success) {
      setColorList((prev) => prev.filter((c) => c.id !== id));
      setSelectedColors((prev) => prev.filter((c) => c !== id));
    }
  }

  return (
    <>
      <main className="w-full relative min-h-screen bg-[#f0f2f5] dark:bg-dark3 pt-12 pb-16">
        {successModal && (
          <div className="fixed top-6 left-6 bg-green-400  z-1000 px-2 py-1 text-white flex gap-2 rounded-xl">
            <Check></Check> Editado con éxito
          </div>
        )}
        {errorModal && (
          <div className="fixed top-6 left-6 bg-red-500 z-1000 px-3 py-2 text-white flex items-center gap-2 rounded-xl shadow-lg animate-in fade-in slide-in-from-left-4">
            <X size={18} /> Error al guardar cambios
          </div>
        )}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col gap-6 mb-8">
            <p
              className="text-xs flex items-center gap-2 cursor-pointer hover:text-sky-400 dark:hover:text-orange-300"
              onClick={comeBack}
            >
              <ArrowLeft className="w-4 h-4" /> Volver al Dashboard
            </p>
            <h1 className="text-2xl font-medium text-gray-800 dark:text-gray-200 tracking-wide">
              Editar productos
            </h1>
          </div>

          {/* Grilla Adaptativa: 2 columnas en mobile, hasta 4 en desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => openModal(product)}
                className="bg-white dark:bg-dark2 rounded-2xl border border-gray-200 dark:border-black overflow-hidden cursor-pointer hover:border-sky-400  hover:shadow-sm transition-all group"
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
                      className="object-cover w-full h-full"
                    />
                  )}
                  {/* Overlay de acciones: Visible siempre en mobile para mejor UX, hover en desktop */}
                  <div className="absolute inset-0 bg-black/5 md:bg-black/0 md:group-hover:bg-black/10 transition-colors flex items-center justify-center gap-3">
                    <PenLine
                      size={20}
                      className="text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity drop-shadow-md"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(product);
                        setTimeout(() => setShowDeleteConfirm(true), 0);
                      }}
                      className="md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2
                        size={20}
                        className="text-red-500 drop-shadow-md"
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
            className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                e.stopPropagation();
                closeModal();
              } else {
                e.stopPropagation();
              }
            }}
          >
            <div className="bg-white dark:bg-dark3 rounded-t-3xl sm:rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-dark3 z-20 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="text-[10px] tracking-widest text-sky-500 dark:text-[hsl(41,98%,65%)] uppercase font-medium">
                    Editor de producto
                  </p>
                  <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 truncate max-w-[200px] sm:max-w-none">
                    {selected.title}
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form: Stacked on mobile (flex-col), Side-by-side on desktop (grid) */}
              <form
                onSubmit={handleSubmit}
                className="p-6 flex flex-col md:grid md:grid-cols-[1fr_220px] gap-8"
              >
                {/* Columna Imagen (Primero en mobile para contexto visual) */}
                <div className="flex flex-col gap-3 md:order-2">
                  <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block">
                    Imagen del producto
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square w-full max-w-[280px] mx-auto md:max-w-none bg-gray-100 dark:bg-dark2 rounded-xl flex items-center justify-center border border-dashed border-gray-300 dark:hover:border-[hsl(35,100%,50%)] hover:border-sky-400 transition-colors cursor-pointer overflow-hidden relative"
                  >
                    {badge !== "None" && (
                      <div className="absolute top-2 left-2 z-10 bg-sky-400 dark:bg-[hsl(41,98%,65%)] text-sky-900 dark:text-gray-600 text-[10px] font-medium px-2 py-1 rounded-md uppercase">
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
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                {/* Columna Datos */}
                <div className="flex flex-col gap-5 md:order-1">
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
                      className="w-full border border-gray-200 dark:bg-dark2/40 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:border-sky-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full border border-gray-200 dark:bg-dark2/40 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Categoría */}
                    <div>
                      <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                        Categoría
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={categoryId}
                          onChange={(e) => setCategoryId(e.target.value)}
                          className="flex-1 border border-gray-200 dark:bg-dark2/65 dark:text-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                        >
                          <option value="">Sin categoría</option>
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
                          className="dark:hover:border-[hsl(35,100%,50%)] cursor-pointer w-10 h-10 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Material */}
                    <div>
                      <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                        Material
                      </label>
                      <div className="flex gap-2">
                        <select
                          value={materialId}
                          onChange={(e) => setMaterialId(e.target.value)}
                          className="flex-1 border border-gray-200 dark:bg-dark2/65 dark:text-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
                        >
                          <option value="">Sin material</option>
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
                          className="dark:hover:border-[hsl(35,100%,50%)] cursor-pointer w-10 h-10 shrink-0 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dimensiones y Estado en Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase block mb-1">
                        Estado
                      </label>
                      <select
                        value={stateId}
                        onChange={(e) => setStateId(e.target.value)}
                        className="w-full border border-gray-200 dark:bg-dark2/65 dark:text-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
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

                        <span className="text-gray-300 text-xs shrink-0">
                          ×
                        </span>

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

                        <span className="text-gray-300 text-xs shrink-0">
                          ×
                        </span>

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

                  {/* Colores */}
                  <div>
                    <label className="text-[11px] tracking-widest text-gray-400 uppercase block mb-2">
                      Colores disponibles
                    </label>
                    <div className="flex flex-wrap gap-3 items-center">
                      {colorList.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleColor(c.id)}
                          style={{ backgroundColor: `#${c.hex_code}` }}
                          className={`w-8 h-8 rounded-full transition-all ${
                            selectedColors.includes(c.id)
                              ? "ring-2 ring-offset-2 ring-sky-500 scale-110"
                              : "border border-gray-200"
                          }`}
                        />
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setNewHex("#000000");
                          setModal("color");
                        }}
                        className="w-8 h-8 cursor-pointer  dark:hover:border-[hsl(35,100%,50%)] rounded-full border border-dashed border-gray-400 flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer Fijo en mobile opcionalmente, aquí lo dejo al final del form */}
                <div className="order-2 md:col-span-2 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-300 dark:border-black">
                  {/* Botón Eliminar - Ahora alineado correctamente */}
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full border border-gray-300 dark:border-black sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-red-500 font-medium text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} /> Eliminar Producto
                  </button>

                  {/* Grupo de botones Guardar/Cancelar */}
                  <div className="w-full sm:w-auto flex gap-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="flex-1 sm:px-6 py-2.5 border border-gray-200 dark:border-gray-700 dark:text-gray-300 rounded-xl text-sm"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className="flex-[2] sm:px-8 py-2.5 bg-sky-400 dark:bg-[hsl(41,98%,65%)] text-sky-900 dark:text-gray-800 font-bold rounded-xl text-sm disabled:opacity-50"
                    >
                      {loading ? "Guardando..." : "Guardar"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Confirmación de eliminación (Ajustado para mobile) */}
            {showDeleteConfirm && (
              <div className="absolute inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-dark2 rounded-2xl p-6 max-w-xs w-full text-center">
                  <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={24} />
                  </div>
                  <h3 className="text-lg font-bold tracking-wide text-gray-800 dark:text-white mb-2">
                    ¿Estás seguro?
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Esta acción eliminará permanentemente el producto.
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleDelete}
                      className="w-full py-3 bg-red-500 text-white rounded-xl font-medium"
                    >
                      Sí, eliminar
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="w-full py-3 text-gray-500 font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {modal === "category" && (
          <AddOptionModal
            title="Nueva Categoría"
            list={categoryList}
            onClose={() => setModal(null)}
            onConfirm={handleAddCategory}
            onDelete={handleDeleteCategory}
            loading={modalLoading}
          >
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-200 dark:bg-dark2/40 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400"
              autoFocus
            />
          </AddOptionModal>
        )}

        {modal === "material" && (
          <AddOptionModal
            title="Nuevo Material"
            list={materialList}
            onClose={() => setModal(null)}
            onConfirm={handleAddMaterial}
            onDelete={handleDeleteMaterial}
            loading={modalLoading}
          >
            <input
              type="text"
              placeholder="Nombre del material"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-gray-200 dark:bg-dark2/40 dark:text-white rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400"
              autoFocus
            />
          </AddOptionModal>
        )}

        {modal === "color" && (
          <AddOptionModal
            title="Nuevo Color"
            list={colorList}
            onClose={() => setModal(null)}
            onConfirm={handleAddColor}
            onDelete={handleDeleteColor}
            loading={modalLoading}
          >
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Nombre (opcional)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full border border-gray-200 dark:bg-dark2/40 dark:text-white rounded-lg px-3 py-2 text-sm outline-none"
              />
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={newHex}
                  onChange={(e) => setNewHex(e.target.value)}
                  className="w-12 h-12 rounded cursor-pointer bg-transparent"
                />
                <span className="text-sm font-mono dark:text-white uppercase">
                  {newHex}
                </span>
              </div>
            </div>
          </AddOptionModal>
        )}
      </main>
    </>
  );
}


