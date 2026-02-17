import React from 'react';

/**
 * Simple pagination controls.
 */
function Pagination({ page, pageSize, total, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem 0' }}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        style={{
          padding: '0.4rem 0.8rem', borderRadius: '0.375rem',
          border: '1px solid #d1d5db', backgroundColor: '#fff',
          cursor: page <= 1 ? 'not-allowed' : 'pointer',
          color: page <= 1 ? '#d1d5db' : '#374151',
        }}
      >
        ← Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            padding: '0.4rem 0.8rem', borderRadius: '0.375rem',
            border: p === page ? '2px solid #3b82f6' : '1px solid #d1d5db',
            backgroundColor: p === page ? '#eff6ff' : '#fff',
            color: p === page ? '#1d4ed8' : '#374151',
            fontWeight: p === page ? '700' : '400',
            cursor: 'pointer',
          }}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        style={{
          padding: '0.4rem 0.8rem', borderRadius: '0.375rem',
          border: '1px solid #d1d5db', backgroundColor: '#fff',
          cursor: page >= totalPages ? 'not-allowed' : 'pointer',
          color: page >= totalPages ? '#d1d5db' : '#374151',
        }}
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
