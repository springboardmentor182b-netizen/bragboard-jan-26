import React, { useState } from "react";
import ShoutoutCard from "./ShoutoutCard";
import ShoutoutFilters from "./ShoutoutFilters";
import useShoutouts from "../hooks/useShoutouts";

const ShoutoutFeed = () => {
  const [filters, setFilters] = useState({});
  const { shoutouts, total, loading, error, refetch } = useShoutouts(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    refetch(0, 20, newFilters);
  };

  if (loading) return <p className="feed-status">Loading shoutouts...</p>;
  if (error) return <p className="feed-status feed-status--error">{error}</p>;

  return (
    <div className="shoutout-feed">
      <div className="feed-header">
        <h2>Recognition Wall</h2>
        <span className="feed-count">{total} shoutouts</span>
      </div>
      
      <ShoutoutFilters onFilterChange={handleFilterChange} />
      
      <div className="shoutouts-list">
        {shoutouts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎉</div>
            <p className="empty-state-text">No shoutouts yet. Be the first!</p>
          </div>
        ) : (
          shoutouts.map((s) => (
            <ShoutoutCard key={s.id} shoutout={s} onDelete={() => refetch()} />
          ))
        )}
      </div>
    </div>
  );
};

export default ShoutoutFeed;
