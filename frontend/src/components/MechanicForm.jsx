import React, { useState } from 'react';
import { adminApi } from '../api/adminApi';
import { CATEGORIES } from '../utils/constants';

export const MechanicForm = ({ workshops, onMechanicCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [workshopId, setWorkshopId] = useState(workshops[0]?.id || '');
  const [selectedCategories, setSelectedCategories] = useState([CATEGORIES[0].value, CATEGORIES[2].value]);
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
      setError('Please select at least one vehicle category for this mechanic.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await adminApi.createMechanic({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        workshopId: workshopId || workshops[0]?.id,
        categories: selectedCategories,
      });
      setName('');
      setEmail('');
      setPassword('');
      onMechanicCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create mechanic credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: '2rem', border: '1px solid var(--border-highlight)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Workforce Onboarding
          </span>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
            Register Certified Mechanic Specialist
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
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
          <label className="form-label">Login Email ID</label>
          <input
            type="email"
            className="form-control"
            placeholder="vikram@speedworks.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Account Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Assigned Workshop Hub</label>
          <select
            className="form-control"
            value={workshopId || workshops[0]?.id || ''}
            onChange={(e) => setWorkshopId(e.target.value)}
            required
          >
            {workshops.map((w) => (
              <option key={w.id} value={w.id}>{w.name} ({w.id})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Vehicle Categories Handled */}
      <div className="form-group">
        <label className="form-label" style={{ marginBottom: '0.65rem' }}>
          Certified Vehicle Categories Handled
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
          {CATEGORIES.map((cat) => {
            const isChecked = selectedCategories.includes(cat.value);
            return (
              <div
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  padding: '0.55rem 1rem',
                  background: isChecked ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${isChecked ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: isChecked ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.18s ease',
                }}
              >
                <span style={{ color: isChecked ? 'var(--primary-light)' : 'var(--text-muted)' }}>
                  {isChecked ? '✓' : '+'}
                </span>
                <span>{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Credentials...' : 'Register Specialist Mechanic'}
        </button>
      </div>
    </form>
  );
};

export default MechanicForm;
