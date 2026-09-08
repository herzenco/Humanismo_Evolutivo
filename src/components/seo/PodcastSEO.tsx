"use client";

import { useEffect } from 'react';

interface PodcastEpisodeSEOProps {
  title: string;
  description: string;
  seriesTitle: string;
  coverImage: string;
  audioUrl: string;
  duration: string;
  date: string;
  episodeNumber: number;
  url: string;
}

export const PodcastEpisodeSEO = ({
  title,
  description,
  seriesTitle,
  coverImage,
  audioUrl,
  duration,
  date,
  episodeNumber,
  url,
}: PodcastEpisodeSEOProps) => {
  const fullTitle = `${title} | ${seriesTitle} - Humanismo Evolutivo Transpersonal`;
  const truncatedDescription = description.length > 160
    ? description.substring(0, 157) + '...'
    : description;

  useEffect(() => {
    // Set document title
    document.title = fullTitle;

    // Set meta tags
    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('description', truncatedDescription);
    setMeta('keywords', `${title}, ${seriesTitle}, Marcos Constandse, Humanismo Evolutivo Transpersonal, podcast, filosofía, espiritualidad`);
    setMeta('og:type', truncatedDescription, true);
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', truncatedDescription, true);
    setMeta('og:image', coverImage, true);
    setMeta('og:url', url, true);
    setMeta('og:site_name', 'Humanismo Evolutivo Transpersonal', true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', truncatedDescription);
    setMeta('twitter:image', coverImage);

    // Set canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // JSON-LD structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "PodcastEpisode",
      "name": title,
      "description": description,
      "url": url,
      "datePublished": date,
      "duration": `PT${duration.replace(' min', 'M')}`,
      "episodeNumber": episodeNumber,
      "image": coverImage,
      "audio": {
        "@type": "AudioObject",
        "contentUrl": audioUrl
      },
      "partOfSeries": {
        "@type": "PodcastSeries",
        "name": seriesTitle,
        "author": {
          "@type": "Person",
          "name": "Marcos Constandse Madrazo"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Fundación Humanismo Evolutivo",
          "url": "https://yosoynosotros.com"
        }
      },
      "author": {
        "@type": "Person",
        "name": "Marcos Constandse Madrazo",
        "jobTitle": "Filósofo y Autor"
      }
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [title, description, seriesTitle, coverImage, audioUrl, duration, date, episodeNumber, url, fullTitle, truncatedDescription]);

  return null;
};
