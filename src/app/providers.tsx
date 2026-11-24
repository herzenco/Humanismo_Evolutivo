"use client";
import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { LanguageProvider } from '@/contexts/LanguageContext';
import type { ContentRecord } from '@/lib/content';
import type { Database } from '@/integrations/supabase/types';
import type { Language } from '@/lib/site';
export function Providers({ children, language, content, images, series }: {
  children: ReactNode; language: Language; content: ContentRecord[];
  images: Database['public']['Tables']['site_images']['Row'][];
  series: Database['public']['Tables']['podcast_series']['Row'][];
}) {
  const bookImages = Object.fromEntries(images.filter(image => image.category === 'book-cover').map(image => [image.key, image.url]));
  const [queryClient] = useState(() => {
    const client = new QueryClient();
    client.setQueryData(['book-images'], bookImages);
    client.setQueryData(['podcast-series'], series);
    return client;
  });
  useEffect(() => {
    queryClient.setQueryData(['book-images'], Object.fromEntries(images.filter(image => image.category === 'book-cover').map(image => [image.key, image.url])));
    queryClient.setQueryData(['podcast-series'], series);
  }, [images, series, queryClient]);
  return <LanguageProvider language={language} content={content}>
    <QueryClientProvider client={queryClient}><TooltipProvider>
      <Toaster /><Sonner />{children}
    </TooltipProvider></QueryClientProvider>
  </LanguageProvider>;
}
