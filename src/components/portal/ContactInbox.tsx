'use client';
import { useEffect, useState } from 'react';
type Submission = { id: string; name: string; email: string; phone: string | null; subject: string; message: string; locale: string; created_at: string };
export default function ContactInbox() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/contact', { signal: controller.signal }).then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron cargar los mensajes.');
      setRows(result.data || []);
    }).catch(e => { if (!controller.signal.aborted) setError(e.message); });
    return () => controller.abort();
  }, []);
  return <section className="portal-admin-section" aria-labelledby="contact-inbox-title"><h2 id="contact-inbox-title">Mensajes de contacto</h2>
    {error ? <p role="alert">{error}</p> : null}
    {!rows.length && !error ? <p>No hay mensajes.</p> : null}
    <ul className="portal-school-table">{rows.map(row => <li key={row.id}><strong>{row.subject}</strong><p>{row.name} · <a href={`mailto:${row.email}`}>{row.email}</a>{row.phone ? ` · ${row.phone}` : ''}</p><p>{row.message}</p><small><time dateTime={row.created_at}>{new Date(row.created_at).toLocaleString('es-MX')}</time> · {row.locale}</small></li>)}</ul>
  </section>;
}
