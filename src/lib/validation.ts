import { z } from 'astro:content';
import { ValidationError } from './errors';

export const searchParamsSchema = z.object({
  q: z.string().min(2).max(100),
});

export function validateSearchParams(params: URLSearchParams) {
  try {
    return searchParamsSchema.parse({
      q: params.get('q') || '',
    });
  } catch (error) {
    throw new ValidationError('Invalid search parameters');
  }
}