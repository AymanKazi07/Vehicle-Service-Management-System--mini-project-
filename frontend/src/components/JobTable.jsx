import React from 'react';
import { StatusBadge } from './StatusBadge';
import { JobStatusButtons } from './JobStatusButtons';
import { formatDate } from '../utils/formatters';

export const JobTable = ({ jobs, onStatusUpdate }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔧</div>
        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          No Jobs Assigned Matching Current Filter
        </h4>
        <p style={{ fontSize: '0.875rem' }}>
          All service appointments are either completed or not assigned to this queue.
        </p>
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Job Identifier</th>
            <th>Vehicle Plate</th>
            <th>Service Details</th>
            <th>Queue Class</th>
            <th>Scheduled Slot</th>
            <th>Workflow Status</th>
            <th style={{ textAlign: 'right' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.jobId}>
              {/* Job ID */}
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {job.jobId}
              </td>

              {/* Vehicle Registration Plate */}
              <td>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: 'var(--accent)',
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  padding: '0.25rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  letterSpacing: '0.04em'
                }}>
                  {job.vehicleRegNo}
                </span>
              </td>

              {/* Service Details */}
              <td>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.925rem' }}>
                  {job.serviceName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Standard Shop Time: {job.expectedMinutes} mins
                </div>
              </td>

              {/* Queue Class */}
              <td>
                <span className={`queue-badge ${job.queueClass === 'SHORT' ? 'queue-short' : 'queue-long'}`}>
                  {job.queueClass === 'SHORT' ? '⚡ SHORT' : '⚙️ LONG'}
                </span>
              </td>

              {/* Scheduled Date & Slot */}
              <td>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  {formatDate(job.date)}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span>⏱️</span>
                  <span>{job.slotStart} - {job.estimatedEnd}</span>
                </div>
              </td>

              {/* Status Badge */}
              <td>
                <StatusBadge status={job.status} />
              </td>

              {/* Status Action Buttons */}
              <td style={{ textAlign: 'right' }}>
                <JobStatusButtons job={job} onStatusUpdate={onStatusUpdate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
