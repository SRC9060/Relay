import React, { useState } from 'react';
import {
  Check,
  UserCheck,
  ArrowLeft,
  Calendar,
  AlertCircle,
  FileCheck,
  Sparkles,
  Mail,
  Users
} from 'lucide-react';
import Button from '../../../components/common/Button';

export default function ClientConversationView({
  conversation,
  onBack,
  onMarkHandled,
  onOpenDelegate
}) {
  const [isHandling, setIsHandling] = useState(false);

  if (!conversation) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
          color: 'var(--color-charcoal-muted)'
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '14px',
            color: 'var(--color-charcoal-light)'
          }}
        >
          <Mail size={22} />
        </div>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '4px' }}>
          Select a conversation
        </h3>
        <p style={{ fontSize: '12.5px', maxWidth: '340px' }}>
          Choose an item from your attention queue to review details, approve, or delegate to Elena.
        </p>
      </div>
    );
  }

  const {
    subject,
    sender,
    recipients,
    cc,
    messages = [],
    lastMessageAt,
    aiReasoning,
    clientAttentionReason,
    aiSummary,
    importantInformation = [],
    identifiedDates = []
  } = conversation;

  const handleHandledClick = async () => {
    setIsHandling(true);
    try {
      await onMarkHandled(conversation.id);
    } finally {
      setIsHandling(false);
    }
  };

  const attentionReason = clientAttentionReason || aiReasoning || 'Client executive decision required.';

  const formatFullTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-bg)',
        overflowY: 'auto'
      }}
    >
      {/* Top Header & Mobile Back */}
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'var(--color-surface)',
          borderBottom: 'var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="mobile-only"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 500,
              color: 'var(--color-primary)',
              marginBottom: '10px',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={14} /> Back to Attention Queue
          </button>
        )}

        {/* Subject & Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--color-charcoal)',
              lineHeight: 1.3
            }}
          >
            {subject}
          </h1>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '14px',
              fontSize: '12px',
              color: 'var(--color-charcoal-muted)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>{sender?.name}</span>
              <span>&lt;{sender?.email}&gt;</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={12} color="var(--color-charcoal-light)" />
              <span>To: {recipients?.join(', ')}</span>
            </div>

            {cc && cc.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ color: 'var(--color-charcoal-light)' }}>CC:</span>
                <span>{cc.join(', ')}</span>
              </div>
            )}

            <div style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', color: 'var(--color-charcoal-light)' }}>
              {formatFullTime(lastMessageAt)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Executive Action Desk (Prominent Callout Card) */}
        <div
          style={{
            padding: '18px 20px',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-resp-client-border)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flex: 1, minWidth: '260px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-resp-client-bg)',
                  color: 'var(--color-resp-client)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                <AlertCircle size={18} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-resp-client-dark)', marginBottom: '2px' }}>
                  Action Required from Marcus Vance
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--color-charcoal)', lineHeight: 1.45 }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-resp-client-dark)' }}>Why your input is required: </span>
                  {attentionReason}
                </div>
              </div>
            </div>

            {/* Two Distinct Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <Button
                variant="primary"
                size="md"
                icon={Check}
                onClick={handleHandledClick}
                loading={isHandling}
                style={{
                  backgroundColor: '#25382E',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(37, 56, 46, 0.15)'
                }}
                title="Mark this request completed and remove from your queue"
              >
                Mark as Handled
              </Button>

              <Button
                variant="secondary"
                size="md"
                icon={UserCheck}
                onClick={() => onOpenDelegate(conversation)}
                style={{
                  borderColor: 'var(--color-resp-assistant-border)',
                  color: 'var(--color-primary)',
                  fontWeight: 600
                }}
                title="Hand off this correspondence to Elena Rostova with priority"
              >
                Ask Assistant to Take Over
              </Button>
            </div>
          </div>
        </div>

        {/* AI Executive Briefing */}
        <div
          style={{
            padding: '16px 18px',
            backgroundColor: '#FCFBF8',
            borderRadius: 'var(--radius-lg)',
            border: 'var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--color-primary)" />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              Executive Summary
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-charcoal)', lineHeight: 1.55 }}>
            {aiSummary?.overview ||
              aiSummary?.summary ||
              conversation.preview ||
              'High-priority correspondence awaiting client evaluation.'}
          </p>

          {/* Key Dates or Decisions extracted if available */}
          {(importantInformation.length > 0 || identifiedDates.length > 0) && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginTop: '4px',
                paddingTop: '8px',
                borderTop: '1px solid rgba(41, 43, 41, 0.06)'
              }}
            >
              {identifiedDates.map((item, idx) => {
                // Atlas stores extracted dates as objects; older demo data may use strings.
                // Convert both shapes to display text before rendering to avoid React object-child errors.
                const dateLabel = typeof item === 'string'
                  ? item
                  : [item?.date, item?.description].filter(Boolean).join(' — ');

                if (!dateLabel) return null;

                return (
                  <div
                    key={item?.date || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      padding: '3px 8px',
                      backgroundColor: 'var(--color-surface)',
                      border: 'var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      color: 'var(--color-charcoal)'
                    }}
                  >
                    <Calendar size={11} color="var(--color-charcoal-muted)" />
                    <span>{dateLabel}</span>
                  </div>
                );
              })}
              {importantInformation.map((info, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    padding: '3px 8px',
                    backgroundColor: 'var(--color-surface)',
                    border: 'var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--color-charcoal-muted)'
                  }}
                >
                  <FileCheck size={11} color="var(--color-primary)" />
                  <span>{info}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Thread */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-charcoal-muted)'
            }}
          >
            Original Message History ({messages.length})
          </div>

          {messages.map((msg, index) => {
            const isElena =
              msg.sender?.email?.includes('relay-assistant') ||
              msg.sender?.name?.toLowerCase().includes('elena');
            const isMarcus =
              msg.sender?.email?.includes('vancetech') ||
              msg.sender?.name?.toLowerCase().includes('marcus');

            return (
              <div
                key={msg.id || index}
                style={{
                  padding: '18px 20px',
                  backgroundColor: isElena ? '#F5F8F6' : 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: isElena
                    ? '1.5px solid var(--color-resp-assistant-border)'
                    : 'var(--border-subtle)',
                  boxShadow: 'var(--shadow-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: isElena
                          ? 'var(--color-resp-assistant-bg)'
                          : isMarcus
                          ? 'var(--color-resp-client-bg)'
                          : 'var(--color-surface-subtle)',
                        color: isElena
                          ? 'var(--color-primary)'
                          : isMarcus
                          ? 'var(--color-resp-client)'
                          : 'var(--color-charcoal)',
                        fontSize: '11px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'var(--border-subtle)'
                      }}
                    >
                      {msg.sender?.name?.slice(0, 2).toUpperCase() || 'ER'}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                        {msg.sender?.name}
                        {isElena && (
                          <span
                            style={{
                              marginLeft: '6px',
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '2px 6px',
                              borderRadius: 'var(--radius-xs)',
                              backgroundColor: 'var(--color-resp-assistant-bg)',
                              color: 'var(--color-primary)'
                            }}
                          >
                            Executive Assistant
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                        {msg.sender?.email}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-charcoal-light)',
                      fontVariantNumeric: 'tabular-nums'
                    }}
                  >
                    {formatFullTime(msg.timestamp)}
                  </span>
                </div>

                {/* Body */}
                <div
                  style={{
                    fontSize: '13px',
                    lineHeight: 1.6,
                    color: 'var(--color-charcoal)',
                    whiteSpace: 'pre-line',
                    paddingTop: '4px'
                  }}
                >
                  {msg.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
