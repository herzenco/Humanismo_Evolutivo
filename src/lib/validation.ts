import { z } from 'zod';

/**
 * Validation schema for book download form
 * Enforces length limits and data integrity for database security
 */
export const bookDownloadSchema = z.object({
  name: z.string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  email: z.string()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  book_downloaded: z.string()
    .min(1, { message: 'Book name is required' })
    .max(200, { message: 'Book name must be less than 200 characters' })
});

export type BookDownloadFormData = z.infer<typeof bookDownloadSchema>;

export const newsletterSubscriptionSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email address' })
    .max(254, { message: 'Email must be less than 255 characters' }),
  locale: z.enum(['es', 'en']),
});

export type NewsletterSubscriptionFormData = z.infer<typeof newsletterSubscriptionSchema>;

/**
 * Helper to sanitize strings for analytics tracking
 * Removes potentially dangerous characters that could cause XSS
 */
export const sanitizeForAnalytics = (value: string): string => {
  return value
    .replace(/[<>'"]/g, '') // Remove potentially dangerous HTML characters
    .slice(0, 200); // Ensure reasonable length
};
