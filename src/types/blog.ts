export interface Post {
  id: string;
  title: string;
  description?: string;
  content: string;
  category: 'material' | 'tips' | 'proyek' | 'teknologi';
  tags: string[];
  featured: boolean;
  pub_date: Date;
  updated_date: Date;
  author: {
    name: string;
    title: string;
    image?: string;
  };
  reading_time?: number;
  deleted?: boolean;
  deleted_at?: string;
  created_at?: string;
}

export type NewPost = Omit<Post, 'id' | 'created_at' | 'deleted' | 'deleted_at'>;
export type UpdatePost = Partial<NewPost>;