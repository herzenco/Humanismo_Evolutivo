import { supabase } from '@/integrations/supabase/client';
import { bookDownloadSchema } from '@/lib/validation';
import { getBookDownload } from '@/lib/book-downloads';
import type { Language } from '@/lib/site';
export async function downloadBook({ bookId, language, name, email }: {
  bookId: string; language: Language; name: string; email: string;
}) {
  const download = getBookDownload(bookId, language);
  const data = bookDownloadSchema.parse({ name: name.trim(), email: email.trim(), book_downloaded: download.title });
  // Verify the file before recording a lead or reporting success.
  const response = await fetch(download.url);
  if (!response.ok) throw new Error('PDF unavailable');
  const blob = await response.blob();
  if (await blob.slice(0, 5).text() !== '%PDF-') throw new Error('Invalid PDF response');
  const { error } = await supabase.from('book_downloads').insert(data);
  if (error) throw error;
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
