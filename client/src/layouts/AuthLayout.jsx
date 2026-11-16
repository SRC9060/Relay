import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  const location = useLocation();
  const isSplitLayout = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 20px',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      {/* Top Header */}
      <header
        className="relay-auth-header"
        style={{
          maxWidth: isSplitLayout ? '1140px' : '640px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
          boxSizing: 'border-box'
        }}
      >
        <div
          className="relay-brand-container"
          role="presentation"
          tabIndex={-1}
          aria-hidden="true"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
        >
          <div
            className="brand-icon-box relay-brand-mark"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '-0.02em'
            }}
          >
            R
          </div>
          <div>
            <span
              className="relay-brand-wordmark"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--color-charcoal)',
                letterSpacing: '-0.02em'
              }}
            >
              Relay
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link
            to="/"
            className="relay-auth-back-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--color-charcoal-muted)',
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: 'var(--radius-sm)',
              transition: 'color var(--transition-fast), background-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-primary)';
              e.currentTarget.style.backgroundColor = 'var(--color-sage)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-charcoal-muted)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>Back to Homepage</span>
          </Link>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              backgroundColor: 'var(--color-surface)',
              border: 'var(--border-subtle)',
              color: 'var(--color-primary)',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            <ShieldCheck size={13} color="var(--color-primary)" />
            Prototype Demo Environment
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 0',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: isSplitLayout ? '1140px' : '520px',
            minWidth: 0,
            boxSizing: 'border-box'
          }}
          className="relay-auth-container"
        >
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relay-auth-footer"
        style={{
          maxWidth: isSplitLayout ? '1140px' : '640px',
          width: '100%',
          margin: '0 auto',
          paddingTop: '20px',
          fontSize: '11.5px',
          color: 'var(--color-charcoal-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          boxSizing: 'border-box'
        }}
      >
        <span>© 2026 Relay. All rights reserved.</span>
        <span>
          Human-reviewed AI triage • Dual-workspace synchronization
        </span>
      </footer>
    </div>
  );
}
