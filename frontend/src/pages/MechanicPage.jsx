import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { JobTable } from '../components/JobTable';
import { mechanicApi } from '../api/mechanicApi';

export const MechanicPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await mechanicApi.getJobs();
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load assigned jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleStatusUpdate = async (jobId, status, notes) => {
    try {
      await mechanicApi.updateJobStatus(jobId, status, notes);
      await loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update job status');
    }
  };

  const pendingCount = jobs.filter((j) => j.status === 'PENDING').length;
  const inProgressCount = jobs.filter((j) => j.status === 'IN_PROGRESS').length;
  const completedCount = jobs.filter((j) => j.status === 'COMPLETED').length;

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Mechanic Workshop Console</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Execute scheduled service jobs, record work done notes, and advance service pipelines.
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={loadJobs} disabled={loading}>
            ↻ Refresh Jobs
          </button>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        {/* Stats Summary */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Pending Jobs</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#fbbf24' }}>
              {pendingCount}
            </div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>In Progress</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#60a5fa' }}>
              {inProgressCount}
            </div>
          </div>
          <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Completed</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#34d399' }}>
              {completedCount}
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        <section>
          <div className="card-title">
            <span>Scheduled Assignments</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Showing {jobs.length} jobs
            </span>
          </div>

          {loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading job queue...
            </div>
          ) : (
            <JobTable jobs={jobs} onStatusUpdate={handleStatusUpdate} />
          )}
        </section>
      </main>
    </div>
  );
};
