import React from 'react';

/**
 * Reusable Swiss Minimalist Button
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 500,
    fontFamily: 'var(--font-body)',
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    whiteSpace: 'nowrap',
    textDecoration: 'none'
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '9px 16px', fontSize: '13px' },
    lg: { padding: '12px 22px', fontSize: '14px' }
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: '#FFFFFF',
      border: '1px solid var(--color-primary-dark)',
      boxShadow: 'var(--shadow-subtle)'
    },
    secondary: {
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-charcoal)',
      border: 'var(--border-subtle)',
      boxShadow: 'var(--shadow-subtle)'
    },
    sage: {
      backgroundColor: 'var(--color-sage)',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-sage-dark)'
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--color-charcoal)',
      border: 'var(--border-medium)'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-charcoal)',
      border: '1px solid transparent'
    },
    danger: {
      backgroundColor: 'var(--color-danger-bg)',
      color: 'var(--color-danger)',
      border: '1px solid rgba(192, 57, 43, 0.2)'
    }
  };

  const style = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant]
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`relay-button ${variant} ${className}`}
      {...props}
      style={{
        ...style,
        ...(props.style || {})
      }}
    >
      {loading ? (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }}
        />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} />}
        </>
      )}
    </button>
  );
}
