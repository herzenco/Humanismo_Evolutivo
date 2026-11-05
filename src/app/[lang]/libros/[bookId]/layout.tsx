import { books } from '@/data/books';
import { pageMetadata } from '@/lib/seo/site';
export async function generateMetadata({params}:{params:Promise<{bookId:string}>}) {
 const {bookId}=await params; const book=books.find(b=>b.id===bookId);
 return book ? pageMetadata(`/libros/${book.id}`,book.title,book.excerpt.slice(0,180),book.keywords) : {title:'Libro no encontrado',robots:{index:false,follow:false}};
}
export default function Layout({children}:{children:React.ReactNode}){return children;}
