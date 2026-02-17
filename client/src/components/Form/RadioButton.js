import React from 'react';

function RadioButton({ label, name, value, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        style={{ cursor: 'pointer' }}
      />
      {label}
    </label>
  );
}

export { RadioButton };
export default RadioButton;
