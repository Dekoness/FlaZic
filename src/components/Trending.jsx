import SectionTitle from './SectionTitle'
import TrackCard from './TrackCard'


const mock = [
{ id: 1, cover: 'https://media.istockphoto.com/id/1615644280/es/foto/primer-plano-de-las-manos-del-dj-controlando-una-mesa-de-m%C3%BAsica-en-un-club-nocturno.jpg?s=612x612&w=0&k=20&c=nEt_dO5K7_Sh62w2ZrtMH65HXpa9_oyoi6ptL1DlAI8=', title: 'Sunset Loop', artist: 'DJ Nova', genre: 'House' },
{ id: 2, cover: 'https://scene7.toyota.eu/is/image/toyotaeurope/Grimes-750x750_tcm-3153-1204335:Medium-Landscape?ts=0&resMode=sharp2&op_usm=1.75,0.3,2,0', title: 'Purple Streets', artist: 'Lía M.', genre: 'Indie' },
{ id: 3, cover: 'https://as01.epimg.net/epik/imagenes/2020/06/17/portada/1592391100_320877_1592392275_noticia_normal_recorte1.jpg', title: 'Teal Dreams', artist: 'Kaito', genre: 'Lo‑fi' },
{ id: 4, cover: 'https://s3.amazonaws.com/rtvc-assets-senalcolombia.gov.co/s3fs-public/inline-images/artistas-hip-hop-fep-2024-penyair.jpg', title: 'Vibes de Barrio', artist: 'Rafa S.', genre: 'Hip‑hop' },
{ id: 5, cover:'https://www.lafactoriadelshow.com/pujaes/avatars/fitxes/9396_xth.jpg?67921f4d', title: 'Luna Amarilla', artist: 'Sara V.', genre: 'Pop' },
{ id: 6, cover: 'https://album.mediaset.es/eimg/10000/2021/11/19/clipping_qYuaYf_777e.jpg?w=1200&h=900', title: 'Camino al Teide', artist: 'M. Ortega', genre: 'Folk' },
]


export default function Trending() {
return (
<section className="container-responsive py-12">
<SectionTitle
overline="Descubre"
title="Tendencias de esta semana"
cta={<a href="/explore" className="text-sm font-semibold hover:underline">Ver todo →</a>}
/>


<div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
{mock.map((t) => (
<TrackCard key={t.id} {...t} />
))}
</div>
</section>
)
}