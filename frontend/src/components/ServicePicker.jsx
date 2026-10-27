import React from 'react';
import { formatCurrency, formatDuration } from '../utils/formatters';

export const ServicePicker = ({ services, selectedServiceIds, onToggleService }) => {
  if (!services || services.length === 0) {
    return <div style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>No catalog services available for this vehicle type.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
      {services.map((srv) => {
        const isSelected = selectedServiceIds.includes(srv.id);
        const isShort = srv.queueClass === 'SHORT';

        return (
          <div
            key={srv.id}
            onClick={() => onToggleService(srv.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              padding: '0.85rem',
              background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}} // controlled by card click
              style={{ marginTop: '0.25rem', accentColor: 'var(--primary)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {srv.name}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: isShort ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isShort ? '#34d399' : '#fbbf24',
                }}>
                  {srv.queueClass} ({formatDuration(srv.expectedMinutes)})
                </span>
              </div>
              <div style={{ marginTop: '0.35rem', fontSize: '0.95rem', fontWeight: 800, color: 'var(--accent)' }}>
                {formatCurrency(srv.price)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
