import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const BookingConfirmation = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '680px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#34d399' }}>
              ✓
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Automated Allocation Complete
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                Appointment Confirmed
              </h3>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onClose}
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            ✕
          </button>
        </div>

        {/* Quick Details Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
          background: 'rgba(13, 19, 31, 0.8)',
          border: '1px solid var(--border-color)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          marginBottom: '1.5rem'
        }}>
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Booking Reference
            </span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary-light)', fontSize: '1.05rem' }}>
              {booking.bookingId}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Vehicle Registration
            </span>
            <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontSize: '1.05rem' }}>
              {booking.vehicleRegNo}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Service Date
            </span>
            <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              {formatDate(booking.date)}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
              Est. Completion
            </span>
            <strong style={{ color: '#fbbf24', fontSize: '0.95rem' }}>
              ~ {booking.overallEnd || 'By 17:00'}
            </strong>
          </div>
        </div>

        {/* Allocated Jobs List */}
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Allocated Service Pipelines ({booking.jobs?.length} Jobs Dispatched)
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '0.35rem' }}>
          {booking.jobs?.map((job, idx) => (
            <div
              key={job.jobId || idx}
              style={{
                background: 'rgba(22, 34, 53, 0.65)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    {job.serviceName}
                  </span>
                  <span className={`queue-badge ${job.queueClass === 'SHORT' ? 'queue-short' : 'queue-long'}`}>
                    {job.queueClass} QUEUE
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Assigned Specialist: <strong style={{ color: 'var(--text-secondary)' }}>{job.mechanicName}</strong> • {job.workshopName || 'Central Hub'}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Slot Window: <span style={{ color: 'var(--accent)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{job.slotStart} - {job.estimatedEnd}</span>
                </div>
                <div style={{ fontSize: '0.975rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                  {formatCurrency(job.price)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <button type="button" className="btn btn-outline btn-sm" onClick={handlePrint}>
            🖨️ Print Confirmation
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done & Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
