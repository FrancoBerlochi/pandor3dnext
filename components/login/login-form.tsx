"use client";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = await createClient();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      window.location.href = "/admin";
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        
        {/* CardHeader */}
        <div className="flex flex-col gap-1.5 p-6">
          <h2 className="text-2xl tracking-wider font-semibold leading-tight tracking-tight text-gray-900">
            Login
          </h2>
          <p className="text-sm text-gray-500">
            Ingresá tu email
          </p>
        </div>

        {/* CardContent */}
        <div className="p-6 pt-0">
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">

              {/* Email field */}
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

              {/* Password field */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-gray-500 underline-offset-4 hover:underline"
                  >
                    Olvidaste tu contraseña?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50"
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Cargando..." : "Login"}
              </button>
            </div>

            
          </form>
        </div>
      </div>
    </div>
  );
}
