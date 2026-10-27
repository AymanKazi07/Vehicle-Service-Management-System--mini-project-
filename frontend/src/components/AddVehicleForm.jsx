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

  const handleCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setCategory(selectedCat);
    setSubType(SUB_TYPES[selectedCat][0] || 'DEFAULT');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onVehicleAdded({
        registrationNumber: regNo.toUpperCase(),
        ownerName,
        modelName,
        category,
        subType,
      });
      setRegNo('');
      setModelName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
      <h3 className="card-title">Register New Vehicle</h3>
      {error && <div className="alert-box alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Registration Number</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. MH12AB1234"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Owner Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. John Doe"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Model Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Pulsar 150 / Honda City"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Vehicle Category</label>
          <select className="form-control" value={category} onChange={handleCategoryChange}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Sub-Type</label>
          <select className="form-control" value={subType} onChange={(e) => setSubType(e.target.value)}>
            {SUB_TYPES[category]?.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding Vehicle...' : 'Save Vehicle'}
        </button>
      </div>
    </form>
  );
};
