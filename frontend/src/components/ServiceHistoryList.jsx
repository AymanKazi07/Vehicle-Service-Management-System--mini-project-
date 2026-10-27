import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const ServiceHistoryList = ({ history, vehicleRegNo, onViewBill }) => {
  if (!history || history.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No past service records found for <strong>{vehicleRegNo}</strong>.</p>
        <p style={{ fontSize: '0.85rem' }}>Book your first service using the form below to initiate maintenance tracking.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {history.map((record, index) => (
        <div key={record.bookingId || index} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase' }}>
                Service Date: {formatDate(record.date)}
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '0.2rem' }}>
                {record.workshopName || 'Central Auto Care'}
              </h4>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {formatCurrency(record.total)}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                (incl. 18% GST: {formatCurrency(record.gst)})
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(0, 0, 0, 0.25)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Work Done:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {record.services?.map((srv, idx) => (
                <span key={idx} style={{
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#a5b4fc',
                }}>
                  {srv}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Mechanic(s): {record.mechanicNames?.join(', ') || 'Assigned Specialist'}</span>
            {record.bookingId && onViewBill && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => onViewBill(record.bookingId)}
              >
                View Official Bill
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
