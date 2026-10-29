'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/lib/site';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const options: { id: Language; label: string }[] = [
    { id: 'es', label: 'ES' },
    { id: 'en', label: 'EN' },
  ];
  return <div className="site-language-toggle" role="group" aria-label={language === 'es' ? 'Idioma' : 'Language'}>
    {options.map(option => <button
      key={option.id}
      type="button"
      className="site-language-button"
      aria-pressed={language === option.id}
      onClick={() => setLanguage(option.id)}
    >{option.label}</button>)}
  </div>;
}
