import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { SignupForm } from '../components/SignupForm';

export const AuthPage = () => {
  const [isLoginTab, setIsLoginTab] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-split-wrapper">
        {/* Left Hero Brand Showcase Panel */}
        <div className="auth-hero-panel">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.35)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', marginBottom: '1.75rem' }}>
              <span className="pulse-dot"></span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Next-Gen Automotive Management
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
              Precision Service <br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Engineering & Tracking
              </span>
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
              Streamline multi-slot service appointments, automated mechanic dispatching, and GST compliance with an enterprise-grade digital workshop engine.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>
                  ⚡
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Intelligent Queue Routing</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Adaptive short (&le;2h) and long queue pipelining for maximum shop throughput.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.2)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#22d3ee', flexShrink: 0 }}>
                  🔧
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Category-Certified Technicians</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>2-Wheeler, 4-Wheeler & Heavy Vehicle specialists allocated to precise job items.</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', flexShrink: 0 }}>
                  🧾
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Instant Tax Invoicing & History Stack</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Automated GST itemization, work done records, and printable billing receipts.</p>
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>AutoServe v2.4 Enterprise</span>
            <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>● 99.98% System Uptime</span>
          </div>
        </div>

        {/* Right Auth Form Panel */}
        <div className="auth-box">
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isLoginTab ? 'Welcome Back' : 'Create Customer Account'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {isLoginTab
                ? 'Sign in to access your registered fleet, bookings, and service bills.'
                : 'Register your account to manage your vehicles and schedule service slots.'}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${isLoginTab ? 'active' : ''}`}
              onClick={() => setIsLoginTab(true)}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${!isLoginTab ? 'active' : ''}`}
              onClick={() => setIsLoginTab(false)}
            >
              New Customer
            </button>
          </div>

          {isLoginTab ? <LoginForm /> : <SignupForm />}

          <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Need help? Contact <span style={{ color: 'var(--primary-light)' }}>support@autoserve.com</span> • Secure 256-bit SSL
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
