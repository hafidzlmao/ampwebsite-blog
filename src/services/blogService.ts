import { supabase } from '../lib/supabase';
import type { Post, NewPost, UpdatePost } from '../types/blog';

export async function createPost(post: NewPost) {
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      ...post,
      pub_date: post.pub_date.toISOString(),
      updated_date: post.updated_date.toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    pub_date: new Date(data.pub_date),
    updated_date: new Date(data.updated_date)
  };
}

export async function updatePost(id: string, post: UpdatePost) {
  const updateData = {
    ...post,
    updated_date: new Date().toISOString()
  };

  if (post.pub_date) {
    updateData.pub_date = post.pub_date.toISOString();
  }

  const { data, error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    pub_date: new Date(data.pub_date),
    updated_date: new Date(data.updated_date)
  };
}

export async function getAllPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('deleted', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(post => ({
    ...post,
    pub_date: new Date(post.pub_date),
    updated_date: new Date(post.updated_date)
  }));
}

export async function getPost(id: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('deleted', false)
    .single();

  if (error) throw error;
  return {
    ...data,
    pub_date: new Date(data.pub_date),
    updated_date: new Date(data.updated_date)
  };
}

export async function softDeletePost(id: string) {
  const { error } = await supabase
    .from('posts')
    .update({
      deleted: true,
      deleted_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
} 