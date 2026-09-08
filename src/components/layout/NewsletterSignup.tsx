'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail } from 'lucide-react';
import { subscribeToNewsletter } from '@/app/actions/newsletter';
import type { NewsletterActionState } from '@/app/actions/newsletter';
import { useLanguage } from '@/contexts/LanguageContext';

const initialNewsletterActionState: NewsletterActionState = {
  status: 'idle',
};

const NewsletterSignup = () => {
  const { language, t } = useLanguage();
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    initialNewsletterActionState,
  );

  if (state.status === 'success') {
    return (
      <div
        className="mx-auto flex max-w-xl items-center justify-center gap-3 rounded-md border border-white/25 bg-white/10 px-5 py-4 text-center text-white"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
        <p>{t('footer.newsletter.success')}</p>
      </div>
    );
  }

  const message = state.code === 'invalid_email'
    ? t('footer.newsletter.invalidEmail')
    : state.status === 'error'
      ? t('footer.newsletter.error')
      : '';

  return (
    <form action={formAction} className="mx-auto max-w-2xl" noValidate>
      <input type="hidden" name="locale" value={language} />

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          {t('footer.newsletter.emailLabel')}
        </label>
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy/55"
            aria-hidden="true"
          />
          <input
            id="newsletter-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={254}
            aria-describedby="newsletter-privacy newsletter-status"
            aria-invalid={state.code === 'invalid_email'}
            placeholder={t('footer.newsletter.emailPlaceholder')}
            className="h-12 w-full rounded-md border border-white/30 bg-white py-3 pl-12 pr-4 text-navy shadow-sm outline-none transition placeholder:text-navy/55 focus:border-gold focus:ring-2 focus:ring-gold/40"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="h-12 rounded-md bg-gold px-7 font-medium text-navy-dark shadow-sm transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-navy-light disabled:cursor-wait disabled:opacity-70"
        >
          {isPending
            ? t('footer.newsletter.submitting')
            : t('footer.newsletter.submit')}
        </button>
      </div>

      <p id="newsletter-privacy" className="mt-3 text-center text-xs text-white/75">
        {t('footer.newsletter.privacyPrefix')}{' '}
        <Link href="/privacidad" className="underline underline-offset-2 hover:text-gold">
          {t('footer.newsletter.privacyLink')}
        </Link>
      </p>

      <p
        id="newsletter-status"
        className="mt-3 min-h-5 text-center text-sm font-medium text-amber-200"
        role={message ? 'alert' : 'status'}
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
};

export default NewsletterSignup;
