import { pageMetadata } from '@/lib/seo/site';
export const metadata = { ...pageMetadata('/chatbot', 'Asistente de Humanismo Evolutivo', 'Explora preguntas sobre conciencia y filosofía con el asistente de Humanismo Evolutivo.'), robots: {index:false,follow:false} };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
