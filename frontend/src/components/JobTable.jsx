import React from 'react';
import { StatusBadge } from './StatusBadge';
import { JobStatusButtons } from './JobStatusButtons';
import { formatDate } from '../utils/formatters';

export const JobTable = ({ jobs, onStatusUpdate }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        No assigned service jobs currently scheduled.
      </div>
    );
  }

  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Vehicle No</th>
            <th>Service</th>
            <th>Queue</th>
            <th>Date & Slot</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.jobId}>
              <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {job.jobId}
              </td>
              <td>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  background: 'rgba(6, 182, 212, 0.1)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  {job.vehicleRegNo}
                </span>
              </td>
              <td>
                <strong style={{ color: 'var(--text-primary)' }}>{job.serviceName}</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {job.expectedMinutes} mins
                </div>
              </td>
              <td>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: job.queueClass === 'SHORT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: job.queueClass === 'SHORT' ? '#34d399' : '#fbbf24',
                }}>
                  {job.queueClass}
                </span>
              </td>
              <td>
                <div>{formatDate(job.date)}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {job.slotStart} - {job.estimatedEnd}
                </div>
              </td>
              <td>
                <StatusBadge status={job.status} />
              </td>
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
