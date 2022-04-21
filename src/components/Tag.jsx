import React from 'react';

export default function Tag({ name, currentTag, setCurrentTag }) {
  return (
    <label className="p-1">
      <input
        type="radio"
        id={`tag-${name}`}
        name="contact"
        value="none"
        className="peer hidden"
        checked={name === currentTag}
        onChange={() => setCurrentTag(name)}
      />
      <span className="inline-block border-2 border-blue-400 px-1 py-1 peer-checked:bg-blue-400 text-center rounded-md">
        {name}
      </span>
    </label>
  );
}
