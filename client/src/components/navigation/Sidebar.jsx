import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  AlertCircle,
  UserCheck,
  UserRound,
  CheckCircle2,
  Clock,
  Calendar,
  Star,
  Archive,
  Sparkles,
  Link2,
  Settings,
  ShieldCheck,
  X
} from 'lucide-react';
import Badge from '../common/Badge';
import { useConversations } from '../../context/ConversationContext';

export default function Sidebar({ isOpen, onClose }) {
  let counts = null;
  try {
    const convContext = useConversations();
    counts = convContext.counts;
  } catch (e) {
    // context optional for standalone preview
  }

  const navSections = [
    {
      group: 'Primary',
      items: [
        { path: '/app/overview', label: 'Overview', icon: LayoutDashboard },
        { path: '/app/inbox', label: 'Inbox', icon: Inbox, count: counts?.all ?? 17 },
        { path: '/app/action-required', label: 'Needs Attention', icon: AlertCircle, count: counts?.actionRequired ?? 11, highlight: true },
        { path: '/app/waiting', label: 'Waiting', icon: Clock, count: counts?.waiting ?? 1 },
        { path: '/app/meetings', label: 'Meetings', icon: Calendar, count: counts?.meetings ?? 4 },
        { path: '/app/important', label: 'Important', icon: Star, count: counts?.important ?? 8 }
      ]
    },
    {
      group: 'Workspace tools',
      items: [
        { path: '/app/ai-assistant', label: 'AI Assistant', icon: Sparkles, tag: 'AI' },
        { path: '/app/archive', label: 'Archived', icon: Archive, count: counts?.archive ?? 1 },
        { path: '/app/accounts', label: 'Connected Accounts', icon: Link2 },
        { path: '/app/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      className={`relay-sidebar ${isOpen ? 'open' : ''}`}
      style={{
        width: '260px',
        height: '100vh',
        backgroundColor: 'var(--color-surface)',
        borderRight: 'var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
        userSelect: 'none'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '18px 20px 16px 20px',
          borderBottom: 'var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <circle cx="10" cy="16" r="3.5" fill="#E7E9DF" />
              <circle cx="22" cy="16" r="3.5" fill="#FFFFFF" />
              <path d="M12.5 16h6" stroke="#E7E9DF" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--color-charcoal)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
              }}
            >
              Relay
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--color-charcoal-muted)',
                fontWeight: 400
              }}
            >
              Assistant Workspace
            </div>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="mobile-only"
          style={{
            padding: '4px',
            color: 'var(--color-charcoal-muted)',
            borderRadius: 'var(--radius-sm)'
          }}
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
      </div>

      {/* Active Client Context Pill */}
      <div
        style={{
          margin: '12px 14px 4px 14px',
          padding: '8px 12px',
          backgroundColor: 'var(--color-surface-subtle)',
          borderRadius: 'var(--radius-md)',
          border: 'var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-sand)',
              color: 'var(--color-charcoal)',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            MV
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--color-charcoal)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              Marcus Vance
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
              Client Queue Active
            </div>
          </div>
        </div>
        <ShieldCheck size={14} color="var(--color-primary)" />
      </div>

      {/* Scrollable Navigation List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 10px 16px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {navSections.map((section, idx) => (
          <div key={idx}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--color-charcoal-muted)',
                padding: '4px 10px 6px 10px'
              }}
            >
              {section.group}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--color-primary)' : 'var(--color-charcoal)',
                      backgroundColor: isActive ? 'var(--color-sage)' : 'transparent',
                      boxShadow: isActive ? 'inset 3px 0 0 var(--color-primary)' : 'none',
                      textDecoration: 'none',
                      transition: 'background-color var(--transition-fast), color var(--transition-fast)'
                    })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '18px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Icon size={16} strokeWidth={1.75} />
                      </span>
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span
                        className="tabular-nums"
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '1px 7px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: item.badgeType
                            ? `var(--color-resp-${item.badgeType}-bg)`
                            : item.highlight
                            ? 'var(--color-resp-client-bg)'
                            : 'rgba(41, 45, 41, 0.06)',
                          color: item.badgeType
                            ? `var(--color-resp-${item.badgeType})`
                            : item.highlight
                            ? 'var(--color-resp-client)'
                            : 'var(--color-charcoal-muted)',
                          border: item.badgeType
                            ? `1px solid var(--color-resp-${item.badgeType}-border)`
                            : item.highlight
                            ? '1px solid var(--color-resp-client-border)'
                            : 'none'
                        }}
                      >
                        {item.count}
                      </span>
                    )}

                    {item.tag && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--color-primary-muted)',
                          color: 'var(--color-primary)'
                        }}
                      >
                        {item.tag}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: 'var(--border-subtle)',
          fontSize: '11px',
          color: 'var(--color-charcoal-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>Elena (Assistant)</span>
        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }} className="tabular-nums">Relay v1.0</span>
      </div>
    </aside>
  );
}
