import React from 'react';

/**
 * Reusable Card Component
 * Emphasizes subtle borders and clean whitespace rather than heavy shadows.
 */
export default function Card({
  children,
  title,
  subtitle,
  action,
  className = '',
  style = {},
  onClick,
  hoverable = false
}) {
  return (
    <div
      className={`relay-card ${hoverable ? 'relay-card-interactive' : ''} ${className}`}
      onClick={onClick}
      style={{
        width: '100%',
        maxWidth: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-surface)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px',
        cursor: hoverable ? 'pointer' : 'default',
        ...style
      }}
    >
      {(title || subtitle || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px',
            borderBottom: 'var(--border-subtle)',
            paddingBottom: '12px'
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--color-charcoal)'
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '12px',
                  color: 'var(--color-charcoal-muted)'
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
