import React, { useState } from 'react';

const PRESET_NOTES = [
  'Engine oil & oil filter renewed, level verified.',
  'Brake pads renewed & calipers greased.',
  'Air filter cleaned, spark plugs gapped.',
  'Tire rotation & 32 PSI pressure calibration complete.',
  'Multi-point diagnostic scan clear; 0 error codes.',
];

export const JobStatusButtons = ({ job, onStatusUpdate }) => {
  const [notes, setNotes] = useState(job.notes || '');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartWork = async () => {
    setLoading(true);
    try {
      await onStatusUpdate(job.jobId, 'IN_PROGRESS', notes || 'Technician initiated service inspection');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmComplete = async () => {
    setLoading(true);
    try {
      await onStatusUpdate(
        job.jobId,
        'COMPLETED',
        notes.trim() || 'Service completed successfully to manufacturer specifications.'
      );
      setShowNotesModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPreset = (preset) => {
    setNotes((prev) => (prev ? `${prev} ${preset}` : preset));
  };

  if (job.status === 'COMPLETED') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
        <span>✓ Work Finalized</span>
        {job.notes && (
          <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }} title={job.notes}>
            (Notes logged)
          </span>
        )}
      </div>
    );
  }

  if (job.status === 'PENDING') {
    return (
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={handleStartWork}
        disabled={loading}
        style={{ gap: '0.35rem' }}
      >
        <span>⚡ Start Job</span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-success btn-sm"
        onClick={() => setShowNotesModal(true)}
        disabled={loading}
        style={{ gap: '0.35rem' }}
      >
        <span>✓ Confirm Completion</span>
      </button>

      {showNotesModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Work Finalization
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  Complete Service Job
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowNotesModal(false)}
                disabled={loading}
              >
                ✕
              </button>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div>Service: <strong style={{ color: 'var(--text-primary)' }}>{job.serviceName}</strong></div>
              <div style={{ marginTop: '0.2rem' }}>Vehicle: <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{job.vehicleRegNo}</strong></div>
            </div>

            <div className="form-group">
              <label className="form-label">Quick Diagnostic Presets (Click to insert):</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                {PRESET_NOTES.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddPreset(p)}
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      borderRadius: 'var(--radius-full)',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.725rem',
                      color: '#c7d2fe',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    + {p.split(',')[0]}
                  </button>
                ))}
              </div>

              <label className="form-label">Technician Work Done Notes</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Detail the mechanical operations performed, replaced parts, or inspection findings..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowNotesModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={handleConfirmComplete}
                disabled={loading}
              >
                {loading ? 'Submitting Work...' : 'Finalize & Update System'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobStatusButtons;
