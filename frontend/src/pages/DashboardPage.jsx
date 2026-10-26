import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { VehicleCard } from '../components/VehicleCard';
import { AddVehicleForm } from '../components/AddVehicleForm';
import { ServiceHistoryList } from '../components/ServiceHistoryList';
import { BookingForm } from '../components/BookingForm';
import { BookingConfirmation } from '../components/BookingConfirmation';
import { BillView } from '../components/BillView';
import { vehicleApi } from '../api/vehicleApi';
import { catalogApi } from '../api/catalogApi';
import { billApi } from '../api/billApi';
import { useAuth } from '../context/AuthContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [history, setHistory] = useState([]);
  const [services, setServices] = useState([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [vehicleSearch, setVehicleSearch] = useState('');

  const loadVehicles = async () => {
    try {
      const data = await vehicleApi.getVehicles();
      setVehicles(data);
      if (data.length > 0 && !selectedVehicle) {
        setSelectedVehicle(data[0]);
      }
    } catch (err) {
      setError('Failed to load registered vehicles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // When selected vehicle changes, load its catalog services and service history
  useEffect(() => {
    if (!selectedVehicle) {
      setServices([]);
      setHistory([]);
      return;
    }

    const fetchVehicleData = async () => {
      try {
        const [historyData, catalogData] = await Promise.all([
          vehicleApi.getHistory(selectedVehicle.registrationNumber),
          catalogApi.getServices(selectedVehicle.category, selectedVehicle.subType),
        ]);
        setHistory(historyData);
        setServices(catalogData);
      } catch (err) {
        console.error('Failed to load vehicle history or services', err);
      }
    };

    fetchVehicleData();
  }, [selectedVehicle]);

  const handleVehicleAdded = async (vehicleData) => {
    const newVehicle = await vehicleApi.addVehicle(vehicleData);
    setShowAddVehicle(false);
    await loadVehicles();
    setSelectedVehicle(newVehicle);
  };

  const handleBookingSuccess = (response) => {
    setBookingResult(response);
    if (selectedVehicle) {
      vehicleApi.getHistory(selectedVehicle.registrationNumber).then(setHistory);
    }
  };

  const handleViewBill = async (bookingId) => {
    try {
      const billData = await billApi.getBill(bookingId);
      setBill(billData);
    } catch (err) {
      alert(err.response?.data?.message || 'Bill is not available yet.');
    }
  };

  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch) return vehicles;
    return vehicles.filter(
      (v) =>
        v.modelName?.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
        v.registrationNumber?.toLowerCase().includes(vehicleSearch.toLowerCase())
    );
  }, [vehicles, vehicleSearch]);

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        {/* Welcome & Stats Hero Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem 2.25rem',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#a5b4fc', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              <span>CUSTOMER PORTAL</span> • <span>GARAGE FLEET OVERVIEW</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Welcome back, {user?.name || 'Valued Customer'} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '650px', marginTop: '0.35rem' }}>
              Select an automobile below to configure multi-slot maintenance, inspect warranty work history, or view GST tax invoices.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Fleet Size</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                {vehicles.length}
              </span>
            </div>

            <button
              className="btn btn-primary btn-lg"
              onClick={() => setShowAddVehicle(!showAddVehicle)}
              style={{ gap: '0.5rem' }}
            >
              <span>{showAddVehicle ? '✕ Close Form' : '+ Register Vehicle'}</span>
            </button>
          </div>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        {/* Collapsible Register Vehicle Modal/Section */}
        {showAddVehicle && (
          <AddVehicleForm
            onVehicleAdded={handleVehicleAdded}
            onCancel={() => setShowAddVehicle(false)}
          />
        )}

        {/* Vehicles Selection Section */}
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Your Registered Fleet ({vehicles.length})
              </h2>
              <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Click any vehicle card to load its service catalog & maintenance timeline
              </span>
            </div>

            {vehicles.length > 3 && (
              <input
                type="text"
                className="form-control"
                placeholder="Filter by plate or model..."
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                style={{ maxWidth: '240px', padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              />
            )}
          </div>

          {vehicles.length === 0 && !loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚘</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                No Vehicles Registered
              </h3>
              <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                You have not registered any vehicles under your account yet. Add your first 2-wheeler, 4-wheeler, or heavy vehicle to begin.
              </p>
              <button className="btn btn-primary" onClick={() => setShowAddVehicle(true)}>
                + Register First Vehicle
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {filteredVehicles.map((v) => (
                <VehicleCard
                  key={v.registrationNumber}
                  vehicle={v}
                  isSelected={selectedVehicle?.registrationNumber === v.registrationNumber}
                  onSelect={setSelectedVehicle}
                />
              ))}
            </div>
          )}
        </section>

        {/* Dynamic Service Booking & History Section */}
        {selectedVehicle && (
          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* Left: Booking Form */}
            <div>
              <BookingForm
                selectedVehicle={selectedVehicle}
                services={services}
                onBookingSuccess={handleBookingSuccess}
              />
            </div>

            {/* Right: Service History Stack */}
            <div>
              <div className="card" style={{ minHeight: '400px' }}>
                <div className="card-title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Maintenance History (Stack)</span>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                      {history.length} records
                    </span>
                  </div>
                  <span style={{ fontSize: '0.825rem', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                    {selectedVehicle.registrationNumber}
                  </span>
                </div>

                <ServiceHistoryList
                  history={history}
                  vehicleRegNo={selectedVehicle.registrationNumber}
                  onViewBill={handleViewBill}
                />
              </div>
            </div>
          </div>
        )}

        {/* Booking Confirmation Modal */}
        {bookingResult && (
          <BookingConfirmation
            booking={bookingResult}
            onClose={() => setBookingResult(null)}
          />
        )}

        {/* Bill Modal */}
        {bill && (
          <BillView
            bill={bill}
            onClose={() => setBill(null)}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
