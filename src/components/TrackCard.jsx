import { Link } from 'react-router-dom'


export default function TrackCard({ id, title, artist, cover, genre }) {
return (
<Link to={`/track/${id}`} className="group">
<div className="rounded-2xl overflow-hidden bg-white border border-black/5 shadow hover:shadow-lg transition">
<div className="aspect-square bg-flz-purple/10">
{cover ? (
<img src={cover} alt={title} className="h-full w-full object-cover" />
) : (
<div className="h-full w-full grid place-items-center text-flz-purple font-bold">FLZ</div>
)}
</div>
<div className="p-3">
<div className="text-sm text-black/60">{artist}</div>
<div className="font-bold leading-tight group-hover:underline">{title}</div>
<div className="mt-1 inline-flex items-center gap-2 text-xs">
<span className="px-2 py-0.5 rounded-full bg-flz-teal/10 text-flz-teal">{genre}</span>
<span className="px-2 py-0.5 rounded-full bg-flz-yellow/20 text-flz-ink">Nuevo</span>
</div>
</div>
</div>
</Link>
)
}