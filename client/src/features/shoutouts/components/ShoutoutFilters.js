import React, { useState, useEffect } from 'react';
import { shoutoutService } from '../services/shoutoutService';

const ShoutoutFilters = ({ onFilterChange }) => {
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    shoutoutService.getDepartments().then(data => {
      setDepartments(data.departments || []);
    }).catch(err => console.error('Failed to load departments', err));
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const apiFilters = {
      department: newFilters.department || null,
      start_date: newFilters.start_date ? new Date(newFilters.start_date) : null,
      end_date: newFilters.end_date ? new Date(newFilters.end_date) : null
    };
    
    onFilterChange(apiFilters);
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      start_date: '',
      end_date: ''
    });
    onFilterChange({});
  };

  return (
    <div className="filters-panel">
      <h3>Filter Shoutouts</h3>
      <div className="filters-grid">
        <div className="filter-group">
          <label>Department</label>
          <select 
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Start Date</label>
          <input 
            type="date" 
            value={filters.start_date}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>End Date</label>
          <input 
            type="date" 
            value={filters.end_date}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>&nbsp;</label>
          <button className="btn-clear" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoutoutFilters;
