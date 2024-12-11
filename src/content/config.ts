import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    author: z.object({
      name: z.string(),
      title: z.string(),
      image: z.string().optional(),
    }),
    category: z.enum(['material', 'tips', 'proyek', 'teknologi']),
    tags: z.array(z.string()),
    readingTime: z.number(),
    featured: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  schema: z.object({
    name: z.string(),
    title: z.string(),
    bio: z.string(),
    image: z.string().optional(),
    social: z.object({
      website: z.string().url().optional(),
      twitter: z.string().optional(),
      linkedin: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog, authors };