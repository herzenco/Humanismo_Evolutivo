import { bookDownloadSchema } from '@/lib/validation';
import { getBookDownload } from '@/lib/book-downloads';
import type { Language } from '@/lib/site';
export async function downloadBook({ bookId, language, name, email, website, managed }: {
  bookId: string; language: Language; name: string; email: string; website?: string; managed?: { url: string; title: string };
}) {
  const download = managed ? { ...managed, language } : getBookDownload(bookId, language);
  const data = bookDownloadSchema.parse({ name: name.trim(), email: email.trim(), book_downloaded: download.title });
  // Verify the file before recording a lead or reporting success.
  const response = await fetch(download.url);
  if (!response.ok) throw new Error('PDF unavailable');
  const blob = await response.blob();
  if (await blob.slice(0, 5).text() !== '%PDF-') throw new Error('Invalid PDF response');
  const registration = await fetch('/api/book-downloads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: data.name, email: data.email, bookId, website }),
  });
  if (!registration.ok) throw new Error('Book download registration failed');
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `${download.title}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Give the browser time to consume the object URL.
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  return download;
}
