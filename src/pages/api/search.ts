---
import { getCachedCollection } from '../../lib/content';
import { validateSearchParams } from '../../lib/validation';
import { handleError } from '../../lib/errors';

export async function get({ request }) {
  try {
    const url = new URL(request.url);
    const { q: query } = validateSearchParams(url.searchParams);

    const posts = await getCachedCollection('blog');
    const results = posts
      .filter(post => {
        const searchContent = `
          ${post.data.title}
          ${post.data.description}
          ${post.data.tags.join(' ')}
          ${post.data.category}
        `.toLowerCase();
        
        return searchContent.includes(query.toLowerCase());
      })
      .map(post => ({
        title: post.data.title,
        description: post.data.description,
        slug: post.slug
      }));

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    const handledError = handleError(error);
    return new Response(JSON.stringify({ error: handledError.message }), {
      status: error instanceof ValidationError ? 400 : 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
---