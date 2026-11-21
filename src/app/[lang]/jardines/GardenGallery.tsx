'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, useState } from 'react';
import styles from './gardens.module.css';

type GalleryImage = { src: string; caption: string; width: number; height: number };

type Props = {
  images: GalleryImage[];
  title: string;
  lang: 'es' | 'en';
};

const controls = {
  es: { close: 'Cerrar', previous: 'Anterior', next: 'Siguiente' },
  en: { close: 'Close', previous: 'Previous', next: 'Next' },
};

const gap = 12;

function barrel(images: GalleryImage[], width: number) {
  const targetHeight = width < 500 ? 145 : 205;
  const rows: { start: number; end: number; height: number }[] = [];
  let start = 0;
  let ratio = 0;

  images.forEach((image, index) => {
    ratio += image.width / image.height;
    const available = width - (index - start) * gap;
    const height = available / ratio;

    if (height <= targetHeight || index === images.length - 1) {
      rows.push({ start, end: index + 1, height: Math.min(height, targetHeight) });
      start = index + 1;
      ratio = 0;
    }
  });

  return rows;
}

export default function GardenGallery({ images, title, lang }: Props) {
  const heading = useId();
  const gallery = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const activeImage = images[selected];
  const labels = controls[lang];

  useEffect(() => {
    const element = gallery.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function move(offset: number) {
    setSelected(index => (index + offset + images.length) % images.length);
  }

  return (
    <div className={styles.photoGallery}>
      <h3 id={heading}>{title}</h3>
      <div ref={gallery} className={styles.photoRows} role="group" aria-labelledby={heading}>
        {barrel(images, width || 720).map(row => (
          <ul key={row.start} className={styles.photoRow} style={{
            '--photo-gap': `${gap}px`,
            gridTemplateColumns: images.slice(row.start, row.end).map(image =>
              `minmax(0, ${image.width / image.height * row.height}px)`,
            ).join(' '),
          } as React.CSSProperties}>
            {images.slice(row.start, row.end).map((image, offset) => (
              <li key={image.src}>
                <button type="button" aria-haspopup="dialog" className={styles.photoButton} onClick={event => {
                  trigger.current = event.currentTarget;
                  setSelected(row.start + offset);
                  setOpen(true);
                  dialog.current?.showModal();
                }}>
                  <Image src={image.src} alt="" width={image.width} height={image.height}
                    className={styles.photoPreview} sizes={`${Math.ceil(image.width / image.height * row.height)}px`} />
                  <span className={styles.photoCaption}>{image.caption}</span>
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <dialog ref={dialog} aria-labelledby={heading} className={styles.photoDialog}
        onClose={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
        onKeyDown={event => {
          if (event.key === 'ArrowLeft') move(-1);
          if (event.key === 'ArrowRight') move(1);
        }}>
        <div className={styles.photoToolbar}>
          <button type="button" autoFocus onClick={() => dialog.current?.close()}>{labels.close}</button>
        </div>
        {open && <figure>
          <div className={styles.photoStage}>
            <Image src={activeImage.src} alt={activeImage.caption} fill sizes="(max-width: 1000px) 90vw, 960px" loading="eager" />
          </div>
          <figcaption aria-live="polite">{activeImage.caption} · {selected + 1} / {images.length}</figcaption>
        </figure>}
        <div className={styles.photoToolbar}>
          <button type="button" onClick={() => move(-1)}>← {labels.previous}</button>
          <button type="button" onClick={() => move(1)}>{labels.next} →</button>
        </div>
      </dialog>
    </div>
  );
}
