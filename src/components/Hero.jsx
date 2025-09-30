import { Link } from 'react-router-dom'


export default function Hero() {
return (
<section className="relative overflow-hidden">
<div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-flz-teal/20 blur-3xl"/>
<div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-flz-purple/20 blur-3xl"/>


<div className="container-responsive py-16 sm:py-24">
<div className="grid lg:grid-cols-2 gap-10 items-center">
<div>
<h1 className="text-4xl sm:text-5xl font-black tracking-tight">
Sube tu música.
<span className="block text-flz-teal">Encuentra tu audiencia.</span>
</h1>
<p className="mt-4 text-lg text-black/70 max-w-prose">
Flazic es la comunidad donde artistas amateurs comparten sus canciones y
oyentes curiosos descubren nuevas voces. Gratis, social y con foco en el talento emergente.
</p>
<div className="mt-6 flex flex-wrap gap-3">
<Link to="/upload" className="px-5 py-3 rounded-2xl bg-flz-yellow font-bold shadow-flz hover:bg-flz-yellow-2">
Empezar a subir
</Link>
<Link to="/explore" className="px-5 py-3 rounded-2xl border border-flz-ink/10 bg-white hover:bg-white/70 font-semibold">
Explorar temas
</Link>
</div>
<div className="mt-6 flex items-center gap-6 text-sm text-black/60">
<span>🎧 +2.4k oyentes activos</span>
<span>🎤 +1.1k artistas</span>
<span>🚀 Crece cada semana</span>
</div>
</div>


<div className="relative">
<div className="aspect-video rounded-3xl bg-gradient-to-br from-flz-yellow to-flz-purple p-1 shadow-flz">
<div className="h-full w-full rounded-2xl bg-flz-cream/80 grid place-items-center text-center p-8">
<div>
<div className="text-sm uppercase tracking-widest text-black/60">Demo del reproductor</div>
<div className="mt-4 text-2xl font-extrabold">“Sunset Loop” — DJ Nova</div>
<div className="mt-4 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow">
<button className="h-10 w-10 rounded-full bg-flz-teal text-white font-bold">▶</button>
<div className="h-2 w-56 bg-black/10 rounded-full overflow-hidden">
<div className="h-full w-1/3 bg-flz-purple"/>
</div>
<span className="text-sm">01:12 / 03:45</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
)
}