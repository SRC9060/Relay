import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  User,
  LogOut,
  ChevronDown,
  RotateCw,
  Search,
  ExternalLink,
  SlidersHorizontal,
  Mail
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAccounts } from '../../../context/AccountContext';
import Button from '../../../components/common/Button';

export default function ClientTopBar({ searchQuery, onSearchChange, onAccountChange, selectedAccountId }) {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const { accounts, isSyncing, syncAll, lastSyncTime } = useAccounts();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getSyncText = () => {
    if (isSyncing) return 'Syncing...';
    const seconds = Math.floor((new Date() - lastSyncTime) / 1000);
    if (seconds < 60) return 'Synced just now';
    const minutes = Math.floor(seconds / 60);
    return `Synced ${minutes}m ago`;
  };

  const handleSwitchToAssistant = async () => {
    await switchRole('assistant');
    navigate('/app/overview');
  };

  return (
    <header
      style={{
        height: '62px',
        backgroundColor: 'var(--color-surface)',
        borderBottom: 'var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        gap: '16px'
      }}
    >
      {/* Brand & Client Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '-0.02em'
            }}
          >
            R
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '15px',
              color: 'var(--color-charcoal)',
              letterSpacing: '-0.02em'
            }}
          >
            Relay
          </span>
        </div>

        <div
          style={{
            height: '16px',
            width: '1px',
            backgroundColor: 'rgba(41, 43, 41, 0.12)'
          }}
          className="desktop-only"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-only">
          <span
            style={{
              padding: '3px 8px',
              backgroundColor: 'var(--color-resp-client-bg)',
              color: 'var(--color-resp-client)',
              border: '1px solid var(--color-resp-client-border)',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.02em'
            }}
          >
            Executive Decision Desk
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)' }}>
            Marcus Vance
          </span>
        </div>
      </div>

      {/* Global Filter & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '460px', minWidth: 0 }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              color: 'var(--color-charcoal-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            placeholder="Search approvals, decisions, contacts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 12px 6px 32px',
              fontSize: '12.5px',
              backgroundColor: 'var(--color-surface-subtle)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-charcoal)',
              outline: 'none',
              transition: 'all var(--transition-fast)'
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = 'var(--color-surface)';
              e.target.style.borderColor = 'var(--color-primary)';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = 'var(--color-surface-subtle)';
              e.target.style.borderColor = 'rgba(41, 43, 41, 0.09)';
            }}
          />
        </div>

        {/* Account Selector */}
        <div style={{ position: 'relative' }} className="desktop-only">
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountChange(e.target.value)}
            style={{
              appearance: 'none',
              padding: '6px 26px 6px 10px',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-charcoal)',
              backgroundColor: 'var(--color-surface)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              outline: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            <option value="all">All Accounts ({accounts.length})</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={13}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: 'var(--color-charcoal-muted)'
            }}
          />
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Sync Pill */}
        <button
          onClick={syncAll}
          disabled={isSyncing}
          title="Simulated account sync"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            backgroundColor: 'var(--color-surface-subtle)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--color-charcoal-muted)',
            cursor: isSyncing ? 'not-allowed' : 'pointer'
          }}
          className="desktop-only"
        >
          <RotateCw
            size={11}
            style={{
              animation: isSyncing ? 'spin 1s linear infinite' : 'none',
              color: isSyncing ? 'var(--color-primary)' : 'inherit'
            }}
          />
          <span className="tabular-nums">{getSyncText()}</span>
        </button>

        {/* Switch to Assistant View */}
        <Button
          variant="secondary"
          size="sm"
          icon={ExternalLink}
          iconPosition="right"
          onClick={handleSwitchToAssistant}
          title="Open Elena Rostova's full executive assistant workspace"
        >
          Assistant Workspace
        </Button>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 6px 3px 3px',
              borderRadius: 'var(--radius-md)',
              border: 'var(--border-subtle)',
              backgroundColor: 'var(--color-surface)',
              cursor: 'pointer'
            }}
            aria-label="User profile menu"
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-resp-client)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              MV
            </div>
            <div style={{ textAlign: 'left' }} className="desktop-only">
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                Marcus Vance
              </div>
            </div>
            <ChevronDown size={13} color="var(--color-charcoal-muted)" />
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '40px',
                width: '240px',
                backgroundColor: 'var(--color-surface)',
                border: 'var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-dropdown)',
                padding: '8px',
                zIndex: 100
              }}
            >
              <div style={{ padding: '8px 10px', borderBottom: 'var(--border-subtle)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600 }}>Marcus Vance</div>
                <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                  Founder & Managing Partner
                </div>
                <div style={{ fontSize: '10px', color: 'var(--color-charcoal-light)', marginTop: '2px' }}>
                  marcus.vance@vancetech.io
                </div>
              </div>

              <div style={{ padding: '6px 0' }}>
                <div
                  style={{
                    padding: '4px 10px',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'var(--color-charcoal-muted)'
                  }}
                >
                  Switch demo persona
                </div>
                <button
                  onClick={async () => {
                    await switchRole('assistant');
                    setShowProfileMenu(false);
                    navigate('/app/overview');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-charcoal)',
                    textAlign: 'left'
                  }}
                >
                  <Shield size={14} color="var(--color-primary)" />
                  Elena Rostova (Assistant)
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-resp-client)',
                    fontWeight: 600,
                    textAlign: 'left'
                  }}
                >
                  <User size={14} color="var(--color-resp-client)" />
                  Marcus Vance (Client)
                </button>
              </div>

              <div style={{ borderTop: 'var(--border-subtle)', paddingTop: '6px' }}>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                    navigate('/login');
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    color: 'var(--color-danger)',
                    borderRadius: 'var(--radius-sm)',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
