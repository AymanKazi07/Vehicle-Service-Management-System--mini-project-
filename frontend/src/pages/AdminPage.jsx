import React, { useState, useEffect } from 'react';
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

  const workshopColumns = [
    { header: 'ID', accessor: 'id', width: '120px' },
    { header: 'Workshop Name', accessor: 'name' },
    { header: 'Address', accessor: 'address' },
    { header: 'Contact', accessor: 'contact' },
  ];

  const mechanicColumns = [
    { header: 'ID', accessor: 'id', width: '120px' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    {
      header: 'Workshop',
      render: (m) => {
        const ws = workshops.find((w) => w.id === m.workshopId);
        return ws ? ws.name : m.workshopId;
      },
    },
    {
      header: 'Categories',
      render: (m) => (
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {m.categories?.map((c) => (
            <span key={c} style={{
              fontSize: '0.7rem',
              padding: '0.15rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              fontWeight: 600,
            }}>
              {c.replace('_', ' ')}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const bookingColumns = [
    { header: 'Booking ID', accessor: 'bookingId', width: '130px' },
    { header: 'Customer ID', accessor: 'customerId' },
    {
      header: 'Vehicle',
      render: (b) => (
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent)' }}>
          {b.vehicleRegNo}
        </span>
      ),
    },
    {
      header: 'Scheduled Date',
      render: (b) => formatDate(b.date),
    },
    {
      header: 'Jobs Count',
      render: (b) => b.jobIds?.length || 0,
    },
    {
      header: 'Est. Completion',
      render: (b) => b.overallEnd || 'N/A',
    },
  ];

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Admin Operations Console</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Manage workshops, mechanic credentials, vehicle categories, and view all system bookings.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => { setShowAddWorkshop(!showAddWorkshop); setShowAddMechanic(false); }}
            >
              {showAddWorkshop ? 'Close Workshop Form' : '+ New Workshop'}
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => { setShowAddMechanic(!showAddMechanic); setShowAddWorkshop(false); }}
            >
              {showAddMechanic ? 'Close Mechanic Form' : '+ New Mechanic'}
            </button>
          </div>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        {showAddWorkshop && (
          <WorkshopForm
            onWorkshopCreated={() => {
              setShowAddWorkshop(false);
              loadData();
            }}
          />
        )}

        {showAddMechanic && (
          <MechanicForm
            workshops={workshops}
            onMechanicCreated={() => {
              setShowAddMechanic(false);
              loadData();
            }}
          />
        )}

        <div className="auth-tabs" style={{ marginBottom: '1.5rem' }}>
          <div
            className={`auth-tab ${activeTab === 'workshops' ? 'active' : ''}`}
            onClick={() => setActiveTab('workshops')}
          >
            Workshops ({workshops.length})
          </div>
          <div
            className={`auth-tab ${activeTab === 'mechanics' ? 'active' : ''}`}
            onClick={() => setActiveTab('mechanics')}
          >
            Mechanics ({mechanics.length})
          </div>
          <div
            className={`auth-tab ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            All Bookings ({bookings.length})
          </div>
        </div>

        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading database collections...
          </div>
        ) : (
          <div>
            {activeTab === 'workshops' && (
              <DataTable columns={workshopColumns} data={workshops} emptyMessage="No workshops registered." />
            )}
            {activeTab === 'mechanics' && (
              <DataTable columns={mechanicColumns} data={mechanics} emptyMessage="No mechanics registered." />
            )}
            {activeTab === 'bookings' && (
              <DataTable columns={bookingColumns} data={bookings} emptyMessage="No customer bookings made yet." />
            )}
          </div>
        )}
      </main>
    </div>
  );
};
