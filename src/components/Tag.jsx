import React from 'react';

export default function Tag({ name, currentTag, onChange }) {
  return (
    <label className="p-1">
      <input
        type="radio"
        id={`tag-${name}`}
        name={name}
        value="none"
        className="peer hidden"
        checked={name === currentTag}
        onChange={() => onChange(name)}
      />
      <span className="inline-block border-2 border-blue-300 px-1 py-1 bg-white peer-checked:bg-blue-300 text-center rounded-md cursor-pointer mb-2">
        {name}
      </span>
    </label>
  );
}
