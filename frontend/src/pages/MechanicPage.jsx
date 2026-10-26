import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { JobTable } from '../components/JobTable';
import { JobStatusButtons } from '../components/JobStatusButtons';
import { StatusBadge } from '../components/StatusBadge';
import { mechanicApi } from '../api/mechanicApi';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/formatters';

export const MechanicPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [queueFilter, setQueueFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('TABLE'); // 'TABLE' or 'KANBAN'

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

  const pendingJobs = useMemo(() => jobs.filter((j) => j.status === 'PENDING'), [jobs]);
  const inProgressJobs = useMemo(() => jobs.filter((j) => j.status === 'IN_PROGRESS'), [jobs]);
  const completedJobs = useMemo(() => jobs.filter((j) => j.status === 'COMPLETED'), [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      const matchSearch =
        j.vehicleRegNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.jobId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || j.status === statusFilter;
      const matchQueue = queueFilter === 'ALL' || j.queueClass === queueFilter;

      return matchSearch && matchStatus && matchQueue;
    });
  }, [jobs, searchQuery, statusFilter, queueFilter]);

  const toggleStatFilter = (status) => {
    setStatusFilter((prev) => (prev === status ? 'ALL' : status));
  };

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {/* Mechanic Console Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 2.25rem',
          marginBottom: '2.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              <span>WORKSHOP FLOOR CONSOLE</span> • <span>SHIFT LIVE</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Workshop Technician Bay
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '620px', marginTop: '0.35rem' }}>
              Logged in as <strong style={{ color: 'var(--text-primary)' }}>{user?.name || 'Assigned Specialist'}</strong> • Execute allocated maintenance slots and confirm completion with digital notes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={loadJobs}
              disabled={loading}
              title="Refresh Queue"
            >
              ↻ Refresh Sync
            </button>
          </div>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        {/* Interactive Stats Cards */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          {/* Pending Card */}
          <div
            className="card card-interactive"
            onClick={() => toggleStatFilter('PENDING')}
            style={{
              borderLeft: '4px solid var(--warning)',
              background: statusFilter === 'PENDING' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)',
              boxShadow: statusFilter === 'PENDING' ? '0 0 20px rgba(245, 158, 11, 0.25)' : 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Pending Inspection
              </span>
              <span style={{ fontSize: '1.25rem' }}>⏳</span>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.25rem', color: '#fbbf24', fontFamily: 'var(--font-mono)' }}>
              {pendingJobs.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {statusFilter === 'PENDING' ? '✓ Filter active (Click to reset)' : 'Click to filter pending jobs'}
            </div>
          </div>

          {/* In Progress Card */}
          <div
            className="card card-interactive"
            onClick={() => toggleStatFilter('IN_PROGRESS')}
            style={{
              borderLeft: '4px solid var(--info)',
              background: statusFilter === 'IN_PROGRESS' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
              boxShadow: statusFilter === 'IN_PROGRESS' ? '0 0 20px rgba(59, 130, 246, 0.25)' : 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                In Active Work
              </span>
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.25rem', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
              {inProgressJobs.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {statusFilter === 'IN_PROGRESS' ? '✓ Filter active (Click to reset)' : 'Click to filter ongoing jobs'}
            </div>
          </div>

          {/* Completed Card */}
          <div
            className="card card-interactive"
            onClick={() => toggleStatFilter('COMPLETED')}
            style={{
              borderLeft: '4px solid var(--success)',
              background: statusFilter === 'COMPLETED' ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
              boxShadow: statusFilter === 'COMPLETED' ? '0 0 20px rgba(16, 185, 129, 0.25)' : 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Completed & Signed
              </span>
              <span style={{ fontSize: '1.25rem' }}>✓</span>
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.25rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {completedJobs.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {statusFilter === 'COMPLETED' ? '✓ Filter active (Click to reset)' : 'Click to filter completed jobs'}
            </div>
          </div>
        </div>

        {/* Filter and View Controls Bar */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.1rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by vehicle plate, service name or job ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ maxWidth: '320px', padding: '0.5rem 0.9rem', fontSize: '0.875rem' }}
            />

            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${queueFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setQueueFilter('ALL')}
              >
                All Queues
              </button>
              <button
                type="button"
                className={`btn btn-sm ${queueFilter === 'SHORT' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setQueueFilter('SHORT')}
              >
                ⚡ Short Queue
              </button>
              <button
                type="button"
                className={`btn btn-sm ${queueFilter === 'LONG' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setQueueFilter('LONG')}
              >
                ⚙️ Long Queue
              </button>
            </div>
          </div>

          {/* View Mode Toggle: Table vs Kanban */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-md)', padding: '0.25rem', border: '1px solid var(--border-color)' }}>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'TABLE' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('TABLE')}
              style={{ border: 'none', padding: '0.35rem 0.85rem' }}
            >
              📋 Table View
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'KANBAN' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('KANBAN')}
              style={{ border: 'none', padding: '0.35rem 0.85rem' }}
            >
              📊 Kanban Board
            </button>
          </div>
        </div>

        {/* Main Content: Table or Kanban */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div className="pulse-dot" style={{ width: '12px', height: '12px', margin: '0 auto 1rem', display: 'block' }}></div>
            <div>Syncing shop floor queue...</div>
          </div>
        ) : viewMode === 'TABLE' ? (
          <JobTable jobs={filteredJobs} onStatusUpdate={handleStatusUpdate} />
        ) : (
          /* Kanban Board View */
          <div className="kanban-board">
            {/* Column 1: Pending */}
            <div className="kanban-col" style={{ borderTop: '3px solid var(--warning)' }}>
              <div className="kanban-col-header">
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fbbf24', textTransform: 'uppercase' }}>
                  ⏳ Pending ({filteredJobs.filter((j) => j.status === 'PENDING').length})
                </span>
              </div>
              {filteredJobs.filter((j) => j.status === 'PENDING').map((job) => (
                <div key={job.jobId} className="kanban-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', fontSize: '0.85rem' }}>
                      {job.vehicleRegNo}
                    </span>
                    <span className={`queue-badge ${job.queueClass === 'SHORT' ? 'queue-short' : 'queue-long'}`}>
                      {job.queueClass}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {job.serviceName}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    Slot: {job.slotStart} - {job.estimatedEnd} ({job.expectedMinutes}m)
                  </div>
                  <JobStatusButtons job={job} onStatusUpdate={handleStatusUpdate} />
                </div>
              ))}
            </div>

            {/* Column 2: In Progress */}
            <div className="kanban-col" style={{ borderTop: '3px solid var(--info)' }}>
              <div className="kanban-col-header">
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#60a5fa', textTransform: 'uppercase' }}>
                  ⚡ In Progress ({filteredJobs.filter((j) => j.status === 'IN_PROGRESS').length})
                </span>
              </div>
              {filteredJobs.filter((j) => j.status === 'IN_PROGRESS').map((job) => (
                <div key={job.jobId} className="kanban-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', fontSize: '0.85rem' }}>
                      {job.vehicleRegNo}
                    </span>
                    <span className={`queue-badge ${job.queueClass === 'SHORT' ? 'queue-short' : 'queue-long'}`}>
                      {job.queueClass}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {job.serviceName}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    Slot: {job.slotStart} - {job.estimatedEnd}
                  </div>
                  <JobStatusButtons job={job} onStatusUpdate={handleStatusUpdate} />
                </div>
              ))}
            </div>

            {/* Column 3: Completed */}
            <div className="kanban-col" style={{ borderTop: '3px solid var(--success)' }}>
              <div className="kanban-col-header">
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#34d399', textTransform: 'uppercase' }}>
                  ✓ Completed ({filteredJobs.filter((j) => j.status === 'COMPLETED').length})
                </span>
              </div>
              {filteredJobs.filter((j) => j.status === 'COMPLETED').map((job) => (
                <div key={job.jobId} className="kanban-card" style={{ opacity: 0.9 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)', fontSize: '0.85rem' }}>
                      {job.vehicleRegNo}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 700 }}>
                      ✓ DONE
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                    {job.serviceName}
                  </h4>
                  {job.notes && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '0.4rem', borderRadius: '4px', marginTop: '0.4rem' }}>
                      "{job.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MechanicPage;
