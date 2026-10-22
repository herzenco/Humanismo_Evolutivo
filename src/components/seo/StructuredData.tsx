"use client";

import { useEffect } from 'react';

interface BookStructuredDataProps {
  title: string;
  subtitle: string;
  author: string;
  description: string[];
  keywords: string[];
  coverImage: string;
  url: string;
}

export const BookStructuredData = ({
  title,
  subtitle,
  author,
  description,
  keywords,
  coverImage,
  url,
}: BookStructuredDataProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Book",
      "name": title,
      "alternateName": subtitle,
      "author": {
        "@type": "Person",
        "name": author,
        "jobTitle": "Filósofo y Autor",
        "nationality": "Mexicano"
      },
      "description": description.join(' '),
      "keywords": keywords.join(', '),
      "image": coverImage,
      "inLanguage": ["es", "en"],
      "publisher": {
        "@type": "Organization",
        "name": "Fundación Humanismo Evolutivo",
        "url": "https://humanismoevolutivo.com"
      },
      "url": url,
      "genre": ["Filosofía", "Espiritualidad", "Desarrollo Personal"],
      "about": [
        {
          "@type": "Thing",
          "name": "Filosofía Transpersonal"
        },
        {
          "@type": "Thing",
          "name": "Conciencia Humana"
        },
        {
          "@type": "Thing",
          "name": "Espiritualidad"
        }
      ]
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [title, subtitle, author, description, keywords, coverImage, url]);

  return null;
};

interface EventStructuredDataProps {
  name: string;
  description: string;
  startDate: string;
  location: string;
  imageUrl: string;
  url: string;
}

export const EventStructuredData = ({
  name,
  description,
  startDate,
  location,
  imageUrl,
  url,
}: EventStructuredDataProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Event",
      "name": name,
      "description": description,
      "startDate": startDate,
      "location": {
        "@type": "Place",
        "name": location,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": location
        }
      },
      "image": imageUrl,
      "url": url,
      "organizer": {
        "@type": "Organization",
        "name": "Fundación Humanismo Evolutivo",
        "url": "https://humanismoevolutivo.com"
      },
      "performer": {
        "@type": "Person",
        "name": "Marcos Constandse Madrazo"
      }
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [name, description, startDate, location, imageUrl, url]);

  return null;
};

interface PersonStructuredDataProps {
  name: string;
  jobTitle: string;
  description: string;
  image: string;
  url: string;
}

export const PersonStructuredData = ({
  name,
  jobTitle,
  description,
  image,
  url,
}: PersonStructuredDataProps) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Person",
      "name": name,
      "jobTitle": jobTitle,
      "description": description,
      "image": image,
      "url": url,
      "nationality": "Mexicano",
      "alumniOf": "Universidad Nacional Autónoma de México",
      "knowsAbout": [
        "Filosofía Transpersonal",
        "Espiritualidad",
        "Ecología",
        "Literatura Filosófica",
        "Desarrollo Humano"
      ],
      "sameAs": [
        "https://humanismoevolutivo.com/autor"
      ]
    });
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, [name, jobTitle, description, image, url]);

  return null;
};
