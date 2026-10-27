import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { SignupForm } from '../components/SignupForm';

export const AuthPage = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', marginBottom: '1rem' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.1 2 11.3V16c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <path d="M9 17h6"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            AutoServe System
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Vehicle Service Booking & Precision Maintenance Tracking
          </p>
        </div>

        <div className="auth-tabs">
          <div
            className={`auth-tab ${isLoginTab ? 'active' : ''}`}
            onClick={() => setIsLoginTab(true)}
          >
            Sign In
          </div>
          <div
            className={`auth-tab ${!isLoginTab ? 'active' : ''}`}
            onClick={() => setIsLoginTab(false)}
          >
            Create Customer Account
          </div>
        </div>

        {isLoginTab ? <LoginForm /> : <SignupForm />}

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>Default Admin: <code>admin@vehicleservice.com</code> / <code>admin123</code></div>
          <div style={{ marginTop: '0.25rem' }}>Default Mechanics: <code>rajesh@vehicleservice.com</code> / <code>amit@vehicleservice.com</code> (pass: <code>mech123</code>)</div>
        </div>
      </div>
    </div>
  );
};
