import { getSession } from '../lib/auth';
import type { MiddlewareResponseHandler } from 'astro';

export const authMiddleware: MiddlewareResponseHandler = async ({ request }, next) => {
  const url = new URL(request.url);
  
  // Skip auth check for non-admin routes
  if (!url.pathname.startsWith('/admin')) {
    return next();
  }

  try {
    const session = await getSession();
    if (!session) {
      return Response.redirect(new URL('/login', request.url));
    }
    return next();
  } catch (error) {
    return Response.redirect(new URL('/login', request.url));
  }
};