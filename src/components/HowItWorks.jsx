export default function HowItWorks() {
const steps = [
{ num: '01', title: 'Crea tu perfil', desc: 'Abre tu cuenta como artista u oyente.' },
{ num: '02', title: 'Sube tus temas', desc: 'MP3/WAV con portada y etiquetas.' },
{ num: '03', title: 'Consigue feedback', desc: 'Comentarios, me gusta y playlists.' },
]


return (
<section className="bg-gradient-to-b from-white to-white/60 py-16">
<div className="container-responsive">
<div className="text-center max-w-2xl mx-auto">
<h2 className="text-3xl font-extrabold">¿Cómo funciona?</h2>
<p className="mt-3 text-black/70">Flazic conecta talento emergente con oyentes curiosos. Sube, comparte y crece.</p>
</div>


<div className="mt-10 grid md:grid-cols-3 gap-6">
{steps.map((s) => (
<div key={s.num} className="rounded-2xl bg-white border border-black/5 p-6 shadow-flz">
<div className="text-sm font-bold text-flz-teal">{s.num}</div>
<div className="mt-2 text-xl font-bold">{s.title}</div>
<p className="mt-2 text-black/70">{s.desc}</p>
</div>
))}
</div>
</div>
</section>
)
}