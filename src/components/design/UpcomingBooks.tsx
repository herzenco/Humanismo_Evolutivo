import Link from 'next/link';
import { upcomingBooks } from '@/data/books';

export default function UpcomingBooks() {
  return <section className="design-content-width py-16" aria-label="Próximamente">
    <p className="design-eyebrow">5 obras · Próximamente</p>
    <h2 className="font-heading text-3xl mb-8">En preparación editorial</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {upcomingBooks.map((book, index) => <article id={book.id} key={book.id} className="border border-current/20 rounded-sm p-6 flex flex-col min-w-0 bg-cream-light text-navy-dark">
        <span className="text-sm tracking-widest mb-8">{String(index + 6).padStart(2, '0')}</span>
        <h3 className="font-heading text-xl break-words mb-6 flex-1">{book.title}</h3>
        <p className="text-sm uppercase tracking-wider">Próximamente</p>
        {book.questions && <p className="text-sm mt-4">Integra <Link href="/51preguntas" className="underline">Las 51 preguntas de Introducción al Humanismo Evolutivo Transpersonal</Link>.</p>}
      </article>)}
    </div>
  </section>;
}
