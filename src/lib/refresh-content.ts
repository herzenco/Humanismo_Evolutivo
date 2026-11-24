export async function refreshPublicContent() {
  const response = await fetch('/api/revalidate', { method: 'POST' });
  return response.ok;
}
