import type { CollectionEntry } from 'astro:content';

export function getFeaturedPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return posts
    .filter(post => post.data.featured)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 3);
}

export function getRecentPosts(posts: CollectionEntry<'blog'>[]): CollectionEntry<'blog'>[] {
  return posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 6);
}

export function getRelatedPosts(
  currentPost: CollectionEntry<'blog'>,
  allPosts: CollectionEntry<'blog'>[],
): CollectionEntry<'blog'>[] {
  return allPosts
    .filter(post => 
      post.id !== currentPost.id && 
      (post.data.category === currentPost.data.category ||
       post.data.tags.some(tag => currentPost.data.tags.includes(tag)))
    )
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 3);
}

export function getCategoryColor(category: string): string {
  const colors = {
    material: 'bg-blue-100 text-blue-800',
    tips: 'bg-green-100 text-green-800',
    proyek: 'bg-purple-100 text-purple-800',
    teknologi: 'bg-orange-100 text-orange-800',
  };
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}