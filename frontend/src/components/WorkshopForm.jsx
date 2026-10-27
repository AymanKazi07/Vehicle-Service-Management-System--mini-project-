import React, { useState } from 'react';
import { adminApi } from '../api/adminApi';

export const WorkshopForm = ({ onWorkshopCreated }) => {
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
      await adminApi.createWorkshop({ name, address, contact });
      setName('');
      setAddress('');
      setContact('');
      onWorkshopCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create workshop');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
      <h3 className="card-title">Add Service Workshop</h3>
      {error && <div className="alert-box alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Workshop Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. North Side Service Hub"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Contact Phone</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. +91 9876543210"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ gridColumn: 'span 2' }}>
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 104 Industrial Area, Phase 1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Register Workshop'}
        </button>
      </div>
    </form>
  );
};
