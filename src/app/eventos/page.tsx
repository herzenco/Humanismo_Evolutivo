'use client';

import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPin, Video } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';
import EventsIntro from '@/components/design/EventsIntro';
import { useLanguage } from '@/contexts/LanguageContext';
import { events } from '@/data/events';

export default function EventsPage() {
  const { t, language } = useLanguage();
  const es = language === 'es';
  return <PageWrapper><EventsIntro /><section id="lista-eventos" className="design-event-list"><div className="design-content-width"><div className="design-section-heading"><span className="design-eyebrow">{es ? 'ENCUENTROS Y CONVERSACIONES' : 'MEETINGS AND CONVERSATIONS'}</span><h2>{es ? 'Presentaciones y conferencias' : 'Presentations and conferences'}</h2></div>{events.map((event, index) => <article className="design-event-card" key={event.id}><Link href={`/eventos/${event.id}`} className="design-event-image" aria-label={t(event.titleKey)}><img src={event.imageUrl} alt={t(event.titleKey)} loading="lazy" /></Link><div><div className="design-tags">{index === 0 ? <span>{es ? 'MÁS RECIENTE' : 'MOST RECENT'}</span> : null}<span>{t(event.categoryKey)}</span>{event.videoUrl ? <span><Video size={15} />{es ? 'Con video' : 'Video available'}</span> : null}</div><h2><Link href={`/eventos/${event.id}`}>{t(event.titleKey)}</Link></h2><p>{t(event.descriptionKey)}</p><div className="design-event-meta"><span><CalendarDays size={18} />{new Date(`${event.date}T12:00:00`).toLocaleDateString(es ? 'es-MX' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span><span><MapPin size={18} />{event.location}</span></div><Link href={`/eventos/${event.id}`} className="design-button">{es ? 'Explorar evento' : 'Explore event'}<ArrowRight size={18} /></Link></div></article>)}</div></section></PageWrapper>;
}
