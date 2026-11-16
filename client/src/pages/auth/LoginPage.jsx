import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import AuthVisualStage from '../../components/auth/AuthVisualStage';
import {
  Mail,
  Lock,
  ArrowRight,
  UserCheck,
  UserRound,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    try {
      const loggedUser = await login({ email });
      if (loggedUser?.role === 'client') {
        navigate('/client');
      } else {
        navigate('/app/overview');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    try {
      const loggedUser = await login({ role });
      if (loggedUser?.role === 'client' || role === 'client') {
        navigate('/client');
      } else {
        navigate('/app/overview');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    }
  };

  return (
    <div className="relay-auth-split">
      {/* Left Column: 3D Email Intelligence & Triage Stage */}
      <AuthVisualStage />

      {/* Right Column: Refined Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '460px',
          margin: '0 auto'
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-card)',
            padding: '36px 32px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle top primary accent line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              backgroundColor: 'var(--color-primary)'
            }}
          />

          <div style={{ marginBottom: '22px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-surface-subtle)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                border: 'var(--border-subtle)'
              }}
            >
              Executive Access
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--color-charcoal)',
                letterSpacing: '-0.02em',
                marginTop: '10px',
                marginBottom: '4px'
              }}
            >
              Sign in to Relay
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-charcoal-muted)' }}>
              Collaborative correspondence workspace for assistants and principals
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: '10px 14px',
                  backgroundColor: 'var(--color-danger-bg)',
                  color: 'var(--color-danger)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  border: '1px solid rgba(192, 57, 43, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Demo Fast Access Box */}
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--color-surface-subtle)',
              borderRadius: 'var(--radius-lg)',
              border: 'var(--border-subtle)',
              marginBottom: '20px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} color="var(--color-primary)" />
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: 'var(--color-charcoal)'
                  }}
                >
                  Instant demo personas
                </span>
              </div>
              <span className="keycap">No password</span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '10px'
              }}
            >
              <button
                type="button"
                onClick={() => handleDemoLogin('assistant')}
                disabled={loading}
                className="auth-persona-btn"
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1.5px solid var(--color-resp-assistant-border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <UserCheck size={14} color="var(--color-primary)" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
                    Assistant
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                  Ananya Sharma
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('client')}
                disabled={loading}
                className="auth-persona-btn"
                style={{
                  padding: '10px 12px',
                  backgroundColor: 'var(--color-surface)',
                  border: '1.5px solid var(--color-resp-client-border)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <UserRound size={14} color="var(--color-resp-client)" />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-resp-client)' }}>
                    Client
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                  Arjun Mehta
                </div>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '18px 0',
              fontSize: '11.5px',
              color: 'var(--color-charcoal-muted)'
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            <span>or sign in with credentials</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ananya.sharma@relay-assistant.in"
              autoComplete="username"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              endAdornment={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px' }}>
              <span
                style={{
                  fontSize: '11.5px',
                  color: 'var(--color-charcoal-muted)',
                  cursor: 'pointer',
                  transition: 'color var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-charcoal-muted)')}
              >
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              iconPosition="right"
              style={{
                width: '100%',
                marginTop: '6px',
                padding: '11px 20px',
                fontSize: '14px',
                fontWeight: 600
              }}
            >
              Sign in to workspace
            </Button>
          </form>

          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '12.5px',
              color: 'var(--color-charcoal-muted)'
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: 'var(--color-primary)',
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: '1px solid var(--color-primary)'
              }}
            >
              Create workspace
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
