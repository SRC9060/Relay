import React from 'react';
import {
  Mail,
  MailOpen,
  Star,
  Archive,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { useConversations } from '../../../context/ConversationContext';

export default function ConversationActionBar({ conversation, onNavigate }) {
  const {
    toggleRead,
    markAsRead,
    toggleImportant,
    archiveConversation,
    restoreConversation,
    markCompleted,
    changeResponsibility,
    navigateConversation
  } = useConversations();

  if (!conversation) return null;

  const { id, isUnread, isImportant, isArchived, actionStatus, responsibility = 'assistant' } = conversation;

  return (
    <div
      style={{
        padding: '8px 20px',
        borderBottom: 'var(--border-subtle)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}
    >
      {/* Left Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        {/* Read / Unread */}
        <button
          onClick={() => (isUnread ? markAsRead(id) : toggleRead(id))}
          className="action-bar-btn"
          title={isUnread ? 'Mark as read' : 'Mark as unread'}
        >
          {isUnread ? <MailOpen size={13} /> : <Mail size={13} />}
          <span>{isUnread ? 'Mark read' : 'Mark unread'}</span>
        </button>

        {/* Important */}
        <button
          onClick={() => toggleImportant(id)}
          className="action-bar-btn"
          style={isImportant ? {
            backgroundColor: 'var(--color-warning-bg)',
            borderColor: 'rgba(201, 138, 44, 0.3)',
            color: 'var(--color-warning)'
          } : {}}
          title={isImportant ? 'Unmark important' : 'Mark important'}
        >
          <Star size={13} fill={isImportant ? 'var(--color-warning)' : 'none'} />
          <span>{isImportant ? 'Important' : 'Star'}</span>
        </button>

        {/* Archive / Restore */}
        {isArchived ? (
          <button
            onClick={() => restoreConversation(id)}
            className="action-bar-btn"
            title="Restore to inbox"
          >
            <RotateCcw size={13} />
            <span>Restore</span>
          </button>
        ) : (
          <button
            onClick={() => archiveConversation(id)}
            className="action-bar-btn"
            title="Archive conversation"
          >
            <Archive size={13} />
            <span>Archive</span>
          </button>
        )}

        {/* Mark Completed or Completed Status */}
        {actionStatus !== 'completed' ? (
          <button
            onClick={() => markCompleted(id)}
            className="action-bar-btn"
            title="Mark action completed"
          >
            <CheckCircle2 size={13} color="var(--color-success)" />
            <span>Complete</span>
          </button>
        ) : (
          <span
            className="action-bar-btn"
            style={{
              backgroundColor: 'var(--color-success-bg)',
              borderColor: 'rgba(42, 110, 78, 0.25)',
              color: 'var(--color-success)',
              cursor: 'default',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title={conversation.handledBy === 'client' ? 'Handled by client Marcus Vance' : 'Action marked complete'}
          >
            <CheckCircle2 size={13} color="var(--color-success)" />
            <span>{conversation.handledBy === 'client' ? 'Handled by Client' : 'Completed'}</span>
          </span>
        )}

        {/* Vertical Divider */}
        <div style={{ width: '1px', height: '18px', backgroundColor: 'rgba(41, 43, 41, 0.1)', margin: '0 4px' }} />

        {/* Manual Responsibility Selector */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--color-charcoal-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <ShieldAlert size={12} color="var(--color-primary)" />
            Triage:
          </span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              value={responsibility}
              onChange={(e) => changeResponsibility(id, e.target.value)}
              style={{
                appearance: 'none',
                padding: '5px 26px 5px 9px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: `var(--color-resp-${responsibility}-bg)`,
                border: `1px solid var(--color-resp-${responsibility}-border)`,
                color: `var(--color-resp-${responsibility})`,
                cursor: 'pointer',
                outline: 'none',
                transition: 'box-shadow var(--transition-fast)'
              }}
              title="Change reply responsibility manually (Human Override)"
            >
              <option value="assistant">Assistant to Reply</option>
              <option value="client">Client to Reply</option>
              <option value="none">No Reply Needed</option>
              <option value="review">Needs Review</option>
            </select>
            <ChevronDown
              size={12}
              style={{
                position: 'absolute',
                right: '7px',
                pointerEvents: 'none',
                color: `var(--color-resp-${responsibility})`
              }}
            />
          </div>
        </div>
      </div>

      {/* Right Stepper: Prev / Next Conversation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => {
            const target = navigateConversation('prev');
            if (target && onNavigate) onNavigate(target.id);
          }}
          className="relay-button secondary"
          style={{
            width: '26px',
            height: '26px',
            padding: 0,
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-subtle)',
            backgroundColor: 'var(--color-surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-charcoal)'
          }}
          title="Previous conversation"
          aria-label="Previous conversation"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => {
            const target = navigateConversation('next');
            if (target && onNavigate) onNavigate(target.id);
          }}
          className="relay-button secondary"
          style={{
            width: '26px',
            height: '26px',
            padding: 0,
            borderRadius: 'var(--radius-sm)',
            border: 'var(--border-subtle)',
            backgroundColor: 'var(--color-surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-charcoal)'
          }}
          title="Next conversation"
          aria-label="Next conversation"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
