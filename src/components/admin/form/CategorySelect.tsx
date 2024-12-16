import React from 'react';
import type { Post } from '../../../types/blog';

interface CategorySelectProps {
  value: Post['category'];
  onChange: (value: Post['category']) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Post['category'])}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="material">Material</option>
        <option value="tips">Tips</option>
        <option value="proyek">Proyek</option>
        <option value="teknologi">Teknologi</option>
      </select>
    </div>
  );
}