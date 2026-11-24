import 'server-only';

export async function resendRequest(path: string, method: string, body?: object) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return fetch('https://api.resend.com' + path, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  }).catch(() => null);
}

export async function sendNewsletterConfirmation(email: string, name: string | undefined, confirmUrl: string, bajaUrl: string) {
  const from = process.env.NEWSLETTER_FROM_EMAIL;
  if (!from) return false;
  const text = `Hola${name ? ', ' + name : ''}:\n\nPara recibir el boletín de Humanismo Evolutivo, confirma tu suscripción en este enlace: ${confirmUrl}. El enlace vence en 48 horas. Si no solicitaste esta suscripción, ignora este correo. Para darte de baja en cualquier momento: ${bajaUrl}`;
  const escapeHtml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
  const html = '<p>' + escapeHtml(text).replace('\n\n', '</p><p>')
    .replace(escapeHtml(confirmUrl), `<a href="${escapeHtml(confirmUrl)}">${escapeHtml(confirmUrl)}</a>`)
    .replace(escapeHtml(bajaUrl), `<a href="${escapeHtml(bajaUrl)}">${escapeHtml(bajaUrl)}</a>`) + '</p>';
  const response = await resendRequest('/emails', 'POST', {
    from, to: [email], subject: 'Confirma tu suscripción al boletín de Humanismo Evolutivo', text, html,
  });
  if (!response?.ok) console.error('Newsletter confirmation delivery failed', { status: response?.status });
  return response?.ok === true;
}

export async function syncNewsletterContact(email: string, segment: string) {
  const contactPath = '/contacts/' + encodeURIComponent(email);
  let contact = await resendRequest(contactPath, 'PATCH', { unsubscribed: false });
  if (contact?.status === 404) {
    contact = await resendRequest('/contacts', 'POST', { email, unsubscribed: false });
  }
  if (!contact?.ok) return null;
  const data = await contact.json().catch(() => null);
  if (typeof data?.id !== 'string') return null;
  const membership = await resendRequest(contactPath + '/segments/' + encodeURIComponent(segment), 'POST');
  return membership?.ok ? data.id as string : null;
}

export async function removeNewsletterContact(email: string, segment: string) {
  const contactPath = '/contacts/' + encodeURIComponent(email);
  await Promise.all([
    resendRequest(contactPath, 'PATCH', { unsubscribed: true }),
    resendRequest(contactPath + '/segments/' + encodeURIComponent(segment), 'DELETE'),
  ]);
}
