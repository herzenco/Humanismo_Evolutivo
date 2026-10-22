import { events } from '@/data/events';
import { pageMetadata } from '@/lib/seo/site';
export async function generateMetadata({params}:{params:Promise<{eventId:string}>}) {
 const {eventId}=await params; const event=events.find(e=>e.id===eventId);
 return event ? pageMetadata(`/eventos/${event.id}`,event.id==='smge-2025' ? 'Ingreso de Marcos Constandse a la Sociedad Mexicana de Geografía y Estadística' : 'La Conferencia de la Paz', event.id==='smge-2025' ? 'Conoce la ceremonia de ingreso de Marcos Constandse y su compromiso con el conocimiento y el desarrollo integral de México.' : 'Una conferencia sobre conciencia, evolución, paz y responsabilidad compartida.') : {title:'Evento no encontrado',robots:{index:false,follow:false}};
}
export default function Layout({children}:{children:React.ReactNode}){return children;}
