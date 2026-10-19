'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { books } from '@/data/books';

export default function BooksIntro() {
  const { language } = useLanguage();
  const es = language === 'es';
  const covers = [books[1], books[2], books[0], books[3], books[4]];
  return <section className="design-books-hero"><div className="design-content-width design-books-hero-grid"><div><span className="design-eyebrow design-outline-badge">{es ? 'EXPLORACIÓN FILOSÓFICA' : 'PHILOSOPHICAL EXPLORATION'}</span><h1>{es ? 'Biblioteca' : 'Philosophical'}<em>{es ? 'filosófica' : 'library'}</em></h1><p>{es ? 'Explora las obras de Marcos Constandse que conectan ciencia, filosofía, espiritualidad y ecología bajo una visión integradora del conocimiento humano.' : 'Explore the books of Marcos Constandse connecting science, philosophy, spirituality and ecology through an integrated vision of human knowledge.'}</p><span className="design-eyebrow">{books.length} {es ? 'OBRAS' : 'BOOKS'} · MARCOS CONSTANDSE MADRAZO</span><div className="design-actions"><a href="#obras" className="design-button design-button-gold">{es ? 'Explorar las obras' : 'Explore the books'}<ArrowRight size={20} /></a><Link href="/autor" className="design-button design-button-white">{es ? 'Conoce al autor' : 'Meet the author'}</Link></div></div><div className="design-books-fan" role="img" aria-label={es ? 'Portadas de cinco libros de Marcos Constandse Madrazo' : 'Five books by Marcos Constandse Madrazo'}><div aria-hidden="true" />{covers.map((book, index) => <img className={`design-fan-book design-fan-${index}`} key={book.id} src={book.coverImage} alt="" />)}</div></div></section>;
}
