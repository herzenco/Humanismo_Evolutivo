'use client';

import ExternalPlayer from '@/components/design/ExternalPlayer';

import { youtubeEmbedUrl } from '@/config/home-videos';
import { useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useTx } from '@/components/design/useTx';

type Props = { title: string; className?: string; children: ReactNode; 'aria-label'?: string } & ({ videoId: string; videoSrc?: never; poster?: never } | { videoSrc: string; poster?: string; videoId?: never });
export default function VideoDialog({ videoId, videoSrc, poster, title, className, children, ...props }: Props) {
  const tx = useTx();
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><button type="button" className={className} {...props}>{children}</button></DialogTrigger>
    <DialogContent className="w-[calc(100%-2rem)] max-w-4xl border-gold/40 bg-[#173F2C] p-6 text-white">
      <DialogTitle className="pr-8 font-heading text-3xl">{title}</DialogTitle>
      <DialogDescription className="sr-only">{tx("Video de presentación de Humanismo Evolutivo.")}</DialogDescription>
      {open && videoSrc ? <video className="aspect-video w-full rounded-xl" src={videoSrc} poster={poster} controls playsInline preload="metadata" aria-label={title} /> : open && videoId ? <ExternalPlayer src={youtubeEmbedUrl(videoId)} title={title} provider="YouTube" /> : null}
    </DialogContent>
  </Dialog>;
}
