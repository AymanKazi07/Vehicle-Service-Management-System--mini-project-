import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;
  const s = status.toUpperCase();
  let badgeClass = 'status-pending';

  if (s === 'IN_PROGRESS') {
    badgeClass = 'status-in-progress';
  } else if (s === 'COMPLETED') {
    badgeClass = 'status-completed';
  }

  return (
    <span className={`status-badge ${badgeClass}`}>
      {s.replace('_', ' ')}
    </span>
  );
};
