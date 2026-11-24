import { books } from '@/data/books';
import { getPodcastSeries } from '@/lib/qa-resources';
import { isLanguage } from '@/lib/site';
import { pageMetadata } from '@/lib/seo/site';
export async function generateMetadata({params}:{params:Promise<{lang:string;showId:string}>}) {
 const {lang,showId}=await params;const series=(await getPodcastSeries(isLanguage(lang) ? lang : 'es')).find(s=>s.id===showId);const book=books.find(b=>b.id===showId);
 return series ? pageMetadata(`/medios/show/${showId}`,`Podcast: ${book?.title || showId}`,`Escucha los episodios de ${book?.title || showId}: conversaciones de Marcos Constandse sobre conciencia y Humanismo Evolutivo.`) : {title:'Serie no encontrada',robots:{index:false,follow:false}};
}
export default function Layout({children}:{children:React.ReactNode}){return children;}
