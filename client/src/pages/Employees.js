import React, { useState } from 'react';
import useGetAllEmployees from '../features/authentication/hooks/useGetAllEmployees';
import EmployeeCard from '../components/EmployeeCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import FormInput from '../components/Form/FormInput';
import FormSelect from '../components/Form/FormSelect';
import { DEPARTMENTS } from '../data/constants';

const DEPT_OPTIONS = DEPARTMENTS.map((d) => ({ value: d, label: d }));

function Employees() {
  const { employees, loading, error } = useGetAllEmployees();
  const [search, setSearch]           = useState('');
  const [department, setDept]         = useState('');

  const filtered = (employees || []).filter((e) => {
    const matchName = e.name.toLowerCase().includes(search.toLowerCase());
    const matchDept = department ? e.department === department : true;
    return matchName && matchDept;
  });

  return (
    <div>
      <h1 style={{ fontSize: '1.375rem', fontWeight: '800', marginBottom: '1.25rem' }}>👥 Employees</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <FormInput
            name="search"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={{ flex: '1 1 180px' }}>
          <FormSelect
            name="department"
            value={department}
            onChange={(e) => setDept(e.target.value)}
            options={DEPT_OPTIONS}
            placeholder="All Departments"
          />
        </div>
      </div>

      {loading && <LoadingSpinner message="Loading employees..." />}
      {error   && <ErrorMessage message={error} />}

      {!loading && !error && (
        filtered.length === 0 ? (
          <EmptyState icon="👤" title="No employees found" subtitle="Try a different search or filter." />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {filtered.map((emp) => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default Employees;
