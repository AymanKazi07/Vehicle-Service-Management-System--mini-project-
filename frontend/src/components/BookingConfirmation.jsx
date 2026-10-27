import React from 'react';
import { StatusBadge } from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';

export const BookingConfirmation = ({ booking, onClose }) => {
  if (!booking) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '700px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ✓ Booking Confirmed & Slots Allocated
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
              Booking #{booking.bookingId}
            </h3>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            ✕ Close
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Vehicle</span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{booking.vehicleRegNo}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Scheduled Date</span>
            <strong>{formatDate(booking.date)}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Overall Completion</span>
            <strong style={{ color: 'var(--warning)' }}>~ {booking.overallEnd || 'End of day'}</strong>
          </div>
        </div>

        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Allocated Service Jobs ({booking.jobs?.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.25rem' }}>
          {booking.jobs?.map((job) => (
            <div key={job.jobId} style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{job.serviceName}</strong>
                  <span style={{
                    fontSize: '0.65rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: 'var(--radius-full)',
                    background: job.queueClass === 'SHORT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: job.queueClass === 'SHORT' ? '#34d399' : '#fbbf24',
                    fontWeight: 700,
                  }}>
                    {job.queueClass} QUEUE
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Mechanic: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{job.mechanicName}</span> • Workshop: {job.workshopName}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Slot: <strong style={{ color: 'var(--accent)' }}>{job.slotStart} - {job.estimatedEnd}</strong>
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
                  {formatCurrency(job.price)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
