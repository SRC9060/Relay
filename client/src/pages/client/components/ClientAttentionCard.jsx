import React from 'react';
import { AlertCircle, Clock, ShieldCheck, FileText } from 'lucide-react';

export default function ClientAttentionCard({
  conversation,
  isSelected,
  onClick
}) {
  const {
    sender,
    subject,
    lastMessageAt,
    aiReasoning,
    clientAttentionReason,
    aiSummary,
    preview,
    isImportant,
    accountId
  } = conversation;

  const formatCardTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diffHours = (now - d) / (1000 * 60 * 60);

    if (diffHours < 24 && d.getDate() === now.getDate()) {
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const attentionReason = clientAttentionReason || aiReasoning || 'Client decision or executive authorization required.';
  const summarySnippet = aiSummary?.overview || preview || '';
  const accountLabel = accountId === 'acc_outlook_01' ? 'Advisory Board' : 'Vance Tech';

  return (
    <div
      onClick={onClick}
      className={`client-queue-card relay-card-interactive ${isSelected ? 'selected' : ''}`}
      style={{
        padding: '16px 18px',
        backgroundColor: 'var(--color-surface)',
        border: isSelected
          ? '1.5px solid var(--color-resp-client)'
          : 'var(--border-subtle)',
        borderLeft: isSelected
          ? '4px solid var(--color-resp-client)'
          : 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: isSelected ? 'var(--shadow-dropdown)' : 'var(--shadow-card)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        position: 'relative'
      }}
    >
      {/* Top Header: Sender & Time */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-resp-client-bg)',
              color: 'var(--color-resp-client)',
              border: '1px solid var(--color-resp-client-border)',
              fontSize: '11px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {sender?.avatar || sender?.name?.slice(0, 2).toUpperCase() || 'CX'}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--color-charcoal)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {sender?.name}
            </div>
            {sender?.role && (
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-charcoal-muted)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {sender.role}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '10.5px',
              color: 'var(--color-charcoal-light)',
              fontVariantNumeric: 'tabular-nums'
            }}
          >
            {formatCardTime(lastMessageAt)}
          </span>
        </div>
      </div>

      {/* Subject */}
      <div
        style={{
          fontSize: '13.5px',
          fontWeight: 600,
          color: 'var(--color-charcoal)',
          lineHeight: 1.35
        }}
      >
        {subject}
      </div>

      {/* Why Client Response is Needed (Prominent Alert Chip) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          padding: '8px 10px',
          backgroundColor: 'var(--color-resp-client-bg)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-resp-client-border)'
        }}
      >
        <AlertCircle
          size={13}
          style={{
            color: 'var(--color-resp-client)',
            marginTop: '2px',
            flexShrink: 0
          }}
        />
        <div style={{ fontSize: '11.5px', color: 'var(--color-resp-client-dark)', lineHeight: 1.4 }}>
          <strong style={{ fontWeight: 600 }}>Why your input is required:</strong> {attentionReason}
        </div>
      </div>

      {/* Short AI Summary Snippet */}
      {summarySnippet && (
        <p
          style={{
            fontSize: '12px',
            color: 'var(--color-charcoal-muted)',
            lineHeight: 1.45,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {summarySnippet}
        </p>
      )}

      {/* Card Footer: Account Tag & Priority */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '2px',
          paddingTop: '6px',
          borderTop: '1px dashed rgba(41, 43, 41, 0.08)'
        }}
      >
        <span
          style={{
            fontSize: '10.5px',
            color: 'var(--color-charcoal-muted)',
            fontWeight: 500
          }}
        >
          {accountLabel}
        </span>
        {isImportant && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--color-warning)',
              backgroundColor: 'var(--color-warning-bg)',
              padding: '2px 6px',
              borderRadius: 'var(--radius-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            Priority
          </span>
        )}
      </div>
    </div>
  );
}
