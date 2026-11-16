import React from 'react';

/**
 * Responsibility & Status Badge
 * Supports the 4 core AI responsibility classifications:
 * - Assistant to Reply
 * - Client to Reply
 * - No Reply Needed
 * - Needs Review
 */
export default function Badge({
  type = 'neutral',
  label,
  children,
  size = 'md',
  dot = false,
  className = ''
}) {
  const typeMap = {
    assistant: {
      color: 'var(--color-resp-assistant)',
      bg: 'var(--color-resp-assistant-bg)',
      border: 'var(--color-resp-assistant-border)',
      defaultLabel: 'Assistant to Reply'
    },
    client: {
      color: 'var(--color-resp-client)',
      bg: 'var(--color-resp-client-bg)',
      border: 'var(--color-resp-client-border)',
      defaultLabel: 'Client to Reply'
    },
    none: {
      color: 'var(--color-resp-none)',
      bg: 'var(--color-resp-none-bg)',
      border: 'var(--color-resp-none-border)',
      defaultLabel: 'No Reply Needed'
    },
    review: {
      color: 'var(--color-resp-review)',
      bg: 'var(--color-resp-review-bg)',
      border: 'var(--color-resp-review-border)',
      defaultLabel: 'Needs Review'
    },
    neutral: {
      color: 'var(--color-charcoal-muted)',
      bg: 'var(--color-surface-subtle)',
      border: 'rgba(41, 43, 41, 0.08)',
      defaultLabel: ''
    },
    success: {
      color: 'var(--color-success)',
      bg: 'var(--color-success-bg)',
      border: 'rgba(42, 110, 78, 0.2)',
      defaultLabel: 'Active'
    }
  };

  const current = typeMap[type] || typeMap.neutral;
  const content = children || label || current.defaultLabel;

  const sizeStyles = {
    sm: { padding: '2px 7px', fontSize: '11px' },
    md: { padding: '3px 9px', fontSize: '12px' }
  };

  return (
    <span
      className={`relay-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        borderRadius: 'var(--radius-full)',
        color: current.color,
        backgroundColor: current.bg,
        border: `1px solid ${current.border}`,
        lineHeight: 1.3,
        whiteSpace: 'nowrap',
        ...sizeStyles[size]
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: current.color
          }}
        />
      )}
      {content}
    </span>
  );
}
