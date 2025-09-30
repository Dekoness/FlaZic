import { Link } from 'react-router-dom'


export default function Footer() {
return (
<footer className="border-t border-black/5 bg-white">
<div className="container-responsive py-10 grid md:grid-cols-3 gap-8">
<div>
<div className="text-xl font-extrabold">Flazic</div>
<p className="mt-2 text-sm text-black/70 max-w-sm">La red social de música para artistas amateurs y oyentes curiosos.
</p>
</div>
<div className="text-sm grid grid-cols-2 gap-6">
<div>
<div className="font-semibold">Producto</div>
<ul className="mt-2 space-y-1 text-black/70">
<li><Link to="/explore" className="hover:underline">Explorar</Link></li>
<li><Link to="/upload" className="hover:underline">Subir</Link></li>
</ul>
</div>
<div>
<div className="font-semibold">Legal</div>
<ul className="mt-2 space-y-1 text-black/70">
<li><a className="hover:underline" href="#">Términos</a></li>
<li><a className="hover:underline" href="#">Privacidad</a></li>
</ul>
</div>
</div>
</div>
</footer>
)
}