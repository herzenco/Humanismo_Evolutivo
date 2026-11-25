'use client';

import { useState, type FormEvent } from 'react';
import Link from '@/components/LocalizedLink';
import { useSpanishFieldValidation } from '@/hooks/useSpanishFieldValidation';

export default function NewsletterForm({ es, question }: { es: boolean; question?: number }) {
  const fields = useSpanishFieldValidation();
  const questionSignup = question !== undefined;
  const headingId = questionSignup ? 'question-video-coming-soon' : 'newsletter-title';
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | 'limited'>();
  const error = es ? 'No pudimos registrar su correo. Inténtelo de nuevo.' : 'We could not register your email. Please try again.';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!fields.validate(form, questionSignup ? ['name', 'email', 'consent'] : ['email', 'consent'])) return;
    const data = new FormData(form);
    setSending(true);
    setResult(undefined);
    try {
      const response = await fetch('/api/boletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'), name: data.get('name'), question, website: data.get('website'),
          consent: data.get('consent') === 'on', locale: es ? 'es' : 'en',
        }),
      });
      if (response.ok) form.reset();
      setResult(response.ok ? 'success' : response.status === 429 ? 'limited' : 'error');
    } catch {
      setResult('error');
    } finally {
      setSending(false);
    }
  }

  return <form className="newsletter-form" aria-labelledby={headingId} noValidate onSubmit={submit}>
    <label className="newsletter-field">{es ? 'Correo electrónico' : 'Email'}<input name="email" type="email" required maxLength={254} autoComplete="email" {...fields.attributes('email')} />{fields.feedback('email')}</label>
    <label className="newsletter-field">{questionSignup ? (es ? 'Nombre' : 'Name') : (es ? 'Nombre (opcional)' : 'Name (optional)')}<input name="name" required={questionSignup} maxLength={120} autoComplete="name" {...fields.attributes('name')} />{fields.feedback('name')}</label>
    <div className="sr-only" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    <label className="newsletter-consent"><input name="consent" type="checkbox" required {...fields.attributes('consent')} /><span>{questionSignup
      ? (es ? 'Acepto recibir el aviso de este video y el boletín de Humanismo Evolutivo por correo y he leído el ' : 'I agree to receive this video alert and the Humanismo Evolutivo newsletter by email and have read the ')
      : (es ? 'Acepto recibir el boletín de Humanismo Evolutivo por correo y he leído el ' : 'I agree to receive the Humanismo Evolutivo newsletter by email and have read the ')}<Link className="underline" href="/privacidad">{es ? 'Aviso de privacidad' : 'Privacy notice'}</Link>{es ? '. Puedo darme de baja en cualquier momento.' : '. I can unsubscribe at any time.'}</span></label>
    {fields.feedback('consent')}
    <button className="design-button design-button-gold" type="submit" disabled={sending}>{sending ? (es ? 'Enviando…' : 'Sending…') : (questionSignup ? (es ? 'Avísenme cuando esté disponible' : 'Notify me when available') : (es ? 'Suscribirme' : 'Subscribe'))}</button>
    {result === 'success' ? <p role="status">{es ? 'Revisa tu correo y confirma tu suscripción.' : 'Check your inbox to confirm your subscription.'}</p> : null}
    {result && result !== 'success' ? <p role="alert">{result === 'limited' && es ? 'Demasiados intentos. Inténtelo de nuevo en unos minutos.' : error}</p> : null}
  </form>;
}
