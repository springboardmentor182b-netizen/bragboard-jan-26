import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import Badge from './Badge';

/**
 * Card showing an employee's basic info.
 * Clicking navigates to their profile page.
 */
function EmployeeCard({ employee }) {
  const navigate = useNavigate();

  if (!employee) return null;

  return (
    <div
      onClick={() => navigate(`/employees/${employee.id}`)}
      style={{
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        transition: 'box-shadow 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)')}
    >
      <Avatar name={employee.name} size={48} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{employee.name}</p>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.35rem' }}>{employee.email}</p>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {employee.department && <Badge label={employee.department} variant="blue" />}
          <Badge label={employee.role} variant={employee.role === 'admin' ? 'purple' : 'gray'} />
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;
