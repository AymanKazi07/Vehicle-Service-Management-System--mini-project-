import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, role, logout, login } = useAuth();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleQuickSwitch = async (targetRole) => {
    setShowRoleMenu(false);
    try {
      if (targetRole === 'CUSTOMER') {
        await login('customer@test.com', 'password123');
        navigate('/dashboard');
      } else if (targetRole === 'MECHANIC') {
        await login('mechanic@test.com', 'password123');
        navigate('/mechanic');
      } else if (targetRole === 'ADMIN') {
        await login('admin@test.com', 'password123');
        navigate('/admin');
      }
    } catch (err) {
      console.error('Failed to quick-switch role', err);
    }
  };

  const getPortalTitle = () => {
    if (role === 'ADMIN') return 'Operations Console';
    if (role === 'MECHANIC') return 'Workshop Console';
    return 'Customer Hub';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="nav-brand-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.1 2 11.3V16c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <div>
            <span>AutoServe</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginLeft: '0.4rem' }}>
              / {getPortalTitle()}
            </span>
          </div>
        </div>

        <div className="brand-badge">
          {role || 'GUEST'}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div className="nav-center-status" title="System Connected & Real-time Slots Active">
          <span className="pulse-dot"></span>
          <span>System Live</span>
        </div>

        {user && (
          <div className="nav-user">
            {/* Quick Role Switcher for seamless paired testing */}
            <div style={{ position: 'relative' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                style={{ fontSize: '0.75rem', gap: '0.35rem' }}
                title="Switch Active Persona"
              >
                <span>⚡ Switch Role</span>
                <span style={{ fontSize: '0.65rem' }}>▼</span>
              </button>

              {showRoleMenu && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  width: '210px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.4rem',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{ padding: '0.4rem 0.6rem', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Instant Persona Switch
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ justifyContent: 'flex-start', padding: '0.45rem 0.65rem', border: 'none', textAlign: 'left' }}
                    onClick={() => handleQuickSwitch('CUSTOMER')}
                  >
                    👤 Customer (Aarav)
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ justifyContent: 'flex-start', padding: '0.45rem 0.65rem', border: 'none', textAlign: 'left' }}
                    onClick={() => handleQuickSwitch('MECHANIC')}
                  >
                    🔧 Mechanic (Rajesh)
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ justifyContent: 'flex-start', padding: '0.45rem 0.65rem', border: 'none', textAlign: 'left' }}
                    onClick={() => handleQuickSwitch('ADMIN')}
                  >
                    🛡️ Admin (Vikram)
                  </button>
                </div>
              )}
            </div>

            <div className="nav-user-avatar" title={user.email}>
              {getInitials(user.name)}
            </div>

            <div className="nav-user-info">
              <span className="nav-user-name">{user.name || 'User'}</span>
              <span className="nav-user-role">{user.email || role}</span>
            </div>

            <button
              className="btn btn-outline btn-sm"
              onClick={handleLogout}
              style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.25)' }}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
