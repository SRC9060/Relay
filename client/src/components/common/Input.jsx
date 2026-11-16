import React from 'react';

/**
 * Reusable Form Input
 */
export default function Input({
  label,
  error,
  helperText,
  icon: Icon,
  endAdornment,
  type = 'text',
  className = '',
  id,
  style = {},
  ...props
}) {
  const inputId = id || `input_${label ? label.replace(/\s+/g, '_').toLowerCase() : Math.random().toString(36).substring(2, 9)}`;

  return (
    <div
      className={`relay-input-group ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        width: '100%',
        minWidth: 0,
        boxSizing: 'border-box',
        ...style
      }}
    >
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--color-charcoal)',
            display: 'block'
          }}
        >
          {label}
        </label>
      )}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          minWidth: 0,
          boxSizing: 'border-box'
        }}
      >
        {Icon && (
          <span
            style={{
              position: 'absolute',
              left: '11px',
              color: 'var(--color-charcoal-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}
          >
            <Icon size={15} />
          </span>
        )}
        <input
          id={inputId}
          type={type}
          style={{
            width: '100%',
            minWidth: 0,
            maxWidth: '100%',
            boxSizing: 'border-box',
            paddingLeft: Icon ? '34px' : '12px',
            paddingRight: endAdornment ? '38px' : '12px',
            paddingTop: '9px',
            paddingBottom: '9px',
            fontSize: '13px',
            backgroundColor: 'var(--color-surface)',
            border: error ? '1px solid var(--color-danger)' : 'var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-charcoal)',
            outline: 'none',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
          }}
          onFocus={(e) => {
            if (!error) {
              e.target.style.borderColor = 'var(--color-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(53, 75, 63, 0.12)';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.target.style.borderColor = 'rgba(41, 43, 41, 0.09)';
              e.target.style.boxShadow = 'none';
            }
          }}
          {...props}
        />
        {endAdornment && (
          <div
            style={{
              position: 'absolute',
              right: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            {endAdornment}
          </div>
        )}
      </div>
      {error ? (
        <span style={{ fontSize: '11px', color: 'var(--color-danger)' }}>{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>{helperText}</span>
      ) : null}
    </div>
  );
}
