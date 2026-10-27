import React from 'react';

export const VehicleCard = ({ vehicle, isSelected, onSelect }) => {
  return (
    <div
      className={`card card-interactive ${isSelected ? 'selected-card' : ''}`}
      onClick={() => onSelect(vehicle)}
      style={{
        cursor: 'pointer',
        borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
        background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {vehicle.category?.replace('_', ' ')} • {vehicle.subType}
          </span>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.2rem', color: 'var(--text-primary)' }}>
            {vehicle.modelName}
          </h3>
        </div>
        <div style={{
          padding: '0.35rem 0.75rem',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          fontSize: '0.9rem',
          color: 'var(--accent)',
          letterSpacing: '0.05em'
        }}>
          {vehicle.registrationNumber}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
        <span>Owner: {vehicle.ownerName}</span>
        <span style={{ color: 'var(--primary)', fontWeight: 600 }}>
          {isSelected ? '✓ Selected' : 'Click to select'}
        </span>
      </div>
    </div>
  );
};
