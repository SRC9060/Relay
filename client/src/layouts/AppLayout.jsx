import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import TopNav from '../components/navigation/TopNav';
import ErrorBoundary from '../components/common/ErrorBoundary';

export default function AppLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isInboxWorkspace =
    location.pathname.startsWith('/app/inbox') ||
    location.pathname.startsWith('/app/action-required') ||
    location.pathname.startsWith('/app/assistant-reply') ||
    location.pathname.startsWith('/app/client-reply') ||
    location.pathname.startsWith('/app/no-reply') ||
    location.pathname.startsWith('/app/waiting') ||
    location.pathname.startsWith('/app/meetings') ||
    location.pathname.startsWith('/app/important') ||
    location.pathname.startsWith('/app/archive');

  return (
    <div
      style={{
        display: 'flex',
        height: isInboxWorkspace ? '100vh' : 'auto',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        overflow: isInboxWorkspace ? 'hidden' : 'visible'
      }}
    >
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="sidebar-backdrop mobile-only"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar for Desktop & Collapsible for Mobile */}
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Pane */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          height: isInboxWorkspace ? '100vh' : 'auto',
          overflow: 'hidden'
        }}
      >
        <TopNav onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main
          className={`relay-app-main ${isInboxWorkspace ? 'inbox-workspace-mode' : ''}`}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            overflowY: isInboxWorkspace ? 'hidden' : 'auto',
            padding: isInboxWorkspace ? '0' : '24px',
            maxWidth: isInboxWorkspace ? '100%' : '1440px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box'
          }}
        >
          <ErrorBoundary
            title="Unable to load this section"
            onBack={() => navigate('/app/overview')}
          >
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
