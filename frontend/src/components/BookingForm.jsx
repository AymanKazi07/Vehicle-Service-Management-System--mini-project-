import React, { useState } from 'react';
import { ServicePicker } from './ServicePicker';
import { bookingApi } from '../api/bookingApi';
import { formatCurrency, formatDuration } from '../utils/formatters';

export const BookingForm = ({ selectedVehicle, services, onBookingSuccess }) => {
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!selectedVehicle) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚗</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          No Vehicle Selected
        </h3>
        <p style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
          Select one of your registered vehicles above, or click <strong>"+ Add Vehicle"</strong> to register a new automobile into the system.
        </p>
      </div>
    );
  }

  const handleToggleService = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const selectedServices = services.filter((s) => selectedServiceIds.includes(s.id));
  const subtotalEstimate = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalMinutes = selectedServices.reduce((sum, s) => sum + s.expectedMinutes, 0);
  const gstEstimate = subtotalEstimate * 0.18;
  const grandTotalEstimate = subtotalEstimate + gstEstimate;

  const setRelativeDate = (daysAhead) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setBookingDate(d.toISOString().split('T')[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedServiceIds.length === 0) {
      setError('Please select at least one service item to proceed with booking.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await bookingApi.createBooking({
        vehicleRegNo: selectedVehicle.registrationNumber,
        date: bookingDate,
        serviceItemIds: selectedServiceIds,
      });
      setSelectedServiceIds([]);
      onBookingSuccess(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. All slots for selected date might be booked.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Multi-Slot Booking Engine
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '0.2rem' }}>
            Schedule Service for {selectedVehicle.modelName}
          </h3>
        </div>
        <div style={{
          padding: '0.3rem 0.75rem',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: 'var(--accent)',
          fontSize: '0.85rem'
        }}>
          {selectedVehicle.registrationNumber}
        </div>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      {/* Date Picker with Quick Date Pills */}
      <div className="form-group">
        <label className="form-label">Step 1: Choose Appointment Date</label>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="date"
            className="form-control"
            style={{ maxWidth: '240px' }}
            value={bookingDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setBookingDate(e.target.value)}
            required
          />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setRelativeDate(1)}
            >
              Tomorrow
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setRelativeDate(2)}
            >
              In 2 Days
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setRelativeDate(3)}
            >
              In 3 Days
            </button>
          </div>
        </div>
      </div>

      {/* Service Catalog Picker */}
      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <label className="form-label" style={{ margin: 0 }}>
            Step 2: Select Services ({selectedVehicle.category?.replace('_', ' ')} • {selectedVehicle.subType})
          </label>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {selectedServiceIds.length} services selected
          </span>
        </div>

        <ServicePicker
          services={services}
          selectedServiceIds={selectedServiceIds}
          onToggleService={handleToggleService}
        />
      </div>

      {/* Step 3: Interactive Cost & Turnaround Summary */}
      {selectedServices.length > 0 ? (
        <div style={{
          background: 'linear-gradient(145deg, rgba(13, 19, 31, 0.95), rgba(22, 34, 53, 0.95))',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
          marginTop: '1.5rem',
          boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Step 3: Appointment Summary ({selectedServices.length} items)
            </span>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>
              ⏱️ Total Service Time: ~{formatDuration(totalMinutes)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            {selectedServices.map((s) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  <span className={`queue-badge ${s.queueClass === 'SHORT' ? 'queue-short' : 'queue-long'}`} style={{ fontSize: '0.65rem' }}>
                    {s.queueClass}
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatCurrency(s.price)}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Subtotal: {formatCurrency(subtotalEstimate)} + 18% GST: {formatCurrency(gstEstimate)}
              </div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Total: <span style={{ color: 'var(--primary-light)' }}>{formatCurrency(grandTotalEstimate)}</span>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <>
                  <span className="pulse-dot" style={{ backgroundColor: 'white' }}></span>
                  <span>Allocating Slots & Mechanics...</span>
                </>
              ) : (
                <>
                  <span>Confirm Appointment Booking</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '1.5rem', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Select one or more services above to view automated slot allocation and cost breakdown.
        </div>
      )}
    </form>
  );
};

export default BookingForm;
