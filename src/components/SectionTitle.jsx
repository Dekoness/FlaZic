export default function SectionTitle({ overline, title, cta }) {
return (
<div className="flex items-end justify-between gap-4">
<div>
{overline && (
<div className="text-xs uppercase tracking-widest text-black/60">{overline}</div>
)}
<h2 className="text-2xl sm:text-3xl font-extrabold">{title}</h2>
</div>
{cta}
</div>
)
}