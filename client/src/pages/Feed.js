import React, { useState } from 'react';
import useGetShoutoutFeed from '../features/authentication/hooks/useGetShoutoutFeed';
import ShoutoutCard from '../components/ShoutoutCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';
import FormSelect from '../components/Form/FormSelect';
import { DEPARTMENTS, DEFAULT_PAGE_SIZE } from '../data/constants';

const DEPT_OPTIONS = DEPARTMENTS.map((d) => ({ value: d, label: d }));

function Feed() {
  const [page, setPage]       = useState(1);
  const [department, setDept] = useState('');

  const { feed, loading, error } = useGetShoutoutFeed({
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    department,
  });

  function handleDeptChange(e) {
    setDept(e.target.value);
    setPage(1);
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h1 style={{ fontSize: '1.375rem', fontWeight: '800' }}>📢 Shoutout Feed</h1>
        <div style={{ width: '200px' }}>
          <FormSelect
            name="department"
            value={department}
            onChange={handleDeptChange}
            options={DEPT_OPTIONS}
            placeholder="All Departments"
          />
        </div>
      </div>

      {loading && <LoadingSpinner message="Loading feed..." />}
      {error   && <ErrorMessage message={error} />}

      {!loading && !error && feed && (
        <>
          {feed.shoutouts.length === 0 ? (
            <EmptyState icon="📭" title="No shoutouts yet" subtitle="Be the first to post one!" />
          ) : (
            feed.shoutouts.map((s) => <ShoutoutCard key={s.id} shoutout={s} />)
          )}
          <Pagination
            page={page}
            pageSize={DEFAULT_PAGE_SIZE}
            total={feed.total}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default Feed;
