import React from 'react';
import { useParams } from 'react-router-dom';
import useGetEmployeeDashboard from '../features/authentication/hooks/useGetEmployeeDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import StatCard from '../components/StatCard';
import ShoutoutCard from '../components/ShoutoutCard';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';

function Dashboard() {
  const { userId } = useParams();
  const { dashboard, loading, error } = useGetEmployeeDashboard(userId);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error)   return <ErrorMessage message={error} />;
  if (!dashboard) return <ErrorMessage message="Dashboard data not found." />;

  const { user, stats, recent_received_shoutouts, recent_sent_shoutouts } = dashboard;

  return (
    <div>
      {/* Profile Header */}
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <Avatar name={user.name} size={64} />
        <div>
          <h1 style={{ fontSize: '1.375rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            Welcome, {user.name} 👋
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            {user.email}
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {user.department && <Badge label={user.department} variant="blue" />}
            <Badge label={user.role} variant={user.role === 'admin' ? 'purple' : 'gray'} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Shoutouts Received" value={stats.total_shoutouts_received} icon="🎉" color="#3b82f6" />
        <StatCard label="Shoutouts Sent"     value={stats.total_shoutouts_sent}     icon="📤" color="#10b981" />
        <StatCard label="Reactions Received" value={stats.total_reactions_received} icon="⭐" color="#f59e0b" />
        <StatCard label="Comments Received"  value={stats.total_comments_received}  icon="💬" color="#8b5cf6" />
      </div>

      {/* Recent Received */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#1e40af' }}>
          🎉 Recent Shoutouts Received
        </h2>
        {recent_received_shoutouts.length === 0 ? (
          <EmptyState icon="📭" title="No shoutouts received yet" subtitle="Your recognition will appear here." />
        ) : (
          recent_received_shoutouts.map((s) => <ShoutoutCard key={s.id} shoutout={s} />)
        )}
      </section>

      {/* Recent Sent */}
      <section>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#1e40af' }}>
          📤 Recent Shoutouts Sent
        </h2>
        {recent_sent_shoutouts.length === 0 ? (
          <EmptyState icon="📭" title="No shoutouts sent yet" subtitle="Start appreciating your teammates!" />
        ) : (
          recent_sent_shoutouts.map((s) => <ShoutoutCard key={s.id} shoutout={s} />)
        )}
      </section>
    </div>
  );
}

export default Dashboard;
