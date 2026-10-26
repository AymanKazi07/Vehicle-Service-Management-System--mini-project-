import React from 'react';
import { formatDate } from '../utils/formatters';

export const VehicleCard = ({ vehicle, isSelected, onSelect }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'TWO_WHEELER':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="16" r="3"/><circle cx="19" cy="16" r="3"/><path d="M12 17h4.5l2-6H15l-3-4H8l2 5H5.5"/>
          </svg>
        );
      case 'THREE_WHEELER':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M9 17h6M12 12V6M9 6h6"/>
          </svg>
        );
      case 'HEAVY':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        );
      case 'FOUR_WHEELER':
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.1 2 11.3V16c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>
          </svg>
        );
    }
  };

  const getSubtypeColor = (subType) => {
    if (!subType) return 'var(--text-muted)';
    const s = subType.toUpperCase();
    if (s.includes('EV')) return '#34d399';
    if (s.includes('CNG')) return '#38bdf8';
    if (s.includes('DIESEL')) return '#fbbf24';
    return '#a5b4fc';
  };

  return (
    <div
      className={`card card-interactive ${isSelected ? 'selected-card' : ''}`}
      onClick={() => onSelect(vehicle)}
      style={{
        cursor: 'pointer',
        padding: '1.4rem',
        position: 'relative',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
            border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-color)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSelected ? 'var(--primary-light)' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}>
            {getCategoryIcon(vehicle.category)}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {vehicle.category?.replace('_', ' ')}
              </span>
              <span style={{
                fontSize: '0.675rem',
                fontWeight: 700,
                color: getSubtypeColor(vehicle.subType),
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '0.1rem 0.45rem',
                borderRadius: 'var(--radius-sm)',
              }}>
                {vehicle.subType}
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {vehicle.modelName}
            </h3>
          </div>
        </div>

        {/* License Plate Graphic */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#090d16',
          border: '1.5px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.5)',
        }}>
          <div style={{
            background: '#1e3a8a',
            color: 'white',
            fontSize: '0.6rem',
            fontWeight: 800,
            padding: '0.35rem 0.3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            letterSpacing: '0.05em'
          }}>
            <span>IND</span>
          </div>
          <div style={{
            padding: '0.3rem 0.65rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: '#38bdf8',
            letterSpacing: '0.07em',
          }}>
            {vehicle.registrationNumber}
          </div>
        </div>
      </div>

      {/* Metadata & Status */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-color)',
        fontSize: '0.8rem',
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>
          <span>Owner: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{vehicle.ownerName}</strong>
        </div>

        <div>
          {isSelected ? (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: '#818cf8',
              fontWeight: 700,
              fontSize: '0.8rem',
              background: 'rgba(99, 102, 241, 0.15)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)'
            }}>
              <span>✓ Active Selection</span>
            </span>
          ) : (
            <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
              Click to select
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
