import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ServiceHistoryList = ({ history, vehicleRegNo, onViewBill }) => {
  if (!history || history.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: 'var(--text-muted)' }}>
        <div style={{ width: '56px', height: '56px', margin: '0 auto 1rem', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>
          📑
        </div>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          No Prior Service Stack
        </h4>
        <p style={{ fontSize: '0.85rem', maxWidth: '360px', margin: '0 auto' }}>
          No completed maintenance jobs recorded yet for <strong>{vehicleRegNo}</strong>. Complete your first service appointment to start your audit history.
        </p>
      </div>
    );
  }

  return (
    <div className="history-timeline">
      {history.map((record, index) => (
        <div key={record.bookingId || index} className="history-item">
          <div className="history-dot"></div>

          <div className="card" style={{ padding: '1.35rem', transition: 'all 0.2s ease' }}>
            {/* Header: Date & Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {formatDate(record.date)}
                  </span>
                  <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '0.1rem 0.45rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                    COMPLETED
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
                  {record.workshopName || 'Apex SpeedWorks Central'}
                </h4>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(record.total)}
                </div>
                <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                  (incl. 18% GST: {formatCurrency(record.gst)})
                </div>
              </div>
            </div>

            {/* Work Done Chips */}
            <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: 'var(--radius-md)', padding: '0.85rem', marginBottom: '0.85rem', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Operations Completed:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {record.services?.map((srv, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.775rem',
                      fontWeight: 600,
                      color: '#c7d2fe',
                    }}
                  >
                    ✓ {srv}
                  </span>
                ))}
              </div>
            </div>

            {/* Mechanics & View Bill Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🔧</span>
                <span>Specialist(s): <strong style={{ color: 'var(--text-secondary)' }}>{record.mechanicNames?.join(', ') || 'Central Workshop Team'}</strong></span>
              </div>

              {record.bookingId && onViewBill && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => onViewBill(record.bookingId)}
                  style={{ gap: '0.4rem', fontSize: '0.775rem' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <span>Tax Invoice</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceHistoryList;
