import React, { useState, useEffect, useCallback } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Post } from '../../types/blog';
import { CategorySelect } from './form/CategorySelect';
import { TagInput } from './form/TagInput';

interface PostEditorProps {
  post: Post | null;
  onSave: (post: Omit<Post, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Post['category']>('material');
  const [tags, setTags] = useState('');
  const [featured, setFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  // Update form when post prop changes
  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setDescription(post.description || '');
      setContent(post.content || '');
      setCategory(post.category || 'material');
      setTags(post.tags?.join(', ') || '');
      setFeatured(post.featured || false);
    } else {
      // Reset form for new post
      setTitle('');
      setDescription('');
      setContent('');
      setCategory('material');
      setTags('');
      setFeatured(false);
    }
  }, [post]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    try {
      setSaving(true);
      const postData = {
        id: post?.id,
        title,
        description,
        content,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        featured,
        pubDate: post?.pubDate || new Date(),
        updatedDate: new Date(),
        author: post?.author || {
          name: 'Admin',
          title: 'Administrator'
        },
        readingTime: Math.ceil(content.split(' ').length / 200)
      };

      console.log('Saving post:', postData);
      onSave(postData);
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  }, [post, title, description, content, category, tags, featured, saving, onSave]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <Editor
          apiKey={import.meta.env.PUBLIC_TINYMCE_API_KEY}
          value={content}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | image media | help',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 16px; line-height: 1.6; }',
            branding: false,
            promotion: false,
            elementpath: false,
            statusbar: true,
            paste_data_images: true,
            automatic_uploads: true,
            images_upload_url: '/api/upload',
            images_upload_handler: async (blobInfo, progress) => {
              try {
                const formData = new FormData();
                formData.append('file', blobInfo.blob(), blobInfo.filename());
                
                const response = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData
                });
                
                if (!response.ok) throw new Error('Upload failed');
                
                const data = await response.json();
                return data.url;
              } catch (error) {
                console.error('Upload failed:', error);
                throw error;
              }
            }
          }}
          onEditorChange={setContent}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <CategorySelect value={category} onChange={setCategory} />
        <TagInput value={tags} onChange={setTags} />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600">Featured post</span>
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}