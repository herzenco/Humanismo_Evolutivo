'use client';

import { useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

type Props = { videoId: string; title: string; className?: string; children: ReactNode; 'aria-label'?: string };
export default function VideoDialog({ videoId, title, className, children, ...props }: Props) {
  const [open, setOpen] = useState(false);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild><button type="button" className={className} {...props}>{children}</button></DialogTrigger>
    <DialogContent className="w-[calc(100%-2rem)] max-w-4xl border-gold/40 bg-[#173F2C] p-6 text-white">
      <DialogTitle className="pr-8 font-heading text-3xl">{title}</DialogTitle>
      <DialogDescription className="sr-only">Video de presentación de Humanismo Evolutivo.</DialogDescription>
      {open ? <iframe className="aspect-video w-full rounded-xl" src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : null}
    </DialogContent>
  </Dialog>;
}
