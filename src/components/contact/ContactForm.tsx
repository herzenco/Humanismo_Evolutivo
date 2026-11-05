'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';
import { useLanguage } from '@/contexts/LanguageContext';

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

export default function ContactForm() {
  const { language } = useLanguage();
  const en = language === 'en';
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  useEffect(() => {
    window.onTurnstileContact = (value: string) => setToken(value);
    return () => { delete window.onTurnstileContact; };
  }, []);
  const label = {
    name: en ? 'Name' : 'Nombre',
    email: en ? 'Email' : 'Correo electrónico',
    phone: en ? 'Phone (optional)' : 'Teléfono (opcional)',
    subject: en ? 'Subject' : 'Asunto',
    message: en ? 'Message' : 'Mensaje',
    consent: en ? 'I agree to be contacted about this message.' : 'Acepto que me contacten sobre este mensaje.',
    send: en ? 'Send message' : 'Enviar mensaje',
    sending: en ? 'Sending…' : 'Enviando…',
    sent: en ? 'Thank you. We received your message.' : 'Gracias. Recibimos tu mensaje.',
    title: en ? 'Write to us' : 'Escríbenos',
  };
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) { setError(en ? 'Confirm that you are a person before sending.' : 'Confirma que eres una persona antes de enviar.'); return; }
    const data = new FormData(event.currentTarget);
    setStatus('sending'); setError('');
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.get('name'),
        email: data.get('email'),
        phone: data.get('phone') || '',
        subject: data.get('subject'),
        message: data.get('message'),
        consent: data.get('consent') === 'on',
        locale: en ? 'en' : 'es',
        turnstileToken: token,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) { setStatus('error'); setError(result.error || (en ? 'We could not send your message.' : 'No pudimos enviar tu mensaje.')); return; }
    setStatus('sent');
    event.currentTarget.reset();
  }
  return <form id="formulario" className="portal-admin-form" onSubmit={onSubmit} aria-label={label.title} noValidate={false}>
    <h2 className="font-heading text-3xl font-light text-navy-dark">{label.title}</h2>
    <label>{label.name}<input name="name" aria-label={label.name} required maxLength={120} autoComplete="name" /></label>
    <label>{label.email}<input name="email" aria-label={label.email} type="email" required maxLength={254} autoComplete="email" /></label>
    <label>{label.phone}<input name="phone" aria-label={label.phone} type="tel" maxLength={40} autoComplete="tel" /></label>
    <label>{label.subject}<input name="subject" aria-label={label.subject} required maxLength={160} /></label>
    <label>{label.message}<textarea name="message" aria-label={label.message} required maxLength={5000} rows={6} /></label>
    <label className="portal-review-confirm"><input name="consent" aria-label={label.consent} type="checkbox" required /><span>{label.consent}</span></label>
    {siteKey ? <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div className="cf-turnstile" data-sitekey={siteKey} data-callback="onTurnstileContact" />
    </> : <p role="status">{en ? 'The human check is not configured yet.' : 'La verificación humana aún no está configurada.'}</p>}
    <button className="design-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? label.sending : label.send}</button>
    {status === 'sent' ? <p role="status">{label.sent}</p> : null}
    {error ? <p role="alert">{error}</p> : null}
  </form>;
}

declare global {
  interface Window { onTurnstileContact?: (token: string) => void; }
}
