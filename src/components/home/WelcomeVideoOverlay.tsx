"use client";

import ExternalPlayer from '@/components/design/ExternalPlayer';
import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { homeVideos, youtubeEmbedUrl } from '@/config/home-videos';

const STORAGE_KEY = `welcomeVideoSeen:${homeVideos.introduction.id}`;

export default function WelcomeVideoOverlay() {
  const [open,setOpen] = useState(false);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(()=>{
    try { if (localStorage.getItem(STORAGE_KEY)) return; } catch { /* Browser storage may be unavailable. */ }
    const timer=setTimeout(()=>{
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setOpen(true);
      try { localStorage.setItem(STORAGE_KEY,'true'); } catch { /* Playback does not require storage. */ }
      window.dataLayer?.push({event:'welcome_video_open',video_id:homeVideos.introduction.id});
    },5000);
    return ()=>clearTimeout(timer);
  },[]);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent onCloseAutoFocus={(event) => {
      event.preventDefault();
      const previous = previousFocus.current;
      const target = previous?.isConnected && previous !== document.body
        ? previous
        : document.getElementById('contenido-principal');
      target?.focus({ preventScroll: true });
    }} className="w-[calc(100%-2rem)] max-w-4xl border-border bg-background p-6">
      <DialogTitle className="pr-8 text-center text-2xl font-bold">Bienvenido a Parque Cancún</DialogTitle>
      <DialogDescription>Una breve introducción al Humanismo Evolutivo. Usa los controles para reproducir el video.</DialogDescription>
      {open && homeVideos.introduction.youtubeId ? <ExternalPlayer src={youtubeEmbedUrl(homeVideos.introduction.youtubeId)} title="Introducción a Parque Cancún" provider="YouTube" /> : open ? <video className="aspect-video w-full rounded-lg" src={homeVideos.introduction.src} poster={homeVideos.introduction.poster} controls playsInline preload="metadata" aria-label="Introducción a Parque Cancún" /> : null}
    </DialogContent>
  </Dialog>;
}
