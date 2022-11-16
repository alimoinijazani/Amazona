import React from 'react';

export default function Input({ name, value, onChange }) {
  return (
    <div className="form-group">
      <label for={name}>{name}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
}
