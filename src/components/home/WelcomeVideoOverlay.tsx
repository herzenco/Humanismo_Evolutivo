"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const WELCOME_VIDEO_ID = '5rmKRNZbmoQ';
const WELCOME_VIDEO_STORAGE_KEY = `welcomeVideoSeen:${WELCOME_VIDEO_ID}`;
const WELCOME_VIDEO_URL = `https://www.youtube.com/embed/${WELCOME_VIDEO_ID}?autoplay=1&rel=0`;
const WELCOME_VIDEO_DELAY_MS = 5000;

const WelcomeVideoOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem(WELCOME_VIDEO_STORAGE_KEY);
    
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem(WELCOME_VIDEO_STORAGE_KEY, 'true');
        window.dataLayer?.push({ event: 'welcome_video_open', video_id: WELCOME_VIDEO_ID });
      }, WELCOME_VIDEO_DELAY_MS);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    window.dataLayer?.push({ event: 'welcome_video_close', video_id: WELCOME_VIDEO_ID });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleClose();
        return;
      }
      setIsOpen(true);
    }}>
      <DialogContent className="max-w-4xl w-full p-0 bg-background border border-border">
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 rounded-full bg-background/80 p-2 text-foreground hover:bg-background transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar video</span>
          </button>
          
          <div className="p-6">
            <DialogTitle className="text-2xl font-bold text-center mb-4 text-foreground">
              Bienvenido
            </DialogTitle>
            
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={WELCOME_VIDEO_URL}
                title="Video de bienvenida"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeVideoOverlay;
