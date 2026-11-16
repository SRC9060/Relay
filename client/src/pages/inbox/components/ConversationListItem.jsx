import React from 'react';
import { Star, Clock, AlertCircle, CheckCircle2, FileEdit } from 'lucide-react';
import Badge from '../../../components/common/Badge';

export default function ConversationListItem({
  conversation,
  isSelected,
  onSelect,
  onToggleImportant
}) {
  const {
    id,
    subject,
    preview,
    sender,
    lastMessageAt,
    isUnread,
    isImportant,
    responsibility,
    actionStatus,
    draft
  } = conversation;

  const rawConfidence = conversation.confidenceScore ?? conversation.aiConfidence;
  const hasConfidence = rawConfidence !== null && rawConfidence !== undefined && Number.isFinite(Number(rawConfidence));
  const confidencePercent = hasConfidence ? Math.round(Number(rawConfidence) * 100) : null;

  // Format relative timestamp
  const formatTime = (iso) => {
    if (!iso) return '';
    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={() => onSelect(id)}
      className={`conversation-list-row ${isSelected ? 'selected' : ''} ${isUnread ? 'unread' : ''}`}
      style={{
        padding: '14px 18px',
        borderBottom: 'var(--border-subtle)',
        backgroundColor: isSelected
          ? 'var(--color-sage)'
          : isUnread
          ? '#FDFCFA'
          : 'var(--color-surface)',
        boxShadow: isSelected ? 'inset 3px 0 0 var(--color-primary)' : 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background-color var(--transition-fast)'
      }}
    >
      {/* Top Row: Sender, Unread Dot, Timestamp, Star */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0, flex: 1 }}>
          {isUnread && (
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                flexShrink: 0
              }}
              title="Unread"
            />
          )}
          <span
            style={{
              fontSize: '13px',
              fontWeight: isUnread ? 700 : 600,
              color: 'var(--color-charcoal)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {sender.name}
          </span>
          {sender.role && (
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-charcoal-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              • {sender.role}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, marginLeft: '8px' }}>
          <span
            className="tabular-nums"
            style={{
              fontSize: '11px',
              color: 'var(--color-charcoal-light)',
              fontWeight: 400
            }}
          >
            {formatTime(lastMessageAt)}
          </span>
          <button
            type="button"
            className="star-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              onToggleImportant(id);
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              color: isImportant ? 'var(--color-warning)' : 'rgba(41, 43, 41, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isImportant ? 'Unmark important' : 'Mark important'}
            aria-label={isImportant ? 'Unmark important' : 'Mark important'}
          >
            <Star size={13} fill={isImportant ? 'var(--color-warning)' : 'none'} />
          </button>
        </div>
      </div>

      {/* Middle Row: Subject Line */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: isUnread ? 600 : 500,
          color: 'var(--color-charcoal)',
          marginBottom: '3px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {subject}
      </div>

      {/* Bottom Row: Preview Snippet */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--color-charcoal-muted)',
          lineHeight: 1.4,
          marginBottom: '8px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {preview}
      </div>

      {/* Tags & Status Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <Badge type={responsibility} size="sm" dot />

        {confidencePercent !== null && (
          <span
            className="tabular-nums"
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-surface-subtle)',
              border: 'var(--border-subtle)',
              color: 'var(--color-charcoal-muted)'
            }}
            title={`AI Classification Confidence: ${confidencePercent}%`}
          >
            {confidencePercent}%
          </span>
        )}

        {actionStatus === 'action_required' && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10.5px',
              fontWeight: 500,
              padding: '2px 7px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-resp-client-bg)',
              border: '1px solid var(--color-resp-client-border)',
              color: 'var(--color-resp-client)'
            }}
          >
            <AlertCircle size={10} color="var(--color-resp-client)" />
            Action required
          </span>
        )}

        {actionStatus === 'waiting' && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10.5px',
              fontWeight: 500,
              padding: '2px 7px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-surface-subtle)',
              border: 'var(--border-subtle)',
              color: 'var(--color-charcoal-muted)'
            }}
          >
            <Clock size={10} color="var(--color-charcoal-light)" />
            Waiting for response
          </span>
        )}

        {actionStatus === 'completed' && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10.5px',
              fontWeight: 500,
              padding: '2px 7px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-success-bg)',
              border: '1px solid rgba(42, 110, 78, 0.2)',
              color: 'var(--color-success)'
            }}
          >
            <CheckCircle2 size={10} />
            Completed
          </span>
        )}

        {draft && draft.body && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10.5px',
              fontWeight: 500,
              padding: '2px 7px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--color-primary-muted)',
              border: '1px solid var(--color-primary-muted)',
              color: 'var(--color-primary)'
            }}
          >
            <FileEdit size={10} />
            Draft
          </span>
        )}
      </div>
    </div>
  );
}
