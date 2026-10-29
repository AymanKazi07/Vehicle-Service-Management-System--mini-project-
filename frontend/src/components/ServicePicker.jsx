import React, { useState, useMemo } from 'react';
import { formatCurrency, formatDuration } from '../utils/formatters';

export const ServicePicker = ({ services, selectedServiceIds, onToggleService }) => {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    if (!services || !Array.isArray(services)) return [];
    const query = (searchQuery || '').trim().toLowerCase();
    return services.filter((srv) => {
      if (!srv) return false;
      const srvName = (srv.name || srv.serviceName || '').toLowerCase();
      const matchesSearch = !query || srvName.includes(query);
      if (filterType === 'SHORT') return matchesSearch && srv.queueClass === 'SHORT';
      if (filterType === 'LONG') return matchesSearch && srv.queueClass === 'LONG';
      return matchesSearch;
    });
  }, [services, filterType, searchQuery]);

  if (!services || services.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
        <p>No catalog services defined for this specific vehicle category and sub-type yet.</p>
      </div>
    );
  }

  const shortCount = services.filter((s) => s.queueClass === 'SHORT').length;
  const longCount = services.filter((s) => s.queueClass === 'LONG').length;

  return (
    <div>
      {/* Controls: Search and Filter Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('ALL')}
          >
            All ({services.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'SHORT' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('SHORT')}
            style={filterType === 'SHORT' ? {} : { color: '#34d399' }}
          >
            ⚡ Fast Turnaround ({shortCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterType === 'LONG' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType('LONG')}
            style={filterType === 'LONG' ? {} : { color: '#fbbf24' }}
          >
            ⚙️ Deep Inspection ({longCount})
          </button>
        </div>

        <div style={{ position: 'relative', width: '220px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Catalog Services */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.85rem' }}>
        {filteredServices.map((srv, idx) => {
          const srvId = srv.id || srv.serviceId || `srv-${idx}`;
          const isSelected = selectedServiceIds.includes(srvId);
          const isShort = srv.queueClass === 'SHORT';

          return (
            <div
              key={srvId}
              onClick={() => onToggleService(srvId)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                padding: '1rem',
                background: isSelected ? 'rgba(99, 102, 241, 0.16)' : 'rgba(15, 23, 42, 0.65)',
                border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: isSelected ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none',
              }}
            >
              <div style={{
                marginTop: '0.15rem',
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--text-muted)'}`,
                background: isSelected ? 'var(--primary)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}>
                {isSelected && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {srv.name || srv.serviceName || 'Automotive Service'}
                  </span>
                  <span className={`queue-badge ${isShort ? 'queue-short' : 'queue-long'}`}>
                    {isShort ? '⚡' : '⚙️'} {formatDuration(srv.expectedMinutes)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Est. Duration: {srv.expectedMinutes} mins
                  </span>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    color: isSelected ? '#a5b4fc' : 'var(--accent)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {formatCurrency(srv.price)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicePicker;
