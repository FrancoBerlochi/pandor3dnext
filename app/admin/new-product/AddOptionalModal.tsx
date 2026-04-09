"use client";

import { useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";

type ListItem = { id: number; name: string; hex_code?: string };

type Props = {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  onDelete?: (id: number) => void;
  loading?: boolean;
  list?: ListItem[];
  children: React.ReactNode;
};

export default function AddOptionModal({
  title,
  onClose,
  onConfirm,
  onDelete,
  loading,
  list,
  children,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/40  flex items-center justify-center"
    >
      <div className="bg-white dark:bg-dark3 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-medium text-gray-800 dark:text-gray-200 tracking-wider">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-red-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lista existente con botón eliminar */}
        {list && list.length > 0 && (
          <div className="mb-4 flex flex-col gap-1 max-h-40 overflow-y-auto">
            {list.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark2 group"
              >
                <div className="flex items-center gap-2">
                  {item.hex_code && (
                    <div
                      className="w-4 h-4 rounded-full border border-gray-200"
                      style={{ backgroundColor: `#${item.hex_code}` }}
                    />
                  )}
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                </div>
                {onDelete && (
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 cursor-pointer transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {list && list.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mb-4">
            <p className="text-[11px] tracking-widest text-gray-400 dark:text-gray-200 uppercase mb-3">
              Agregar nuevo
            </p>
          </div>
        )}

        <div className="flex flex-col gap-4">{children}</div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 dark:text-gray-300 dark:hover:border-orange-500 cursor-pointer rounded-xl text-sm text-gray-600 hover:border-gray-400 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 bg-sky-400 hover:bg-sky-500 dark:bg-[hsl(41,98%,65%)] dark:text-gray-500 cursor-pointer text-sky-900 font-medium text-sm rounded-xl disabled:opacity-50 transition-colors"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
