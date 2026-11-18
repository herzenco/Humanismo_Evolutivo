'use client';
import { useEffect, useRef, useState } from 'react';
import Link from '@/components/LocalizedLink';
import { useSpanishFieldValidation } from '@/hooks/useSpanishFieldValidation';
import Script from 'next/script';
import { useLanguage } from '@/contexts/LanguageContext';

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

export default function ContactForm() {
  const { language } = useLanguage();
  const en = language === 'en';
  const fields = useSpanishFieldValidation();
  const verification = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  useEffect(() => {
    window.onTurnstileContact = setToken;
    window.onTurnstileContactExpired = () => setToken('');
    return () => {
      delete window.onTurnstileContact;
      delete window.onTurnstileContactExpired;
    };
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
    const form = event.currentTarget;
    if (!siteKey || !fields.validate(form, ['name', 'email', 'subject', 'message', 'consent'])) return;
    if (!token) { setError(en ? 'Confirm that you are a person before sending.' : 'Confirma que eres una persona antes de enviar.'); return; }
    const data = new FormData(form);
    const fallbackError = en ? 'We could not send your message. Please try again.' : 'No pudimos enviar tu mensaje. Intenta de nuevo.';
    setStatus('sending');
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept-Language': language },
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
      if (!response.ok) {
        setStatus('error');
        setError(typeof result.error === 'string' ? result.error : fallbackError);
        return;
      }
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
      setError(fallbackError);
    } finally {
      setToken('');
      if (verification.current) window.turnstile?.reset(verification.current);
    }
  }
  return <form id="formulario" className="portal-admin-form" noValidate onSubmit={onSubmit} aria-label={label.title}>
    <h2 className="font-heading text-3xl font-light text-navy-dark">{label.title}</h2>
    <label>{label.name}<input name="name" {...fields.attributes('name')} aria-label={label.name} required maxLength={120} autoComplete="name" />{fields.feedback('name')}</label>
    <label>{label.email}<input name="email" {...fields.attributes('email')} aria-label={label.email} type="email" required maxLength={254} autoComplete="email" />{fields.feedback('email')}</label>
    <label>{label.phone}<input name="phone" aria-label={label.phone} type="tel" maxLength={40} autoComplete="tel" /></label>
    <label>{label.subject}<input name="subject" {...fields.attributes('subject')} aria-label={label.subject} required maxLength={160} />{fields.feedback('subject')}</label>
    <label>{label.message}<textarea name="message" {...fields.attributes('message')} aria-label={label.message} required maxLength={5000} rows={6} />{fields.feedback('message')}</label>
    <label className="portal-review-confirm"><input name="consent" {...fields.attributes('consent')} aria-label={label.consent} type="checkbox" required /><span>{label.consent}</span></label>
    {fields.feedback('consent')}
    <p>{en ? 'We use the information in this form to respond to your message.' : 'Usamos los datos de este formulario para responder a tu mensaje.'} <Link className="underline" href="/privacidad">{en ? 'Privacy notice' : 'Aviso de privacidad'}</Link></p>
    {siteKey ? <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      <div ref={verification} className="cf-turnstile" data-sitekey={siteKey} data-language={language} data-callback="onTurnstileContact" data-expired-callback="onTurnstileContactExpired" />
    </> : <p role="status">{en ? 'This form is currently unavailable. Please contact us by email.' : 'El formulario no está disponible en este momento.'}</p>}
    <button className="design-button" type="submit" disabled={!siteKey || status === 'sending'}>{status === 'sending' ? label.sending : label.send}</button>
    {status === 'sent' ? <p role="status">{label.sent}</p> : null}
    {error ? <p role="alert">{error}</p> : null}
  </form>;
}

declare global {
  interface Window {
    onTurnstileContact?: (token: string) => void;
    onTurnstileContactExpired?: () => void;
    turnstile?: { reset: (container: HTMLElement) => void };
  }
}
