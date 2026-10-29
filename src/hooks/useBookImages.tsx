"use client";

import { useQuery } from '@tanstack/react-query';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';

export const useBookImages = () => {
  return useQuery({
    queryKey: ['book-images'],
    enabled: isSupabaseConfigured,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_images')
        .select('key, url')
        .eq('category', 'book-cover');
      
      if (error) throw error;
      
      // Convertir array a objeto para búsqueda rápida
      const imageMap: Record<string, string> = {};
      data?.forEach(img => {
        imageMap[img.key] = img.url;
      });
      
      return imageMap;
    },
    staleTime: 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
