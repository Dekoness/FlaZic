import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function Login() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const registered = new URLSearchParams(search).get("registered") === "1";

  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const isEmailValid = validateEmail(form.email);
  const canSubmit = isEmailValid && form.password.trim().length >= 1 && !loading;

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setServerError("");
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    try {
      setLoading(true);
      setServerError("");
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });
      if (!res.ok) {
        let msg = "No se pudo iniciar sesión";
        try { msg = (await res.json())?.message || msg; } catch { msg = (await res.text()) || msg; }
        throw new Error(msg);
      }
      const data = await res.json();
      const storage = form.remember ? localStorage : sessionStorage;
      storage.setItem("flazic_token", data.token || "demo-token");
      storage.setItem("flazic_user", JSON.stringify(data.user || { email: form.email }));
      navigate("/");
    } catch (err) {
      setServerError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-0px)]">
      {/* Fondo degradado + blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-flz-cream via-white to-flz-cream" />
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-flz-teal/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-flz-purple/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-24 h-72 w-72 rounded-full bg-flz-yellow/25 blur-3xl" />
      </div>

      <div className="container-responsive py-16">
        <div className="mx-auto max-w-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-black/5 px-3 py-1 shadow">
              <span className="h-2 w-2 rounded-full bg-flz-teal" />
              <span className="text-xs font-medium text-black/70">Bienvenido de nuevo</span>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Conéctate a <span className="text-flz-purple">Flazic</span>
            </h1>
            <p className="mt-2 text-black/60">
              Descubre nuevas voces o sube tus últimos temas.
            </p>
            {registered && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-green-700 text-sm">
                Cuenta creada ✅ Inicia sesión.
              </div>
            )}
          </div>

          {/* Card “glass” con borde degradado */}
          <div className="rounded-[22px] p-[1px] bg-gradient-to-r from-flz-teal via-flz-purple to-flz-yellow shadow-flz">
            <form
              onSubmit={handleSubmit}
              className="rounded-[21px] bg-white/80 backdrop-blur border border-white/60 p-6 md:p-8 space-y-5"
              noValidate
            >
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">
                  Email
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-flz-teal"
                  />
                  {form.email && !isEmailValid && (
                    <p className="mt-1 text-sm text-red-600">Email no válido.</p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Contraseña
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Tu contraseña"
                    className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 pr-24 outline-none ring-offset-2 focus:ring-2 focus:ring-flz-purple"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-lg bg-flz-purple text-white hover:opacity-90"
                  >
                    {showPw ? "Ocultar" : "Ver"}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={form.remember}
                    onChange={handleChange}
                    className="accent-flz-teal"
                  />
                  Recuérdame
                </label>
                <Link to="/forgot" className="text-sm text-flz-teal hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Error servidor */}
              {serverError && (
                <div className="rounded-xl bg-red-50 text-red-700 text-sm p-3 border border-red-100">
                  {serverError}
                </div>
              )}

              {/* Botón principal con gradiente */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full rounded-2xl px-4 py-3 font-bold text-white transition shadow ${
                  canSubmit
                    ? "bg-gradient-to-r from-flz-teal via-flz-purple to-flz-yellow hover:opacity-90"
                    : "bg-black/20 cursor-not-allowed"
                }`}
              >
                {loading ? "Entrando..." : "Iniciar sesión"}
              </button>

              {/* Acceso rápido (demo UI) */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm hover:bg-white"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-sm hover:bg-white"
                >
                  Apple
                </button>
              </div>

              <p className="text-sm text-black/60 text-center">
                ¿Aún no tienes cuenta?{" "}
                <Link to="/signup" className="text-flz-purple font-medium underline">
                  Crear cuenta
                </Link>
              </p>
            </form>
          </div>

          {/* Cinta de color inferior */}
          <div className="mt-6 h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-flz-teal via-flz-purple to-flz-yellow" />
        </div>
      </div>
    </div>
  );
}
