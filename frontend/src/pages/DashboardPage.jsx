import React, { useState, useEffect } from 'react';
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

export const DashboardPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [history, setHistory] = useState([]);
  const [services, setServices] = useState([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    // Reload history
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

  return (
    <div className="app-layout">
      <Navbar />

      <main className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Customer Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Manage your vehicles, inspect maintenance history stacks, and book multi-slot services.
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddVehicle(!showAddVehicle)}
          >
            {showAddVehicle ? 'Close Form' : '+ Add Vehicle'}
          </button>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}

        {showAddVehicle && (
          <AddVehicleForm
            onVehicleAdded={handleVehicleAdded}
            onCancel={() => setShowAddVehicle(false)}
          />
        )}

        {/* Vehicles Section */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            Your Registered Vehicles ({vehicles.length})
          </h2>

          {vehicles.length === 0 && !loading ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No vehicles registered under your account. Click "+ Add Vehicle" to register one.
            </div>
          ) : (
            <div className="grid-3">
              {vehicles.map((v) => (
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

        {selectedVehicle && (
          <div className="grid-2" style={{ alignItems: 'start' }}>
            {/* Booking Form */}
            <div>
              <BookingForm
                selectedVehicle={selectedVehicle}
                services={services}
                onBookingSuccess={handleBookingSuccess}
              />
            </div>

            {/* Service History Stack */}
            <div>
              <div className="card">
                <div className="card-title">
                  <span>Maintenance History (Stack)</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
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
