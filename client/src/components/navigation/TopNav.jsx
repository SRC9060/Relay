import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  RotateCw,
  Bell,
  ChevronDown,
  ExternalLink,
  LogOut,
  User,
  Shield,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAccounts } from '../../context/AccountContext';
import { useConversations } from '../../context/ConversationContext';
import Button from '../common/Button';

export default function TopNav({ onToggleMobileMenu }) {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const {
    accounts,
    selectedAccountId,
    setSelectedAccountId,
    isSyncing,
    syncAll,
    lastSyncTime
  } = useAccounts();
  const {
    conversations = [],
    counts,
    markAsRead,
    markAllAsRead,
    selectConversation
  } = useConversations();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate sync time text
  const getSyncText = () => {
    if (isSyncing) return 'Syncing...';
    const seconds = Math.floor((new Date() - lastSyncTime) / 1000);
    if (seconds < 60) return 'Synced just now';
    const minutes = Math.floor(seconds / 60);
    return `Synced ${minutes}m ago`;
  };

  const formatRelativeTime = (iso) => {
    if (!iso) return '';
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  };

  const notifications = useMemo(() => {
    if (!conversations || conversations.length === 0) return [];
    const unread = conversations.filter((c) => !c.isArchived && c.isUnread);
    const read = conversations.filter((c) => !c.isArchived && !c.isUnread);
    const combined = [...unread, ...read].slice(0, 8);

    return combined.map((c) => {
      let category = 'Correspondence';
      if (c.responsibility === 'client') category = 'Client Decision';
      else if (c.responsibility === 'assistant') category = 'Assistant Action';
      else if (c.category === 'meetings' || c.category === 'scheduling') category = 'Meeting';
      else if (c.responsibility === 'none') category = 'Informational';

      return {
        id: c.id,
        conversationId: c.id,
        title: c.subject,
        sender: c.sender?.name || 'Unknown',
        time: formatRelativeTime(c.lastMessageAt),
        unread: Boolean(c.isUnread),
        category
      };
    });
  }, [conversations]);

  const unreadNotificationsCount = counts?.unread ?? notifications.filter((n) => n.unread).length;

  return (
    <header
      className="relay-top-nav"
      style={{
        height: '60px',
        backgroundColor: 'var(--color-surface)',
        borderBottom: 'var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        gap: '12px'
      }}
    >
      {/* Left: Mobile hamburger & Global Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '440px', minWidth: 0 }}>
        <button
          onClick={onToggleMobileMenu}
          className="mobile-only"
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            padding: '4px',
            color: 'var(--color-charcoal)',
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-subtle)',
            backgroundColor: 'var(--color-surface-subtle)',
            cursor: 'pointer'
          }}
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <div style={{ position: 'relative', width: '100%' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '11px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-charcoal-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            style={{
              width: '100%',
              padding: '7px 46px 7px 32px',
              fontSize: '13px',
              backgroundColor: 'var(--color-surface-subtle)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              transition: 'border-color var(--transition-fast), background-color var(--transition-fast)'
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
          <span
            className="keycap desktop-only"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          >
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Connected Account Selector */}
        <div style={{ position: 'relative' }} className="desktop-only">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
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
              outline: 'none'
            }}
          >
            <option value="all">All Accounts ({accounts.length})</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} ({acc.provider === 'gmail' ? 'Gmail' : 'Outlook'})
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

        {/* Sync Status Pill */}
        <button
          onClick={syncAll}
          disabled={isSyncing}
          className="top-nav-action-btn"
          title="Click to simulate email sync"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 9px',
            backgroundColor: 'var(--color-surface-subtle)',
            border: 'var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--color-charcoal-muted)',
            cursor: isSyncing ? 'not-allowed' : 'pointer'
          }}
        >
          <RotateCw
            size={11}
            style={{
              animation: isSyncing ? 'spin 1s linear infinite' : 'none',
              color: isSyncing ? 'var(--color-primary)' : 'inherit'
            }}
          />
          <span className="sync-label tabular-nums">{getSyncText()}</span>
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="top-nav-action-btn"
            style={{
              position: 'relative',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              border: 'var(--border-subtle)',
              backgroundColor: 'var(--color-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-charcoal)',
              cursor: 'pointer'
            }}
            aria-label="View notifications"
          >
            <Bell size={15} />
            {unreadNotificationsCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '5px',
                  right: '6px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-resp-client)'
                }}
              />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '40px',
                  width: '300px',
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-dropdown)',
                  padding: '12px',
                  zIndex: 100
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    paddingBottom: '6px',
                    borderBottom: 'var(--border-subtle)'
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Notifications</span>
                  {unreadNotificationsCount > 0 ? (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await markAllAsRead();
                      }}
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-primary)',
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontWeight: 600
                      }}
                    >
                      Mark all read
                    </button>
                  ) : (
                    <span style={{ fontSize: '11px', color: 'var(--color-charcoal-light)' }}>All read</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '320px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '16px 8px', textAlign: 'center', fontSize: '12px', color: 'var(--color-charcoal-muted)' }}>
                      No notifications.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={async () => {
                          if (n.unread) {
                            await markAsRead(n.conversationId);
                          }
                          selectConversation(n.conversationId);
                          navigate(`/app/inbox?id=${n.conversationId}`);
                          setShowNotifications(false);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: n.unread ? 'var(--color-surface-subtle)' : 'transparent',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'background-color var(--transition-fast)'
                        }}
                        className="notification-item-row"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <div
                            style={{
                              fontWeight: n.unread ? 600 : 400,
                              color: 'var(--color-charcoal)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {n.title}
                          </div>
                          {n.unread && (
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                flexShrink: 0
                              }}
                            />
                          )}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '3px',
                            fontSize: '10px',
                            color: 'var(--color-charcoal-muted)'
                          }}
                        >
                          <span>{n.category}</span>
                          <span className="tabular-nums">{n.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Switch / Preview Client Workspace */}
        <Button
          variant="secondary"
          size="sm"
          icon={ExternalLink}
          iconPosition="right"
          className="desktop-only"
          onClick={() => {
            navigate('/client');
          }}
          title="Open Marcus Vance's client attention queue"
        >
          Client View
        </Button>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="top-nav-action-btn"
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
          >
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {user?.avatar || 'EA'}
            </div>
            <div style={{ textAlign: 'left' }} className="desktop-only">
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                {user?.name || 'Elena Rostova'}
              </div>
            </div>
            <ChevronDown size={13} color="var(--color-charcoal-muted)" />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '40px',
                  width: '230px',
                  backgroundColor: 'var(--color-surface)',
                  border: 'var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-dropdown)',
                  padding: '8px',
                  zIndex: 100
                }}
              >
                <div style={{ padding: '8px 10px', borderBottom: 'var(--border-subtle)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{user?.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                    {user?.title || 'Executive Assistant'}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--color-charcoal-light)', marginTop: '2px' }}>
                    {user?.email}
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
                    Switch demo role
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
                      color: user?.role === 'assistant' ? 'var(--color-primary)' : 'var(--color-charcoal)',
                      fontWeight: user?.role === 'assistant' ? 600 : 400,
                      textAlign: 'left'
                    }}
                  >
                    <Shield size={14} /> Elena Rostova (Assistant)
                  </button>
                  <button
                    onClick={async () => {
                      await switchRole('client');
                      setShowProfileMenu(false);
                      navigate('/client');
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      borderRadius: 'var(--radius-sm)',
                      color: user?.role === 'client' ? 'var(--color-resp-client)' : 'var(--color-charcoal)',
                      fontWeight: user?.role === 'client' ? 600 : 400,
                      textAlign: 'left'
                    }}
                  >
                    <User size={14} /> Marcus Vance (Client)
                  </button>
                </div>

                <div style={{ borderTop: 'var(--border-subtle)', paddingTop: '6px' }}>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
