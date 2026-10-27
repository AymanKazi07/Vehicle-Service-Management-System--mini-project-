import React, { useState } from 'react';

export const JobStatusButtons = ({ job, onStatusUpdate }) => {
  const [notes, setNotes] = useState(job.notes || '');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartWork = async () => {
    setLoading(true);
    try {
      await onStatusUpdate(job.jobId, 'IN_PROGRESS', notes || 'Service in progress');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmComplete = async () => {
    setLoading(true);
    try {
      await onStatusUpdate(job.jobId, 'COMPLETED', notes || 'Service completed successfully');
      setShowNotesModal(false);
    } finally {
      setLoading(false);
    }
  };

  if (job.status === 'COMPLETED') {
    return (
      <div style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
        ✓ Finished {job.notes ? `(${job.notes})` : ''}
      </div>
    );
  }

  if (job.status === 'PENDING') {
    return (
      <button
        className="btn btn-primary btn-sm"
        onClick={handleStartWork}
        disabled={loading}
      >
        {loading ? 'Starting...' : 'Start Job'}
      </button>
    );
  }

  return (
    <>
      <button
        className="btn btn-success btn-sm"
        onClick={() => setShowNotesModal(true)}
        disabled={loading}
      >
        Confirm Completion
      </button>

      {showNotesModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '480px' }}>
            <h3 className="card-title">Confirm Service Completion</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Confirm work done for <strong>{job.serviceName}</strong> on vehicle <strong>{job.vehicleRegNo}</strong>.
            </p>
            <div className="form-group">
              <label className="form-label">Work Done Notes</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. Engine oil replaced, filter cleaned, pressure tested."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button className="btn btn-secondary" onClick={() => setShowNotesModal(false)} disabled={loading}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleConfirmComplete} disabled={loading}>
                {loading ? 'Submitting...' : 'Complete & Finalize'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
