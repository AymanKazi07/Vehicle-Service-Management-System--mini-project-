import React, { useState } from 'react';
import { adminApi } from '../api/adminApi';
import { CATEGORIES } from '../utils/constants';

export const MechanicForm = ({ workshops, onMechanicCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workshopId, setWorkshopId] = useState(workshops[0]?.id || '');
  const [selectedCategories, setSelectedCategories] = useState([CATEGORIES[0].value]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat)
        ? prev.filter((c) => c !== cat)
        : [...prev, cat]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError('Select at least one vehicle category for the mechanic.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await adminApi.createMechanic({
        name,
        email,
        password,
        workshopId: workshopId || workshops[0]?.id,
        categories: selectedCategories,
      });
      setName('');
      setEmail('');
      setPassword('');
      onMechanicCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create mechanic account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '1.5rem' }}>
      <h3 className="card-title">Add Mechanic Specialist</h3>
      {error && <div className="alert-box alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Vikram Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Login Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="vikram@workshop.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assigned Workshop</label>
          <select
            className="form-control"
            value={workshopId || workshops[0]?.id || ''}
            onChange={(e) => setWorkshopId(e.target.value)}
            required
          >
            {workshops.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" style={{ marginBottom: '0.5rem' }}>
          Vehicle Categories Handled
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat.value);
            return (
              <label
                key={cat.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.85rem',
                  background: isChecked ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isChecked ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(cat.value)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                {cat.label}
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Register Mechanic'}
        </button>
      </div>
    </form>
  );
};
