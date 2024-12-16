import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import slugify from 'slugify';
import type { Post } from '../types/blog';

const CONTENT_DIR = 'src/content/blog';
const TRASH_DIR = 'src/content/trash';

export async function createPost(post: Post): Promise<void> {
  const slug = slugify(post.title, { lower: true, strict: true });
  const fileName = `${slug}.mdx`;
  const filePath = join(CONTENT_DIR, fileName);

  const frontmatter = {
    title: post.title,
    description: post.description || '',
    pubDate: post.pubDate.toISOString(),
    updatedDate: post.updatedDate?.toISOString(),
    author: post.author,
    category: post.category,
    tags: post.tags,
    featured: post.featured,
    image: post.image,
    imageAlt: post.imageAlt,
    readingTime: post.readingTime || 5
  };

  const fileContent = matter.stringify(post.content, frontmatter);
  await writeFile(filePath, fileContent, 'utf-8');
}

export async function updatePost(slug: string, post: Post): Promise<void> {
  const filePath = join(CONTENT_DIR, `${slug}.mdx`);
  const newSlug = slugify(post.title, { lower: true, strict: true });

  // If title changed, rename the file
  if (slug !== newSlug) {
    const newFilePath = join(CONTENT_DIR, `${newSlug}.mdx`);
    await writeFile(newFilePath, '', 'utf-8');
    // Keep old file as backup
    await writeFile(`${filePath}.bak`, '', 'utf-8');
  }

  await createPost(post);
}

export async function deletePost(slug: string): Promise<void> {
  const sourcePath = join(CONTENT_DIR, `${slug}.mdx`);
  const targetPath = join(TRASH_DIR, `${slug}.mdx`);
  
  const content = await readFile(sourcePath, 'utf-8');
  const { data, content: postContent } = matter(content);
  
  // Add deletion metadata
  const updatedData = {
    ...data,
    deleted: true,
    deletedAt: new Date().toISOString()
  };
  
  const updatedContent = matter.stringify(postContent, updatedData);
  await writeFile(targetPath, updatedContent, 'utf-8');
  await writeFile(sourcePath, '', 'utf-8');
}

export async function restorePost(slug: string): Promise<void> {
  const sourcePath = join(TRASH_DIR, `${slug}.mdx`);
  const targetPath = join(CONTENT_DIR, `${slug}.mdx`);
  
  const content = await readFile(sourcePath, 'utf-8');
  const { data, content: postContent } = matter(content);
  
  // Remove deletion metadata
  const { deleted, deletedAt, ...restoredData } = data;
  const restoredContent = matter.stringify(postContent, restoredData);
  
  await writeFile(targetPath, restoredContent, 'utf-8');
  await writeFile(sourcePath, '', 'utf-8');
}