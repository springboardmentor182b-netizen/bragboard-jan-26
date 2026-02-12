import React, { useEffect, useState } from 'react';
import { fetchReports, deleteShoutout } from '../services/adminService';

const Moderation = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'reported'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'review'

  useEffect(() => {
    // Fetch reports from backend
    fetchReports()
      .then(data => {
        setReports(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setError(err.message);
        setLoading(false);
        // Use mock data if backend isn't available
        setReports(getMockData());
      });
  }, []);

  const handleDismiss = (id) => {
    setReports(reports.filter(r => r.id !== id));
    alert("Report dismissed");
  };

  const handleDelete = async (id) => {
    try {
      await deleteShoutout(id);
      setReports(reports.filter(r => r.id !== id));
      alert("Shoutout deleted successfully");
    } catch (err) {
      console.error('Error deleting shoutout:', err);
      // Still remove from UI even if API fails (for demo purposes)
      setReports(reports.filter(r => r.id !== id));
      alert("Shoutout removed (API not connected)");
    }
  };

  // Interactive Button Components with Touch Support
  const DismissButton = ({ onClick }) => {
    const [isActive, setIsActive] = useState(false);

    const handleInteraction = (e) => {
      console.log('Dismiss button clicked');
      e.preventDefault();
      e.stopPropagation();
      onClick();
    };

    return (
      <button
        onClick={handleInteraction}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsActive(true);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          setIsActive(false);
        }}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        style={{
          padding: '8px 16px',
          backgroundColor: isActive ? '#f3f4f6' : 'white',
          border: '2px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          transition: 'all 0.15s',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
      >
        Dismiss
      </button>
    );
  };

  const DeleteButton = ({ onClick }) => {
    const [isActive, setIsActive] = useState(false);

    const handleInteraction = (e) => {
      console.log('Delete button clicked');
      e.preventDefault();
      e.stopPropagation();
      onClick();
    };

    return (
      <button
        onClick={handleInteraction}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsActive(true);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          setIsActive(false);
        }}
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        style={{
          padding: '8px 16px',
          backgroundColor: isActive ? '#b91c1c' : '#dc2626',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.15s',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation'
        }}
      >
        <span>🗑️</span>
        <span>Delete</span>
      </button>
    );
  };

  // Filter Button Component with Touch Support
  const FilterButton = ({ children, isActive, onClick }) => {
    const [isTouching, setIsTouching] = useState(false);

    return (
      <button
        onClick={onClick}
        onTouchStart={(e) => {
          e.stopPropagation();
          setIsTouching(true);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          setIsTouching(false);
        }}
        onMouseEnter={() => setIsTouching(true)}
        onMouseLeave={() => setIsTouching(false)}
        style={{
          padding: '8px 16px',
          backgroundColor: isActive ? '#3b82f6' : (isTouching ? '#f3f4f6' : 'white'),
          border: isActive ? '2px solid #3b82f6' : '2px solid #d1d5db',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500',
          color: isActive ? 'white' : '#374151',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s ease',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          transform: isTouching && !isActive ? 'scale(0.98)' : 'scale(1)'
        }}
      >
        {children}
      </button>
    );
  };

  // Filter and sort reports
  const getFilteredReports = () => {
    let filtered = [...reports];

    // Apply status filter
    if (filterStatus === 'pending') {
      filtered = filtered.filter(r => r.status === 'Pending');
    } else if (filterStatus === 'review') {
      filtered = filtered.filter(r => r.status === 'Under Review');
    }

    // Apply sorting
    if (sortBy === 'recent') {
      // Sort by most recent (assuming id is chronological)
      filtered.sort((a, b) => b.id - a.id);
    } else if (sortBy === 'reported') {
      // For demo: sort by id in ascending order (oldest first)
      filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
  };

  const filteredReports = getFilteredReports();


  return (
    <div style={{ padding: '30px', backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 64px)' }}>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>
            Moderation Queue
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
            Review and manage reported content
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Sort Buttons */}
          <FilterButton
            isActive={sortBy === 'recent'}
            onClick={() => setSortBy('recent')}
          >
            <span>🕐</span>
            <span>Most Recent</span>
          </FilterButton>
          <FilterButton
            isActive={sortBy === 'reported'}
            onClick={() => setSortBy('reported')}
          >
            <span>📅</span>
            <span>Oldest First</span>
          </FilterButton>

          {/* Status Filter Buttons */}
          <div style={{
            width: '2px',
            height: '20px',
            backgroundColor: '#d1d5db',
            margin: '0 4px'
          }}></div>

          <FilterButton
            isActive={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
          >
            <span>📋</span>
            <span>All</span>
          </FilterButton>
          <FilterButton
            isActive={filterStatus === 'pending'}
            onClick={() => setFilterStatus('pending')}
          >
            <span>⏳</span>
            <span>Pending</span>
          </FilterButton>
          <FilterButton
            isActive={filterStatus === 'review'}
            onClick={() => setFilterStatus('review')}
          >
            <span>🔍</span>
            <span>Under Review</span>
          </FilterButton>
        </div>
      </div>

      {/* Moderation Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden'
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
          gap: '20px',
          padding: '16px 20px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
          fontWeight: '600',
          fontSize: '13px',
          color: '#374151'
        }}>
          <div>Flagged Content</div>
          <div>Reporter</div>
          <div>Reason</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div style={{
            padding: '60px 40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            {/* Animated Spinner */}
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <div style={{
              color: '#374151',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Loading reports...
            </div>
            <div style={{
              color: '#9ca3af',
              fontSize: '14px'
            }}>
              Please wait while we fetch the latest data
            </div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
            No reports to review
          </div>
        ) : (
          filteredReports.map(report => (
            <div
              key={report.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr',
                gap: '20px',
                padding: '20px',
                borderBottom: '1px solid #f3f4f6',
                alignItems: 'center'
              }}
            >
              {/* Flagged Content */}
              <div>
                <div style={{
                  fontSize: '14px',
                  color: '#1f2937',
                  marginBottom: '4px',
                  fontWeight: '500'
                }}>
                  "{report.content || report.message}"
                </div>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  Posted by {report.author} • {report.timeAgo}
                </div>
              </div>

              {/* Reporter */}
              <div style={{ fontSize: '14px', color: '#4b5563' }}>
                {report.reporter}
              </div>

              {/* Reason */}
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  backgroundColor: report.reason === 'Suspicious activity' ? '#fef2f2' : '#fff7ed',
                  color: report.reason === 'Suspicious activity' ? '#dc2626' : '#ea580c',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {report.reason}
                </span>
              </div>

              {/* Status */}
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  backgroundColor: report.status === 'Pending' ? '#fef3c7' : '#dbeafe',
                  color: report.status === 'Pending' ? '#92400e' : '#1e40af',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {report.status}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <DismissButton onClick={() => handleDismiss(report.id)} />
                <DeleteButton onClick={() => handleDelete(report.id)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Mock data for testing when backend isn't available
const getMockData = () => [
  {
    id: 1,
    content: "Want to recognize James and Rachel for their incredible work on the new feature...",
    author: "Lisa Anderson",
    timeAgo: "1 day ago",
    reporter: "Anonymous",
    reason: "Suspicious activity",
    status: "Pending"
  },
  {
    id: 2,
    content: "Jessica deserves a massive shoutout...",
    author: "Tom Martinez",
    timeAgo: "2 days ago",
    reporter: "Mike Chen",
    reason: "Inappropriate language in comments",
    status: "Under Review"
  }
];

export default Moderation;