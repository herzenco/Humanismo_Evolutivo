'use client';

import { useState, type FormEvent } from 'react';
import Link from '@/components/LocalizedLink';
import { useSpanishFieldValidation } from '@/hooks/useSpanishFieldValidation';

export default function NewsletterForm({ es }: { es: boolean }) {
  const fields = useSpanishFieldValidation();
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | 'limited'>();
  const error = es ? 'No pudimos registrar tu correo. Inténtalo de nuevo.' : 'We could not register your email. Please try again.';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!fields.validate(form, ['email', 'consent'])) return;
    const data = new FormData(form);
    setSending(true);
    setResult(undefined);
    try {
      const response = await fetch('/api/boletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'), name: data.get('name'), website: data.get('website'),
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

  return <form className="newsletter-form" aria-labelledby="newsletter-title" noValidate onSubmit={submit}>
    <label className="newsletter-field">{es ? 'Correo electrónico' : 'Email'}<input name="email" type="email" required maxLength={254} autoComplete="email" {...fields.attributes('email')} />{fields.feedback('email')}</label>
    <label className="newsletter-field">{es ? 'Nombre (opcional)' : 'Name (optional)'}<input name="name" maxLength={120} autoComplete="name" /></label>
    <div className="sr-only" aria-hidden="true"><input name="website" tabIndex={-1} autoComplete="off" /></div>
    <label className="newsletter-consent"><input name="consent" type="checkbox" required {...fields.attributes('consent')} /><span>{es ? 'Acepto recibir el boletín de Humanismo Evolutivo por correo y he leído el ' : 'I agree to receive the Humanismo Evolutivo newsletter by email and have read the '}<Link className="underline" href="/privacidad">{es ? 'Aviso de privacidad' : 'Privacy notice'}</Link>{es ? '. Puedo darme de baja en cualquier momento.' : '. I can unsubscribe at any time.'}</span></label>
    {fields.feedback('consent')}
    <button className="design-button design-button-gold" type="submit" disabled={sending}>{sending ? (es ? 'Enviando…' : 'Sending…') : (es ? 'Suscribirme' : 'Subscribe')}</button>
    {result === 'success' ? <p role="status">{es ? 'Revisa tu correo y confirma tu suscripción.' : 'Check your inbox to confirm your subscription.'}</p> : null}
    {result && result !== 'success' ? <p role="alert">{result === 'limited' && es ? 'Demasiados intentos. Intenta de nuevo en unos minutos.' : error}</p> : null}
  </form>;
}
