import type { ImageMetadata } from 'astro';

// Type for supported image formats
export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'avif';

export interface ImageAsset {
  src: string;
  format: ImageFormat;
  width: number;
  height: number;
}

export function getImagePath(path: string): string {
  // Convert relative paths to absolute
  if (path.startsWith('/')) {
    return path;
  }
  // Handle content directory images
  if (path.startsWith('src/content/')) {
    return `/${path.replace('src/content/', '')}`;
  }
  return path;
}

export function isRemoteImage(src: string): boolean {
  try {
    const url = new URL(src);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}