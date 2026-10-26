import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const s = status.toUpperCase();

  if (s === 'IN_PROGRESS') {
    return (
      <span className="status-badge status-in-progress">
        <span className="pulse-dot" style={{ backgroundColor: '#60a5fa', width: '6px', height: '6px' }}></span>
        <span>IN PROGRESS</span>
      </span>
    );
  }

  if (s === 'COMPLETED') {
    return (
      <span className="status-badge status-completed">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
        <span>COMPLETED</span>
      </span>
    );
  }

  return (
    <span className="status-badge status-pending">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      <span>PENDING</span>
    </span>
  );
};

export default StatusBadge;
