import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, AlertCircle, UserCheck, UserRound, CheckCircle2 } from 'lucide-react';
import { useConversations } from '../../../context/ConversationContext';

const SEGMENT_TITLES = {
  all: 'Inbox',
  'action-required': 'Needs Attention',
  action_required: 'Needs Attention',
  'assistant-reply': 'Assistant to Reply',
  assistant_reply: 'Assistant to Reply',
  'client-reply': 'Client to Reply',
  client_reply: 'Client to Reply',
  'no-reply': 'No Reply Needed',
  no_reply: 'No Reply Needed',
  'needs-review': 'Needs Review',
  needs_review: 'Needs Review',
  review: 'Needs Review',
  waiting: 'Waiting for Response',
  meetings: 'Meetings & Logistics',
  important: 'Important',
  archive: 'Archived'
};

export default function ConversationListHeader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    activeSegment,
    setActiveSegment,
    conversations,
    counts,
    countsLoaded,
    loading,
    searchQuery,
    setSearchQuery,
    subFilter,
    setSubFilter,
    selectConversation
  } = useConversations();

  const title = SEGMENT_TITLES[activeSegment] || 'Inbox';

  const responsibilityTabs = [
    { id: 'all', label: 'All', count: countsLoaded ? (counts?.all ?? 0) : '—' },
    { id: 'assistant_reply', label: 'Assistant to Reply', count: countsLoaded ? (counts?.assistantReply ?? 0) : '—', color: 'var(--color-resp-assistant)' },
    { id: 'client_reply', label: 'Client to Reply', count: countsLoaded ? (counts?.clientReply ?? 0) : '—', color: 'var(--color-resp-client)' },
    { id: 'no_reply', label: 'No Reply Needed', count: countsLoaded ? (counts?.noReply ?? 0) : '—', color: 'var(--color-resp-none)' },
    { id: 'needs_review', label: 'Needs Review', count: countsLoaded ? (counts?.needsReview ?? 0) : '—', color: 'var(--color-resp-review)' }
  ];

  const isRespTabActive = (tabId) => {
    if (tabId === 'all') return activeSegment === 'all' || !activeSegment;
    if (tabId === 'assistant_reply') return activeSegment === 'assistant_reply' || activeSegment === 'assistant-reply';
    if (tabId === 'client_reply') return activeSegment === 'client_reply' || activeSegment === 'client-reply';
    if (tabId === 'no_reply') return activeSegment === 'no_reply' || activeSegment === 'no-reply';
    if (tabId === 'needs_review') return activeSegment === 'needs_review' || activeSegment === 'needs-review' || activeSegment === 'review';
    return false;
  };

  const handleTabClick = (tabId) => {
    setActiveSegment(tabId);
    selectConversation(null);
    if (tabId === 'all') {
      navigate('/app/inbox', { replace: true });
    } else {
      navigate(`/app/inbox?segment=${tabId}`, { replace: true });
    }
  };

  return (
    <div
      style={{
        padding: '20px 24px 14px 24px',
        borderBottom: 'var(--border-subtle)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Top Row: Title & Total Count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1
            style={{
              fontSize: '20px',
              fontWeight: 700,
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-charcoal)',
              margin: 0,
              letterSpacing: '-0.02em'
            }}
          >
            {title}
          </h1>
          <span
            className="tabular-nums"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface-subtle)',
              border: 'var(--border-subtle)',
              color: 'var(--color-charcoal-muted)'
            }}
          >
            {loading ? 'Loading threads…' : `${conversations.length} ${conversations.length === 1 ? 'thread' : 'threads'}`}
          </span>
        </div>
      </div>

      {/* Responsibility Category Filter Tabs (With Smooth Sliding Active Pill) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '2px',
          scrollbarWidth: 'none'
        }}
      >
        {responsibilityTabs.map((tab) => {
          const active = isRespTabActive(tab.id);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`filter-tab-pill ${active ? 'active' : ''}`}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12px',
                fontWeight: active ? 600 : 500,
                backgroundColor: active ? 'transparent' : 'var(--color-surface-subtle)',
                color: active ? '#FFFFFF' : 'var(--color-charcoal)',
                border: '1px solid',
                borderColor: active ? 'transparent' : 'var(--border-subtle)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                zIndex: 1
              }}
            >
              {active && (
                <motion.div
                  layoutId="activeRespTabIndicator"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.22 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'var(--radius-full)',
                    zIndex: -1
                  }}
                />
              )}
              {tab.color && (
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: active ? '#FFFFFF' : tab.color,
                    transition: 'background-color var(--transition-fast)'
                  }}
                />
              )}
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: 600,
                  opacity: active ? 0.92 : 0.65,
                  fontVariantNumeric: 'tabular-nums'
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input & Quick Status Filters Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-charcoal-light)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by sender, subject, or message content..."
            style={{
              width: '100%',
              padding: '7px 28px 7px 30px',
              fontSize: '12.5px',
              backgroundColor: 'var(--color-surface-subtle)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-charcoal)',
              outline: 'none',
              boxSizing: 'border-box',
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
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-charcoal-muted)',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Quick status pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'all', label: 'All status' },
            { id: 'unread', label: 'Unread' },
            { id: 'important', label: 'Important' },
            { id: 'has_draft', label: 'Drafts' }
          ].map((f) => {
            const active = subFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSubFilter(f.id)}
                className={`filter-tab-pill ${active ? 'active' : ''}`}
                style={{
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: active ? 600 : 500,
                  color: active ? 'var(--color-primary)' : 'var(--color-charcoal-muted)',
                  backgroundColor: active ? 'var(--color-sage)' : 'var(--color-surface-subtle)',
                  border: active ? '1px solid var(--color-sage-dark)' : 'var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
