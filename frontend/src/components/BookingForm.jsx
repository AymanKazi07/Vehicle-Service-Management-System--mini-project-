import React, { useState } from 'react';
import { ServicePicker } from './ServicePicker';
import { bookingApi } from '../api/bookingApi';
import { formatCurrency } from '../utils/formatters';

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
      <div className="card" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
        Please select a vehicle above to book a service appointment.
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
  const gstEstimate = subtotalEstimate * 0.18;
  const grandTotalEstimate = subtotalEstimate + gstEstimate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedServiceIds.length === 0) {
      setError('Please select at least one service to proceed with booking.');
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
      setError(err.response?.data?.message || 'Booking failed. Please try another date or service.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <h3 className="card-title">Book Service Appointment for {selectedVehicle.registrationNumber}</h3>
      {error && <div className="alert-box alert-error">{error}</div>}

      <div className="form-group" style={{ maxWidth: '300px' }}>
        <label className="form-label">Preferred Appointment Date</label>
        <input
          type="date"
          className="form-control"
          value={bookingDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setBookingDate(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ marginBottom: '0.75rem' }}>
          Select Services ({selectedVehicle.category?.replace('_', ' ')} - {selectedVehicle.subType})
        </label>
        <ServicePicker
          services={services}
          selectedServiceIds={selectedServiceIds}
          onToggleService={handleToggleService}
        />
      </div>

      {selectedServices.length > 0 && (
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          margin: '1.25rem 0',
        }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Selected Services Summary ({selectedServices.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
            {selectedServices.map((s) => (
              <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>{s.name} ({s.queueClass})</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{formatCurrency(s.price)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Subtotal: {formatCurrency(subtotalEstimate)} + 18% GST: {formatCurrency(gstEstimate)}</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Estimated Total: {formatCurrency(grandTotalEstimate)}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Allocating Slots...' : 'Confirm Appointment Booking'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
