import { books } from '@/data/books';
import { podcastSeries } from '@/data/media';
import { pageMetadata } from '@/lib/seo/site';
export async function generateMetadata({params}:{params:Promise<{showId:string}>}) {
 const {showId}=await params;const series=podcastSeries.find(s=>s.id===showId);const book=books.find(b=>b.id===showId);
 return series ? pageMetadata(`/medios/show/${showId}`,`Podcast: ${book?.title || showId}`,`Escucha los episodios de ${book?.title || showId}: conversaciones de Marcos Constandse sobre conciencia y Humanismo Evolutivo.`) : {title:'Serie no encontrada',robots:{index:false,follow:false}};
}
export default function Layout({children}:{children:React.ReactNode}){return children;}
