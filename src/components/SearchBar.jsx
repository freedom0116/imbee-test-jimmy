import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex flex-row mt-2 h-8">
      <input
        type="text"
        placeholder="tag"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-blue-300 rounded-l-lg"
      />
      <div className="relative bg-blue-300 px-4 py-1 rounded-r-lg">Search</div>
    </div>
  );
}
