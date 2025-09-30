import { Link, NavLink } from 'react-router-dom'
import logo from "../assets/logo.png"; 


const navLink = ({ isActive }) =>
`px-3 py-2 rounded-xl text-sm font-medium transition ${
isActive ? 'bg-flz-teal text-white' : 'text-flz-ink hover:bg-white/60'
}`


export default function Navbar() {
return (
<header className="sticky top-0 z-40 bg-flz-cream/90 backdrop-blur border-b border-black/5">
<div className="container-responsive h-16 flex items-center justify-between">
<Link to="/" className="flex items-center gap-2">
<img src={logo} alt="logo" className="w-20 h-20" />
</Link>


<nav className="hidden md:flex items-center gap-1">
<NavLink to="/" end className={navLink}>Inicio</NavLink>
<NavLink to="/explore" className={navLink}>Explorar</NavLink>
<NavLink to="/upload" className={navLink}>Subir</NavLink>
</nav>


<div className="flex items-center gap-2">
<NavLink to="/login" className="px-3 py-2 text-sm font-medium hover:underline">Entrar</NavLink>
<NavLink to="/signup" className="px-3 py-2 text-sm font-semibold rounded-xl bg-flz-purple text-white hover:opacity-90">Crear cuenta</NavLink>
</div>
</div>
</header>
)
}