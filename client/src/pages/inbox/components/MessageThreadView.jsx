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
        const isElena =
          (senderEmail && senderEmail.includes('relay-assistant')) ||
          senderName.toLowerCase().includes('elena');
        const isMarcus =
          (senderEmail && (senderEmail.includes('vancetech') || senderEmail.includes('marcus'))) ||
          senderName.toLowerCase().includes('marcus');

        const initials = senderName
          .split(' ')
          .filter(Boolean)
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase() || 'CX';

        const cardBg = isElena ? '#F5F8F6' : isMarcus ? '#FAF7F2' : 'var(--color-surface)';
        const accentBorder = isElena
          ? '3px solid var(--color-primary)'
          : isMarcus
          ? '3px solid var(--color-resp-client)'
          : 'var(--border-subtle)';

        return (
          <div
            key={msg.id || index}
            style={{
              padding: '18px 20px',
              backgroundColor: cardBg,
              border: 'var(--border-subtle)',
              borderLeft: accentBorder,
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Message Header: Sender & Timestamp */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isElena
                      ? 'var(--color-primary)'
                      : isMarcus
                      ? 'var(--color-resp-client)'
                      : 'var(--color-sage)',
                    color: (isElena || isMarcus) ? '#FFFFFF' : 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  {initials}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                      {senderName}
                    </span>
                    {isElena && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--color-resp-assistant-bg)',
                          color: 'var(--color-primary)'
                        }}
                      >
                        Assistant
                      </span>
                    )}
                    {isMarcus && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--color-resp-client-bg)',
                          color: 'var(--color-resp-client)'
                        }}
                      >
                        Client
                      </span>
                    )}
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
                  fontWeight: 500,
                  flexShrink: 0
                }}
              >
                {formatMessageTime(msg.timestamp)}
              </div>
            </div>

            {/* Message Body */}
            <div
              style={{
                fontSize: '13.5px',
                color: 'var(--color-charcoal)',
                lineHeight: 1.65,
                whiteSpace: 'pre-line',
                wordBreak: 'break-word',
                paddingLeft: '42px'
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
