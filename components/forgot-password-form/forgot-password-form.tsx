"use client";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1.5 p-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Revisá tu Email
            </h2>
            <p className="text-sm text-gray-500">
              Las instrucciones están ahí
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-1.5 p-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Resetea tu contraseña
            </h2>
            <p className="text-sm text-gray-500">
              Escribí tu email y vas a recibir un correo para resetear tu contraseña
            </p>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? "Enviando..." : "Enviar reseteo"}
                </button>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                Ya tenés una cuenta?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-700"
                >
                  Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
