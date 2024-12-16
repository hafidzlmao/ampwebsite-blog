import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import slugify from 'slugify';
import type { Post } from '../types/blog';

const CONTENT_DIR = 'src/content/blog';
const TRASH_DIR = 'src/content/trash';

export async function createPost(post: Post): Promise<void> {
  try {
    console.log('Creating post:', post.title);
    
    // Create directories if they don't exist
    await mkdir(CONTENT_DIR, { recursive: true });
    await mkdir(TRASH_DIR, { recursive: true });

    const slug = slugify(post.title, { lower: true, strict: true });
    const fileName = `${slug}.mdx`;
    const filePath = join(process.cwd(), CONTENT_DIR, fileName);

    console.log('Writing to path:', filePath);

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

    console.log('Frontmatter:', frontmatter);

    const fileContent = matter.stringify(post.content || '', frontmatter);
    await writeFile(filePath, fileContent, 'utf-8');
    console.log('Post created successfully');
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

export async function updatePost(slug: string, post: Post): Promise<void> {
  try {
    console.log('Updating post:', slug);
    
    const currentPath = join(process.cwd(), CONTENT_DIR, `${slug}.mdx`);
    const newSlug = slugify(post.title, { lower: true, strict: true });
    const newPath = join(process.cwd(), CONTENT_DIR, `${newSlug}.mdx`);

    console.log('Current path:', currentPath);
    console.log('New path:', newPath);

    // If title changed, handle file rename
    if (slug !== newSlug) {
      console.log('Title changed, creating new file');
      // Create new file with updated content
      await createPost(post);
      
      // Move old file to backup
      const backupPath = `${currentPath}.bak`;
      console.log('Creating backup at:', backupPath);
      await writeFile(backupPath, await readFile(currentPath, 'utf-8'), 'utf-8');
    } else {
      // Update existing file
      await createPost(post);
    }
    
    console.log('Post updated successfully');
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error(`Failed to update post: ${error.message}`);
  }
}

export async function deletePost(slug: string): Promise<void> {
  try {
    console.log('Deleting post:', slug);
    
    const sourcePath = join(process.cwd(), CONTENT_DIR, `${slug}.mdx`);
    const targetPath = join(process.cwd(), TRASH_DIR, `${slug}.mdx`);

    console.log('Moving from:', sourcePath);
    console.log('Moving to:', targetPath);

    // Move file to trash
    await writeFile(targetPath, await readFile(sourcePath, 'utf-8'), 'utf-8');
    console.log('Post moved to trash successfully');
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}

export async function restorePost(slug: string): Promise<void> {
  try {
    console.log('Restoring post:', slug);
    
    const sourcePath = join(process.cwd(), TRASH_DIR, `${slug}.mdx`);
    const targetPath = join(process.cwd(), CONTENT_DIR, `${slug}.mdx`);

    console.log('Moving from:', sourcePath);
    console.log('Moving to:', targetPath);

    // Move file back to content
    await writeFile(targetPath, await readFile(sourcePath, 'utf-8'), 'utf-8');
    console.log('Post restored successfully');
  } catch (error) {
    console.error('Error restoring post:', error);
    throw new Error(`Failed to restore post: ${error.message}`);
  }
}