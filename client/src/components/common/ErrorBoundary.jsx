import React from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Relay ErrorBoundary] Uncaught runtime exception:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({
          error: this.state.error,
          reset: this.handleReset
        });
      }

      return (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: 'var(--color-bg)',
            minHeight: '320px'
          }}
        >
          <div
            style={{
              maxWidth: '460px',
              padding: '32px 28px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: 'var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-resp-review-bg)',
                color: 'var(--color-resp-review)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertCircle size={22} />
            </div>

            <div>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--color-charcoal)',
                  marginBottom: '6px'
                }}
              >
                {this.props.title || 'Unable to display conversation'}
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--color-charcoal-muted)',
                  lineHeight: 1.5,
                  margin: 0
                }}
              >
                {this.props.message ||
                  'An unexpected rendering issue occurred. You can safely return to your inbox without losing data.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                onClick={this.handleReset}
                className="relay-button secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={13} />
                <span>Try again</span>
              </button>
              {this.props.onBack && (
                <button
                  type="button"
                  onClick={this.props.onBack}
                  className="relay-button primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: 500,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft size={13} />
                  <span>Return to Inbox</span>
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
