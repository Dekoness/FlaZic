import { Link } from "react-router-dom";

export default function UploadCTA() {
  return (
    <section className="py-16">
      <div className="container-responsive">
        <div className="rounded-3xl p-8 md:p-12 bg-gradient-to-r from-flz-teal via-flz-purple to-flz-yellow text-white shadow-flz">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-black">Tu música merece ser escuchada</h3>
              <p className="mt-2 text-white/90">
                Publica tus primeros temas hoy y entra en las listas de descubrimiento.
              </p>
            </div>
            <div className="md:text-right">
              <Link
                to="/upload"
                className="inline-block px-6 py-3 rounded-2xl bg-flz-cream text-flz-ink font-bold hover:opacity-90"
              >
                Subir ahora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
