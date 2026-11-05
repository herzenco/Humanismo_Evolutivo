import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().trim().toLowerCase().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(5000),
  consent: z.literal(true),
  locale: z.enum(['es', 'en']),
  turnstileToken: z.string().trim().min(1).max(2048),
});

export type ContactInput = z.infer<typeof contactSchema>;

export async function verifyTurnstile(token: string, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return false;
  const result = await response.json() as { success?: boolean };
  return result.success === true;
}
