"use client";
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { contentDictionary, type ContentRecord } from '@/lib/content';
import { localizedPath, type Language } from '@/lib/site';
export type { Language } from '@/lib/site';
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}
const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);
export function LanguageProvider({ children, language, content = [] }: {
  children: React.ReactNode; language: Language; content?: ContentRecord[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dictionary = React.useMemo(() => contentDictionary(language, content), [language, content]);
  const setLanguage = (nextLanguage: Language) => {
    if (nextLanguage === language) return;
    router.push(localizedPath(pathname, nextLanguage) + window.location.search + window.location.hash);
  };
  return <LanguageContext.Provider value={{ language, setLanguage, t: key => dictionary[key] ?? key }}>
    {children}
  </LanguageContext.Provider>;
}
export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}
