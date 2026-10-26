import React, { useState } from 'react';
import { adminApi } from '../api/adminApi';

export const WorkshopForm = ({ onWorkshopCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminApi.createWorkshop({
        name: name.trim(),
        address: address.trim(),
        contact: contact.trim(),
      });
      setName('');
      setAddress('');
      setContact('');
      onWorkshopCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workshop facility.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', border: '1px solid var(--border-highlight)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Infrastructure Configuration
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
            Register New Workshop Facility
          </h3>
        </div>
        {onCancel && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
            ✕ Close
          </button>
        )}
      </div>

      {error && (
        <div className="alert-box alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label">Workshop Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Apex SpeedWorks North Hub"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contact Phone Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. +91 98200 44556"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
          <label className="form-label">Physical Address & Location Landmark</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Plot 104, Industrial Area Phase II, Electronic City, Bengaluru 560100"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Facility...' : 'Register Workshop Facility'}
        </button>
      </div>
    </form>
  );
};

export default WorkshopForm;
