import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { WorkshopForm } from '../components/WorkshopForm';
import { MechanicForm } from '../components/MechanicForm';
import { DataTable } from '../components/DataTable';
import { adminApi } from '../api/adminApi';
import { formatDate } from '../utils/formatters';

export const AdminPage = () => {
  const [workshops, setWorkshops] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('workshops');
  const [showAddWorkshop, setShowAddWorkshop] = useState(false);
  const [showAddMechanic, setShowAddMechanic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [wsData, mechData, bookData] = await Promise.all([
        adminApi.getWorkshops(),
        adminApi.getMechanics(),
        adminApi.getAllBookings(),
      ]);
      setWorkshops(wsData);
      setMechanics(mechData);
      setBookings(bookData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load administrative records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredWorkshops = useMemo(() => {
    if (!searchQuery) return workshops;
    const q = searchQuery.toLowerCase();
    return workshops.filter(
      (w) => w.name?.toLowerCase().includes(q) || w.address?.toLowerCase().includes(q) || w.id?.toLowerCase().includes(q)
    );
  }, [workshops, searchQuery]);

  const filteredMechanics = useMemo(() => {
    if (!searchQuery) return mechanics;
    const q = searchQuery.toLowerCase();
    return mechanics.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.id?.toLowerCase().includes(q)
    );
  }, [mechanics, searchQuery]);

  const filteredBookings = useMemo(() => {
    if (!searchQuery) return bookings;
    const q = searchQuery.toLowerCase();
    return bookings.filter(
      (b) =>
        b.bookingId?.toLowerCase().includes(q) ||
        b.vehicleRegNo?.toLowerCase().includes(q) ||
        b.customerId?.toLowerCase().includes(q)
    );
  }, [bookings, searchQuery]);

  const workshopColumns = [
    {
      header: 'Facility ID',
      accessor: 'id',
      width: '120px',
      render: (w) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{w.id}</span>
    },
    {
      header: 'Workshop Name',
      render: (w) => (
        <div>
          <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{w.name}</strong>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AutoServe Certified Center</div>
        </div>
      ),
    },
    {
      header: 'Location Address',
      render: (w) => (
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', maxWidth: '380px' }}>
          📍 {w.address}
        </div>
      )
    },
    {
      header: 'Contact Phone',
      render: (w) => (
        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 600 }}>
          📞 {w.contact}
        </span>
      )
    },
  ];

  const mechanicColumns = [
    {
      header: 'Staff ID',
      accessor: 'id',
      width: '110px',
      render: (m) => <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{m.id}</span>
    },
    {
      header: 'Technician Name',
      render: (m) => (
        <div>
          <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{m.name}</strong>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.email}</div>
        </div>
      ),
    },
    {
      header: 'Assigned Hub',
      render: (m) => {
        const ws = workshops.find((w) => w.id === m.workshopId);
        return (
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            🏢 {ws ? ws.name : m.workshopId}
          </span>
        );
      },
    },
    {
      header: 'Specializations',
      render: (m) => (
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {m.categories?.map((c) => (
            <span
              key={c}
              style={{
                fontSize: '0.72rem',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#c7d2fe',
                fontWeight: 600,
              }}
            >
              {c.replace('_', ' ')}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const bookingColumns = [
    {
      header: 'Booking Ref',
      render: (b) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary-light)' }}>
          {b.bookingId}
        </span>
      ),
      width: '130px',
    },
    {
      header: 'Vehicle Plate',
      render: (b) => (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: 'var(--accent)',
          background: 'rgba(6, 182, 212, 0.1)',
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--radius-sm)',
        }}>
          {b.vehicleRegNo}
        </span>
      ),
    },
    {
      header: 'Scheduled Date',
      render: (b) => formatDate(b.date),
    },
    {
      header: 'Pipelines Count',
      render: (b) => (
        <span style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700 }}>
          {b.jobIds?.length || 0} jobs
        </span>
      ),
    },
    {
      header: 'Est. Completion',
      render: (b) => (
        <span style={{ color: '#fbbf24', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
          ~ {b.overallEnd || '17:00'}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (b) => (
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => setSelectedBookingForDetails(b)}
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
        >
          Inspect Details
        </button>
      ),
    },
  ];

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {/* Admin Executive Header */}
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
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
              <span>ADMINISTRATIVE OPERATIONS</span> • <span>FULL ACCESS</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              System Control Console
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '620px', marginTop: '0.35rem' }}>
              Provision physical workshop hubs, register category-certified mechanic accounts, and audit all live customer booking pipelines.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => { setShowAddWorkshop(!showAddWorkshop); setShowAddMechanic(false); }}
            >
              {showAddWorkshop ? '✕ Close Form' : '+ New Workshop Hub'}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => { setShowAddMechanic(!showAddMechanic); setShowAddWorkshop(false); }}
            >
              {showAddMechanic ? '✕ Close Form' : '+ New Specialist Mechanic'}
            </button>
          </div>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        {/* Collapsible Forms */}
        {showAddWorkshop && (
          <WorkshopForm
            onWorkshopCreated={() => {
              setShowAddWorkshop(false);
              loadData();
            }}
            onCancel={() => setShowAddWorkshop(false)}
          />
        )}

        {showAddMechanic && (
          <MechanicForm
            workshops={workshops}
            onMechanicCreated={() => {
              setShowAddMechanic(false);
              loadData();
            }}
            onCancel={() => setShowAddMechanic(false)}
          />
        )}

        {/* Executive KPI Stats */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Active Workshops</span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.25rem', color: 'var(--primary-light)', fontFamily: 'var(--font-mono)' }}>
              {workshops.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Certified Service Centers</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Mechanic Workforce</span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.25rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
              {mechanics.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Multi-Category Specialists</div>
          </div>

          <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Service Bookings</span>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, marginTop: '0.25rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {bookings.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Scheduled Maintenance Jobs</div>
          </div>
        </div>

        {/* Search & Tabs Controls */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'workshops' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('workshops')}
            >
              🏢 Workshop Hubs ({workshops.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'mechanics' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('mechanics')}
            >
              🔧 Certified Mechanics ({mechanics.length})
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'bookings' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('bookings')}
            >
              📑 All Bookings ({bookings.length})
            </button>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', width: '280px' }}>
            <input
              type="text"
              className="form-control"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tab Tables */}
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div className="pulse-dot" style={{ width: '12px', height: '12px', margin: '0 auto 1rem', display: 'block' }}></div>
            <div>Loading administrative collections...</div>
          </div>
        ) : (
          <div>
            {activeTab === 'workshops' && (
              <DataTable
                columns={workshopColumns}
                data={filteredWorkshops}
                emptyMessage="No workshop centers registered or matching search."
              />
            )}
            {activeTab === 'mechanics' && (
              <DataTable
                columns={mechanicColumns}
                data={filteredMechanics}
                emptyMessage="No mechanics registered or matching search."
              />
            )}
            {activeTab === 'bookings' && (
              <DataTable
                columns={bookingColumns}
                data={filteredBookings}
                emptyMessage="No booking records registered or matching search."
              />
            )}
          </div>
        )}

        {/* Detailed Booking Inspection Modal */}
        {selectedBookingForDetails && (
          <div className="modal-overlay">
            <div className="modal-card" style={{ maxWidth: '600px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Audit Inspection
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                    Booking #{selectedBookingForDetails.bookingId}
                  </h3>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedBookingForDetails(null)}
                >
                  ✕
                </button>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Customer Identifier</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{selectedBookingForDetails.customerId}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Vehicle Registration</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>{selectedBookingForDetails.vehicleRegNo}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Scheduled Date</span>
                    <strong style={{ color: 'var(--text-primary)' }}>{formatDate(selectedBookingForDetails.date)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>Estimated Completion</span>
                    <strong style={{ color: '#fbbf24' }}>~ {selectedBookingForDetails.overallEnd || '17:00'}</strong>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', display: 'block', marginBottom: '0.5rem' }}>
                  Job IDs in Pipeline ({selectedBookingForDetails.jobIds?.length || 0}):
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedBookingForDetails.jobIds?.map((jid) => (
                    <span
                      key={jid}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8rem',
                        padding: '0.25rem 0.6rem',
                        background: 'rgba(99, 102, 241, 0.15)',
                        border: '1px solid rgba(99, 102, 241, 0.3)',
                        borderRadius: 'var(--radius-sm)',
                        color: '#c7d2fe',
                      }}
                    >
                      {jid}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedBookingForDetails(null)}
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
