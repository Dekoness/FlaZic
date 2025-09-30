import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function passwordStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0..5
}

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "artist",
    password: "",
    confirm: "",
    terms: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const isEmailValid = validateEmail(form.email);
  const pwScore = passwordStrength(form.password);
  const pwMatch = form.password && form.password === form.confirm;

  const canSubmit =
    form.name.trim().length >= 2 &&
    isEmailValid &&
    pwScore >= 3 &&
    pwMatch &&
    form.terms &&
    !loading;

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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          password: form.password,
        }),
      });
      if (!res.ok) {
        let msg = "No se pudo crear la cuenta";
        try { msg = (await res.json())?.message || msg; }
        catch { msg = (await res.text()) || msg; }
        throw new Error(msg);
      }
      navigate("/login?registered=1");
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
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-black/5 px-3 py-1 shadow">
              <span className="h-2 w-2 rounded-full bg-flz-purple" />
              <span className="text-xs font-medium text-black/70">Únete a la comunidad</span>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-tight">
              Crea tu cuenta en <span className="text-flz-teal">Flazic</span>
            </h1>
            <p className="mt-2 text-black/60">Comparte tu música o descubre artistas emergentes.</p>
          </div>

          {/* Card glass con borde degradado */}
          <div className="rounded-[22px] p-[1px] bg-gradient-to-r from-flz-teal via-flz-purple to-flz-yellow shadow-flz">
            <form
              onSubmit={handleSubmit}
              className="rounded-[21px] bg-white/80 backdrop-blur border border-white/60 p-6 md:p-8 space-y-6"
              noValidate
            >
              {/* Nombre */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium">Nombre</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre artístico o real"
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-flz-teal"
                />
                {form.name && form.name.trim().length < 2 && (
                  <p className="mt-1 text-sm text-red-600">Introduce al menos 2 caracteres.</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tucorreo@ejemplo.com"
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-flz-teal"
                />
                {form.email && !isEmailValid && (
                  <p className="mt-1 text-sm text-red-600">Email no válido.</p>
                )}
              </div>

              {/* Rol */}
              <div>
                <span className="block text-sm font-medium">Rol</span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 hover:bg-white">
                    <input
                      type="radio"
                      name="role"
                      value="artist"
                      checked={form.role === "artist"}
                      onChange={handleChange}
                    />
                    <span>Artista</span>
                  </label>
                  <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white/70 px-3 py-2 hover:bg-white">
                    <input
                      type="radio"
                      name="role"
                      value="listener"
                      checked={form.role === "listener"}
                      onChange={handleChange}
                    />
                    <span>Oyente</span>
                  </label>
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPw ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 8 caracteres"
                    className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 pr-28 outline-none ring-offset-2 focus:ring-2 focus:ring-flz-purple"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-lg bg-flz-purple text-white hover:opacity-90"
                  >
                    {showPw ? "Ocultar" : "Ver"}
                  </button>
                </div>

                {/* Barra fuerza */}
                <div className="mt-2">
                  <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                    <div
                      className={
                        "h-2 transition-all " +
                        [
                          "w-0",
                          "w-1/5 bg-red-500",
                          "w-2/5 bg-orange-500",
                          "w-3/5 bg-yellow-500",
                          "w-4/5 bg-lime-500",
                          "w-full bg-green-600",
                        ][pwScore]
                      }
                    />
                  </div>
                  <p className="mt-1 text-xs text-black/60">
                    Fuerza: {["—","Muy débil","Débil","Media","Buena","Fuerte"][pwScore]}
                  </p>
                </div>
              </div>

              {/* Confirmación */}
              <div>
                <label htmlFor="confirm" className="block text-sm font-medium">Confirmar contraseña</label>
                <input
                  id="confirm"
                  name="confirm"
                  type={showPw ? "text" : "password"}
                  value={form.confirm}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2 outline-none ring-offset-2 focus:ring-2 focus:ring-flz-teal"
                />
                {form.confirm && !pwMatch && (
                  <p className="mt-1 text-sm text-red-600">Las contraseñas no coinciden.</p>
                )}
              </div>

              {/* Términos */}
              <div className="flex items-start gap-3">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={form.terms}
                  onChange={handleChange}
                  className="mt-1 accent-flz-teal"
                />
                <label htmlFor="terms" className="text-sm text-black/80">
                  Acepto los{" "}
                  <Link to="/legal/terminos" className="text-flz-teal underline">
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link to="/legal/privacidad" className="text-flz-teal underline">
                    Política de Privacidad
                  </Link>.
                </label>
              </div>

              {/* Error servidor */}
              {serverError && (
                <div className="rounded-xl bg-red-50 text-red-700 text-sm p-3 border border-red-100">
                  {serverError}
                </div>
              )}

              {/* CTA */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={`w-full rounded-2xl px-4 py-3 font-bold text-white transition shadow ${
                  canSubmit
                    ? "bg-gradient-to-r from-flz-teal via-flz-purple to-flz-yellow hover:opacity-90"
                    : "bg-black/20 cursor-not-allowed"
                }`}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>

              <p className="text-sm text-black/60 text-center">
                ¿Ya tienes cuenta?{" "}
                <Link to="/login" className="text-flz-purple font-medium underline">
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>

          {/* Cinta decorativa */}
          <div className="mt-6 h-1 w-32 mx-auto rounded-full bg-gradient-to-r from-flz-teal via-flz-purple to-flz-yellow" />
        </div>
      </div>
    </div>
  );
}
