"use client";

import { motion } from 'framer-motion';
import PageWrapper from '@/components/layout/PageWrapper';
import { useLanguage } from '@/contexts/LanguageContext';
import type { LegalDocument } from '@/data/legalDocuments';

interface LegalDocumentPageProps {
  documents: Record<'es' | 'en', LegalDocument>;
}

const renderLinkedText = (text: string) =>
  text
    .split(/(https:\/\/www\.humanismoevolutivo\.com(?:\/(?:privacidad|terminos))?|hello@humanismoevolutivo\.com)/g)
    .map((part, index) => {
      if (part === 'hello@humanismoevolutivo.com') {
        return (
          <a key={part + '-' + index} href={'mailto:' + part} className="text-gold-dark underline underline-offset-2">
            {part}
          </a>
        );
      }

      if (part.startsWith('https://')) {
        return (
          <a key={part + '-' + index} href={part} className="text-gold-dark underline underline-offset-2">
            {part}
          </a>
        );
      }

      return part;
    });

const LegalDocumentPage = ({ documents }: LegalDocumentPageProps) => {
  const { language } = useLanguage();
  const document = documents[language];

  return (
    <PageWrapper>
      <article className="bg-gradient-to-b from-cream-light/70 to-white py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto max-w-4xl px-6"
        >
          <header className="mb-12 border-b border-navy/10 pb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-gold-dark">
              Fundación Humanismo Evolutivo
            </p>
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.32em] text-gold-dark/80">
              Transpersonal
            </p>
            <h1 className="font-heading text-4xl font-semibold text-navy-dark md:text-5xl">
              {document.title}
            </h1>
            <p className="mt-4 text-sm text-navy-light">{document.updated}</p>
          </header>

          <div className="space-y-10">
            {document.sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-4 font-heading text-2xl font-semibold text-navy-dark">
                  {section.title}
                </h2>
                <div className="space-y-4 text-base leading-8 text-navy-light">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{renderLinkedText(paragraph)}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-14 border-t border-navy/10 pt-8 text-center text-sm leading-7 text-navy-light">
            {renderLinkedText(document.closing)}
          </footer>
        </motion.div>
      </article>
    </PageWrapper>
  );
};

export default LegalDocumentPage;
