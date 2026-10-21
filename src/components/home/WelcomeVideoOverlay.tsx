"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { homeVideos } from '@/config/home-videos';

const STORAGE_KEY = `welcomeVideoSeen:${homeVideos.introduction.id}`;

export default function WelcomeVideoOverlay() {
  const [open,setOpen] = useState(false);
  useEffect(()=>{
    try { if (localStorage.getItem(STORAGE_KEY)) return; } catch { /* Browser storage may be unavailable. */ }
    const timer=setTimeout(()=>{
      setOpen(true);
      try { localStorage.setItem(STORAGE_KEY,'true'); } catch { /* Playback does not require storage. */ }
      window.dataLayer?.push({event:'welcome_video_open',video_id:homeVideos.introduction.id});
    },5000);
    return ()=>clearTimeout(timer);
  },[]);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="w-[calc(100%-2rem)] max-w-4xl border-border bg-background p-6">
      <DialogTitle className="pr-8 text-center text-2xl font-bold">Bienvenido a Parque Cancún</DialogTitle>
      <DialogDescription>Una breve introducción al Humanismo Evolutivo. Activa el sonido con los controles del video.</DialogDescription>
      {open ? <video className="aspect-video w-full rounded-lg" src={homeVideos.introduction.src} poster={homeVideos.introduction.poster} controls autoPlay muted playsInline preload="metadata" aria-label="Introducción a Parque Cancún" /> : null}
    </DialogContent>
  </Dialog>;
}
