import React from 'react';

function Checkbox({ label, name, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
      />
      {label}
    </label>
  );
}

export { Checkbox };
export default Checkbox;
