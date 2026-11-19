import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().trim().toLowerCase().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal('')),
  subject: z.string().trim().min(1).max(160),
  message: z.string().trim().min(1).max(5000),
  consent: z.literal(true),
  locale: z.enum(['es', 'en']),
});

export type ContactInput = z.infer<typeof contactSchema>;
