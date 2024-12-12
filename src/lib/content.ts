import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

// Cache for collection data
const cache = new Map<string, CollectionEntry<any>[]>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export async function getCachedCollection<T extends 'blog' | 'authors'>(
  collection: T
): Promise<CollectionEntry<T>[]> {
  const cacheKey = `collection:${collection}`;
  const cached = cache.get(cacheKey) as CacheEntry<CollectionEntry<T>[]> | undefined;
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await getCollection(collection);
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

export async function getPostBySlug(slug: string): Promise<CollectionEntry<'blog'> | undefined> {
  const posts = await getCachedCollection('blog');
  return posts.find(post => post.slug === slug);
}

export async function getPostsByCategory(category: string): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCachedCollection('blog');
  return posts.filter(post => post.data.category === category);
}

export async function getPostsByTag(tag: string): Promise<CollectionEntry<'blog'>[]> {
  const posts = await getCachedCollection('blog');
  return posts.filter(post => post.data.tags.includes(tag));
}