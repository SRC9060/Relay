import React from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Mail, Users } from 'lucide-react';
import { useAccounts } from '../../../context/AccountContext';
import { useConversations } from '../../../context/ConversationContext';

const SEGMENT_NAMES = {
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
  waiting: 'Waiting',
  meetings: 'Meetings',
  important: 'Important',
  archive: 'Archived'
};

export default function ConversationReaderHeader({
  conversation,
  onBackToInbox,
  onNavigate
}) {
  const { accounts } = useAccounts();
  const { activeSegment, navigateConversation } = useConversations();
  const { subject = 'No Subject', sender = {}, recipients = [], cc = [], lastMessageAt, accountId } = conversation || {};

  const account = accounts.find((a) => a.id === accountId);
  const backLabel = SEGMENT_NAMES[activeSegment] || 'Inbox';

  const formattedDate = lastMessageAt
    ? new Date(lastMessageAt).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    : '';

  return (
    <div
      style={{
        padding: '16px 24px',
        borderBottom: 'var(--border-subtle)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Top Nav: Back to Inbox & Previous / Next Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <button
          onClick={onBackToInbox}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12.5px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-surface-subtle)',
            border: 'var(--border-subtle)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'background-color var(--transition-fast)'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-subtle)')}
        >
          <ArrowLeft size={14} />
          <span>Back to {backLabel}</span>
          <span className="keycap desktop-only" style={{ marginLeft: '4px', fontSize: '9px' }}>
            Esc
          </span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {account && (
            <span
              style={{
                fontSize: '11px',
                fontWeight: 500,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-surface-subtle)',
                border: 'var(--border-subtle)',
                color: 'var(--color-charcoal-muted)'
              }}
            >
              {account.name}
            </span>
          )}

          {/* Quick Prev / Next thread */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} className="desktop-only">
            <button
              onClick={() => {
                const target = navigateConversation('prev');
                if (target && onNavigate) onNavigate(target.id);
              }}
              title="Previous conversation"
              className="relay-button secondary"
              style={{
                padding: '4px 7px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-subtle)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-charcoal)',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => {
                const target = navigateConversation('next');
                if (target && onNavigate) onNavigate(target.id);
              }}
              title="Next conversation"
              className="relay-button secondary"
              style={{
                padding: '4px 7px',
                borderRadius: 'var(--radius-sm)',
                border: 'var(--border-subtle)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-charcoal)',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Subject */}
      <h1
        style={{
          fontSize: '19px',
          fontWeight: 700,
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-charcoal)',
          margin: 0,
          lineHeight: 1.35,
          letterSpacing: '-0.02em',
          wordBreak: 'break-word'
        }}
      >
        {subject}
      </h1>

      {/* Participant Metadata Bar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          paddingTop: '4px',
          fontSize: '12px',
          color: 'var(--color-charcoal-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Sender Avatar & Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-sage)',
                border: '1px solid var(--color-sage-dark)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 600,
                flexShrink: 0
              }}
            >
              {sender?.avatar || sender?.name?.slice(0, 2).toUpperCase() || 'CX'}
            </div>
            <div>
              <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>
                {sender?.name}
              </span>{' '}
              <span style={{ color: 'var(--color-charcoal-light)', fontSize: '11px' }}>
                &lt;{sender?.email}&gt;
              </span>
            </div>
          </div>

          {/* Recipients */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px' }}>
            <span style={{ color: 'var(--color-charcoal-light)' }}>to</span>
            <span style={{ color: 'var(--color-charcoal)' }}>{recipients?.join(', ')}</span>
          </div>

          {/* CCs if present */}
          {cc && cc.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11.5px' }}>
              <span style={{ color: 'var(--color-charcoal-light)' }}>cc</span>
              <span style={{ color: 'var(--color-charcoal-muted)' }}>{cc.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div style={{ fontSize: '11.5px', color: 'var(--color-charcoal-light)' }} className="tabular-nums">
          {formattedDate}
        </div>
      </div>
    </div>
  );
}
