import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Post } from '../../types/blog';
import { useEditor } from '../../hooks/useEditor';
import { CategorySelect } from './form/CategorySelect';
import { TagInput } from './form/TagInput';

interface PostEditorProps {
  post?: Post;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title || '');
  const [content, setContent] = useState(post?.content || '');
  const [category, setCategory] = useState(post?.category || 'material');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [featured, setFeatured] = useState(post?.featured || false);
  
  const { handleEditorInit } = useEditor();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSave({
      id: post?.id || crypto.randomUUID(),
      title,
      content,
      category,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      featured,
      pubDate: post?.pubDate || new Date(),
      updatedDate: new Date(),
      author: post?.author || {
        name: 'Admin',
        title: 'Administrator'
      }
    });
  };

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
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <Editor
          onInit={handleEditorInit}
          initialValue={content}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
            branding: false,
            elementpath: false,
            statusbar: false
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
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Save Post
        </button>
      </div>
    </form>
  );
}