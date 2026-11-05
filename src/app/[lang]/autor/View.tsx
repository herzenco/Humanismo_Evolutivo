"use client";

import AuthorEditorial from "@/components/design/AuthorEditorial";
import PageWrapper from "@/components/layout/PageWrapper";
import { useLanguage } from '@/contexts/LanguageContext';
import { PersonStructuredData } from '@/components/seo/StructuredData';

const Autor = () => {
  const { language } = useLanguage();
  const en = language === 'en';

  return (
    <PageWrapper>
      <PersonStructuredData
        name="Marcos Constandse Madrazo"
        jobTitle={en ? "Philosopher and author" : "Filósofo y Autor"}
        description={en ? "Mexican transpersonal thinker dedicated to integrating science, spirituality, and human consciousness" : "Pensador transpersonal mexicano dedicado a la integración de ciencia, espiritualidad y conciencia humana"}
        image="https://humanismoevolutivo.com/lovable-uploads/2df62819-9976-4c1f-ae70-f597654760d3.webp"
        url="https://humanismoevolutivo.com/autor"
      />
      <AuthorEditorial />
    </PageWrapper>
  );
};

export default Autor;
