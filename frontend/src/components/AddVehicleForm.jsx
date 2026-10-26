import React, { useState } from 'react';
import { CATEGORIES, SUB_TYPES } from '../utils/constants';

export const AddVehicleForm = ({ onVehicleAdded, onCancel }) => {
  const [regNo, setRegNo] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [modelName, setModelName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [subType, setSubType] = useState(SUB_TYPES[CATEGORIES[0].value][0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    setSubType(SUB_TYPES[selectedCat][0] || 'DEFAULT');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onVehicleAdded({
        registrationNumber: regNo.toUpperCase().trim(),
        ownerName: ownerName.trim(),
        modelName: modelName.trim(),
        category,
        subType,
      });
      setRegNo('');
      setModelName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle. Registration number might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', border: '1px solid var(--border-highlight)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            New Asset Registration
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
            Register Vehicle in Garage
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

      {/* Visual Category Selector Cards */}
      <div className="form-group">
        <label className="form-label">Vehicle Category</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
          {CATEGORIES.map((c) => {
            const isCatActive = category === c.value;
            return (
              <div
                key={c.value}
                onClick={() => handleCategorySelect(c.value)}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: isCatActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1.5px solid ${isCatActive ? 'var(--primary)' : 'var(--border-color)'}`,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>
                  {c.value === 'TWO_WHEELER' ? '🏍️' : c.value === 'THREE_WHEELER' ? '🛺' : c.value === 'HEAVY' ? '🚛' : '🚗'}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isCatActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {c.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inputs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label">License Plate / Registration No.</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. MH12AB1234"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value.toUpperCase())}
            style={{ textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: 700 }}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Model Name & Trim</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Honda City ZX / Pulsar 220F"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Owner Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Aarav Sharma"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Engine / Fuel Sub-Type</label>
          <select className="form-control" value={subType} onChange={(e) => setSubType(e.target.value)}>
            {SUB_TYPES[category]?.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Registering Vehicle...' : 'Save & Register Vehicle'}
        </button>
      </div>
    </form>
  );
};

export default AddVehicleForm;
