import React from 'react';

export default function MessageThreadView({ conversation }) {
  if (!conversation || !conversation.messages || conversation.messages.length === 0) {
    return (
      <div style={{ padding: '24px 20px', color: 'var(--color-charcoal-muted)', fontSize: '13px' }}>
        No messages in this conversation.
      </div>
    );
  }

  const { messages } = conversation;

  const formatMessageTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {messages.map((msg, index) => {
        const senderObj = (msg && typeof msg.sender === 'object' && msg.sender !== null) ? msg.sender : { name: typeof msg?.sender === 'string' ? msg.sender : 'Unknown Sender', email: '' };
        const senderName = senderObj.name || 'Unknown Sender';
        const senderEmail = senderObj.email || '';
        const isAssistantSender =
          (senderEmail && senderEmail.includes('relay-assistant')) ||
          senderName.toLowerCase().includes('elena') ||
          senderName.toLowerCase().includes('marcus');

        const initials = senderName
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'CX';

        return (
          <div
            key={msg.id || index}
            style={{
              padding: '16px 18px',
              backgroundColor: isAssistantSender ? '#FAFAF7' : 'var(--color-surface)',
              border: 'var(--border-subtle)',
              borderLeft: isAssistantSender ? '3px solid var(--color-primary)' : 'var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Message Header: Sender & Timestamp */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <div
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: isAssistantSender ? 'var(--color-primary)' : 'var(--color-sage)',
                    color: isAssistantSender ? '#FFFFFF' : 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                    {senderName}
                  </div>
                  {senderEmail && (
                    <div style={{ fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
                      {senderEmail}
                    </div>
                  )}
                </div>
              </div>

              <div
                className="tabular-nums"
                style={{
                  fontSize: '11px',
                  color: 'var(--color-charcoal-light)',
                  flexShrink: 0
                }}
              >
                {formatMessageTime(msg.timestamp)}
              </div>
            </div>

            {/* Message Body */}
            <div
              style={{
                fontSize: '13px',
                color: 'var(--color-charcoal)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line',
                wordBreak: 'break-word',
                paddingLeft: '39px'
              }}
            >
              {msg.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
