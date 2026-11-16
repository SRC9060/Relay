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
  User,
  ArrowRight,
  UserCheck,
  UserRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('assistant');
  const [error, setError] = useState('');

  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Name and email are required');
      return;
    }
    setError('');
    try {
      await signup({ name, email, role });
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Signup failed');
    }
  };

  return (
    <div className="relay-auth-split">
      {/* Left Column: 3D Email Intelligence & Triage Stage */}
      <AuthVisualStage />

      {/* Right Column: Refined Registration Card */}
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
              Workspace Registration
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
              Create your workspace
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-charcoal-muted)' }}>
              Collaborative email intelligence for executive assistants and principals
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

          {/* Role Selection */}
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--color-charcoal)',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Select your workspace role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRole('assistant')}
                className={`auth-role-select-card ${role === 'assistant' ? 'active' : ''}`}
                style={{
                  padding: '12px 10px',
                  backgroundColor: role === 'assistant' ? 'var(--color-resp-assistant-bg)' : 'var(--color-surface)',
                  border: role === 'assistant' ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserCheck size={14} color="var(--color-primary)" />
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-primary)' }}>
                      Assistant
                    </span>
                  </div>
                  {role === 'assistant' && (
                    <CheckCircle2 size={13} color="var(--color-primary)" />
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)', lineHeight: 1.4 }}>
                  Email triage, drafting & calendar
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('client')}
                className={`auth-role-select-card ${role === 'client' ? 'active' : ''}`}
                style={{
                  padding: '12px 10px',
                  backgroundColor: role === 'client' ? 'var(--color-resp-client-bg)' : 'var(--color-surface)',
                  border: role === 'client' ? '2px solid var(--color-resp-client)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <UserRound size={14} color="var(--color-resp-client)" />
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-resp-client)' }}>
                      Client
                    </span>
                  </div>
                  {role === 'client' && (
                    <CheckCircle2 size={13} color="var(--color-resp-client)" />
                  )}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)', lineHeight: 1.4 }}>
                  Attention queue of personal decisions
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Full name"
              type="text"
              icon={User}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Sharma"
              required
              autoComplete="name"
            />

            <Input
              label="Email address"
              type="email"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ananya@mehtaventures.in"
              required
              autoComplete="email"
            />

            <div>
              <Input
                label="Create password"
                type={showPassword ? 'text' : 'password'}
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
                autoComplete="new-password"
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
              {password && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginTop: '5px',
                    fontSize: '11px',
                    color: isPasswordValid ? 'var(--color-success)' : 'var(--color-charcoal-muted)'
                  }}
                >
                  <CheckCircle2 size={12} color={isPasswordValid ? 'var(--color-success)' : 'var(--color-charcoal-muted)'} />
                  <span>{isPasswordValid ? 'Password meets minimum length' : 'Minimum 6 characters'}</span>
                </div>
              )}
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
              Continue to email connection
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
            Already have a workspace?{' '}
            <Link
              to="/login"
              style={{
                color: 'var(--color-primary)',
                fontWeight: 600,
                textDecoration: 'none',
                borderBottom: '1px solid var(--color-primary)'
              }}
            >
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
