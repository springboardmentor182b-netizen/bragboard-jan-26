import React, { useState, useEffect } from 'react';
import { shoutoutService } from '../services/shoutoutService';

const ShoutoutFilters = ({ onFilterChange, users = [] }) => {
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    department: '',
    sender_id: '',
    recipient_id: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    // Load departments
    shoutoutService.getDepartments().then(data => {
      setDepartments(data.departments || []);
    }).catch(err => console.error('Failed to load departments', err));
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Convert date strings to Date objects
    const apiFilters = {
      ...newFilters,
      start_date: newFilters.start_date ? new Date(newFilters.start_date) : null,
      end_date: newFilters.end_date ? new Date(newFilters.end_date) : null
    };
    
    onFilterChange(apiFilters);
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      sender_id: '',
      recipient_id: '',
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
          <label>From (Sender)</label>
          <select 
            value={filters.sender_id}
            onChange={(e) => handleFilterChange('sender_id', e.target.value)}
          >
            <option value="">All Senders</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>To (Recipient)</label>
          <select 
            value={filters.recipient_id}
            onChange={(e) => handleFilterChange('recipient_id', e.target.value)}
          >
            <option value="">All Recipients</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
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
