export interface Post {
  id: string;
  title: string;
  description?: string;
  content: string;
  pubDate: Date;
  updatedDate?: Date;
  author: {
    name: string;
    title: string;
    image?: string;
  };
  category: 'material' | 'tips' | 'proyek' | 'teknologi';
  tags: string[];
  featured: boolean;
  image?: string;
  imageAlt?: string;
  readingTime?: number;
  deleted?: boolean;
  deletedAt?: string;
}