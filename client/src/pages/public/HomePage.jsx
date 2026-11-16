import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  UserCheck,
  UserRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Mail,
  Clock,
  Layers,
  ArrowUpRight,
  Inbox,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

/**
 * Sophisticated 3D Tilt Card Component
 * Provides fluid cursor tracking, depth layering, perspective tilt,
 * and graceful spring return.
 */
function TiltCard({
  children,
  maxTilt = 4,
  style = {},
  className = '',
  hoverBorderColor,
  hoverShadow,
  hoverBg,
  onClick,
  containerStyle = {},
  accentLine = false,
  accentColor = 'var(--color-primary)'
}) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 900) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setTilt({ x: x * maxTilt, y: y * maxTilt });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: '1000px',
        width: '100%',
        ...containerStyle
      }}
    >
      <motion.div
        animate={{
          rotateX: -tilt.y,
          rotateY: tilt.x,
          y: isHovered ? -5 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 240,
          damping: 24,
          mass: 0.5
        }}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'border-color 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          ...style,
          borderColor: isHovered && hoverBorderColor ? hoverBorderColor : style.borderColor,
          boxShadow: isHovered && hoverShadow ? hoverShadow : style.boxShadow,
          backgroundColor: isHovered && hoverBg ? hoverBg : style.backgroundColor
        }}
        className={className}
      >
        {accentLine && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: isHovered ? '4px' : '3px',
              backgroundColor: accentColor,
              transition: 'height 0.2s ease, background-color 0.2s ease',
              borderTopLeftRadius: 'inherit',
              borderTopRightRadius: 'inherit'
            }}
          />
        )}
        {typeof children === 'function' ? children({ isHovered, tilt }) : children}
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user, login, isAuthenticated } = useAuth();
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0); // 0: Client, 1: Assistant, 2: Info
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Only apply 3D tilt on wider desktop screens
    if (window.innerWidth < 900) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setTilt({ x: x * 6, y: y * 4.5 }); // Smooth, controlled parallax
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleLaunchDemo = async (role) => {
    setIsLoggingIn(true);
    try {
      await login({ role });
      setShowDemoModal(false);
      if (role === 'client') {
        navigate('/client');
      } else {
        navigate('/app/overview');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    const el = document.getElementById('how-it-works');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        color: 'var(--color-charcoal)',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden'
      }}
    >
      {/* 1. Public Top Navigation */}
      <header
        style={{
          height: '68px',
          backgroundColor: 'rgba(247, 246, 241, 0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: 'var(--border-subtle)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px'
        }}
      >
        {/* Brand */}
        <Link to="/" className="brand-link" style={{ textDecoration: 'none' }}>
          <div
            className="brand-icon-box"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '-0.02em'
            }}
          >
            R
          </div>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '18px',
              color: 'var(--color-charcoal)',
              letterSpacing: '-0.02em'
            }}
          >
            Relay
          </span>
        </Link>

        {/* Center Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '13.5px',
            fontWeight: 500,
            color: 'var(--color-charcoal-muted)'
          }}
          className="desktop-only"
        >
          <a href="#product" className="public-nav-link" style={{ textDecoration: 'none' }}>
            Product
          </a>
          <a href="#how-it-works" onClick={scrollToHowItWorks} className="public-nav-link" style={{ textDecoration: 'none' }}>
            How it works
          </a>
          <a href="#roles" className="public-nav-link" style={{ textDecoration: 'none' }}>
            For Assistants & Clients
          </a>
        </nav>

        {/* Right CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate(user?.role === 'client' ? '/client' : '/app/overview')}
            >
              Enter Workspace
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                className="public-nav-link"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                Sign in
              </Link>
              <Button
                variant="primary"
                size="sm"
                icon={Sparkles}
                iconPosition="right"
                onClick={() => setShowDemoModal(true)}
              >
                Explore demo
              </Button>
            </>
          )}
        </div>
      </header>

      {/* 2. Hero Section */}
      <section
        id="product"
        style={{
          padding: '72px 24px 48px',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Subtle pill tag */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-surface-subtle)',
            border: 'var(--border-subtle)',
            fontSize: '11.5px',
            fontWeight: 600,
            color: 'var(--color-primary)',
            marginBottom: '20px',
            letterSpacing: '0.02em'
          }}
        >
          <ShieldCheck size={13} color="var(--color-primary)" />
          AI-Powered Email Management for Assistants & Clients
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px, 5.5vw, 54px)',
            fontWeight: 700,
            color: 'var(--color-charcoal)',
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '860px',
            marginBottom: '18px'
          }}
        >
          Every conversation. The right person to respond.
        </h1>

        {/* Supporting description */}
        <p
          style={{
            fontSize: 'clamp(15px, 2vw, 17px)',
            color: 'var(--color-charcoal-muted)',
            lineHeight: 1.6,
            maxWidth: '680px',
            marginBottom: '32px'
          }}
        >
          Relay helps personal assistants manage client communication by identifying who needs to respond,
          organizing important conversations, and keeping everyone on the same page.
        </p>

        {/* Action CTAs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '52px'
          }}
        >
          <Button
            variant="primary"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={() => setShowDemoModal(true)}
            style={{ padding: '12px 28px', fontSize: '14.5px', fontWeight: 600 }}
          >
            Explore demo
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={scrollToHowItWorks}
            style={{ padding: '12px 24px', fontSize: '14.5px' }}
          >
            See how it works
          </Button>
        </div>

        {/* 3. Hero Visual: Premium Interactive 3D Layered Product Stage */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            width: '100%',
            maxWidth: '1100px',
            perspective: '1200px',
            textAlign: 'left',
            padding: '10px 0'
          }}
        >
          <motion.div
            animate={{
              rotateX: -tilt.y,
              rotateY: tilt.x
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.5 }}
            style={{
              transformStyle: 'preserve-3d',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Top Floating AI Triage Intelligence Bridge */}
            <motion.div
              style={{
                transform: 'translateZ(32px)',
                backgroundColor: 'rgba(255, 255, 255, 0.96)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 12px 28px -6px rgba(41, 45, 41, 0.08), 0 2px 6px rgba(41, 45, 41, 0.04)',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    display: 'inline-block'
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-charcoal)' }}>
                  Relay Autonomous Routing Engine
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                  • 98.4% Confidence Precision across 17 Active Threads
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--color-surface-subtle)',
                    color: 'var(--color-primary)'
                  }}
                >
                  3 Elena • 2 Marcus • 1 Archived
                </span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-xs)',
                    backgroundColor: 'var(--color-success-bg)',
                    color: 'var(--color-success)'
                  }}
                >
                  Live Simulated
                </span>
              </div>
            </motion.div>

            {/* 3D Layered Conversation Cards Stage */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '20px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Card 1: Client to Reply (Governance) */}
              <motion.div
                onClick={() => setActiveCardIndex(0)}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transform: activeCardIndex === 0 ? 'translateZ(26px)' : 'translateZ(8px)',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: activeCardIndex === 0 ? '2px solid var(--color-resp-client)' : '1px solid var(--border-subtle)',
                  boxShadow: activeCardIndex === 0
                    ? '0 24px 48px -12px rgba(181, 121, 72, 0.2), 0 2px 6px rgba(41, 45, 41, 0.04)'
                    : '0 8px 24px -6px rgba(41, 45, 41, 0.06), 0 1px 3px rgba(41, 45, 41, 0.03)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-charcoal-muted)' }}>
                    GOVERNANCE & APPROVALS
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-resp-client-bg)',
                        color: 'var(--color-resp-client)',
                        border: '1px solid var(--color-resp-client-border)'
                      }}
                    >
                      Client to Reply
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-resp-client)' }}>
                      98%
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-charcoal)', lineHeight: 1.3 }}>
                    Board Resolution: Series B Written Consent
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)', marginTop: '2px' }}>
                    David Sterling &lt;d.sterling@sterling-ventures.com&gt; • Board Chairman
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--color-resp-client-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-resp-client-border)',
                    fontSize: '12px',
                    color: '#7D470F',
                    lineHeight: 1.5
                  }}
                >
                  <strong style={{ fontWeight: 700 }}>AI Reasoning:</strong> Formal corporate governance action requiring statutory written consent and managing partner signature from Marcus Vance.
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
                    2 turns • 2 hours ago
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-resp-client)' }}>
                    Queued in Marcus's Decision Desk →
                  </span>
                </div>
              </motion.div>

              {/* Card 2: Assistant to Reply (Travel & Logistics) */}
              <motion.div
                onClick={() => setActiveCardIndex(1)}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transform: activeCardIndex === 1 ? 'translateZ(26px)' : 'translateZ(8px)',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: activeCardIndex === 1 ? '2px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                  boxShadow: activeCardIndex === 1
                    ? '0 24px 48px -12px rgba(53, 75, 63, 0.2), 0 2px 6px rgba(41, 45, 41, 0.04)'
                    : '0 8px 24px -6px rgba(41, 45, 41, 0.06), 0 1px 3px rgba(41, 45, 41, 0.03)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-charcoal-muted)' }}>
                    TRAVEL & SCHEDULING
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-resp-assistant-bg)',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-resp-assistant-border)'
                      }}
                    >
                      Assistant to Reply
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-primary)' }}>
                      96%
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-charcoal)', lineHeight: 1.3 }}>
                    London Technology Summit: Suite & Transfers
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)', marginTop: '2px' }}>
                    Clara Hayes &lt;clara.hayes@summits-london.org&gt; • Summit Coordinator
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--color-resp-assistant-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-resp-assistant-border)',
                    fontSize: '12px',
                    color: 'var(--color-primary)',
                    lineHeight: 1.5
                  }}
                >
                  <strong style={{ fontWeight: 700 }}>AI Reasoning:</strong> Chauffeur airport logistics and VIP dietary confirmations fall squarely within executive assistant responsibilities.
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
                    1 turn • 4 hours ago
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Draft Prepared for Elena's Review →
                  </span>
                </div>
              </motion.div>

              {/* Card 3: No Reply Needed (Informational Brief) */}
              <motion.div
                onClick={() => setActiveCardIndex(2)}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  transform: activeCardIndex === 2 ? 'translateZ(26px)' : 'translateZ(8px)',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-xl)',
                  border: activeCardIndex === 2 ? '2px solid var(--color-resp-none)' : '1px solid var(--border-subtle)',
                  boxShadow: activeCardIndex === 2
                    ? '0 24px 48px -12px rgba(107, 112, 107, 0.2), 0 2px 6px rgba(41, 45, 41, 0.04)'
                    : '0 8px 24px -6px rgba(41, 45, 41, 0.06), 0 1px 3px rgba(41, 45, 41, 0.03)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--color-charcoal-muted)' }}>
                    INFORMATIONAL
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '3px 9px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'var(--color-resp-none-bg)',
                        color: 'var(--color-resp-none)',
                        border: '1px solid var(--color-resp-none-border)'
                      }}
                    >
                      No Reply Needed
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-resp-none)' }}>
                      99%
                    </span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-charcoal)', lineHeight: 1.3 }}>
                    Bloomberg Markets: European VC & Sovereign Flows
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)', marginTop: '2px' }}>
                    Bloomberg Briefs &lt;briefs@bloomberg.net&gt; • Market Dispatch
                  </div>
                </div>

                <div
                  style={{
                    padding: '12px 14px',
                    backgroundColor: 'var(--color-resp-none-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-resp-none-border)',
                    fontSize: '12px',
                    color: 'var(--color-charcoal-muted)',
                    lineHeight: 1.5
                  }}
                >
                  <strong style={{ fontWeight: 700 }}>AI Reasoning:</strong> Automated intelligence newsletter and market analysis. Zero action, reply, or delegation required.
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
                    Automated • Yesterday
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>
                    Archived Automatically
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          padding: '80px 24px',
          backgroundColor: '#FFFFFF',
          borderTop: 'var(--border-subtle)',
          borderBottom: 'var(--border-subtle)'
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '52px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'var(--color-primary)'
              }}
            >
              Workflow Architecture
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(26px, 3.5vw, 36px)',
                fontWeight: 700,
                color: 'var(--color-charcoal)',
                marginTop: '8px',
                letterSpacing: '-0.02em'
              }}
            >
              Three steps to seamless correspondence
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {/* Step 1 */}
            <TiltCard
              maxTilt={4}
              hoverBorderColor="rgba(53, 75, 63, 0.45)"
              hoverShadow="0 22px 44px -10px rgba(53, 75, 63, 0.15), 0 2px 8px rgba(41, 45, 41, 0.04)"
              style={{
                padding: '30px 26px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                cursor: 'pointer',
                height: '100%'
              }}
              onClick={() => setShowDemoModal(true)}
            >
              {({ isHovered }) => (
                <>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isHovered ? 'var(--color-resp-assistant-bg)' : 'var(--color-surface-subtle)',
                      border: isHovered ? '1px solid var(--color-primary)' : 'var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      transform: isHovered ? 'translateZ(20px) scale(1.08)' : 'translateZ(0px) scale(1)',
                      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    1
                  </div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: isHovered ? 'var(--color-primary)' : 'var(--color-charcoal)',
                      transform: isHovered ? 'translateZ(14px)' : 'translateZ(0px)',
                      transition: 'all 0.22s ease'
                    }}
                  >
                    Connect email accounts
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-charcoal-muted)',
                      lineHeight: 1.6,
                      transform: isHovered ? 'translateZ(8px)' : 'translateZ(0px)',
                      transition: 'transform 0.22s ease'
                    }}
                  >
                    Integrate Google Workspace and Microsoft 365. Relay monitors incoming correspondence across personal and organizational inboxes simultaneously.
                  </p>
                </>
              )}
            </TiltCard>

            {/* Step 2 */}
            <TiltCard
              maxTilt={4}
              hoverBorderColor="rgba(53, 75, 63, 0.45)"
              hoverShadow="0 22px 44px -10px rgba(53, 75, 63, 0.15), 0 2px 8px rgba(41, 45, 41, 0.04)"
              style={{
                padding: '30px 26px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                cursor: 'pointer',
                height: '100%'
              }}
              onClick={() => setShowDemoModal(true)}
            >
              {({ isHovered }) => (
                <>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isHovered ? 'var(--color-resp-assistant-bg)' : 'var(--color-surface-subtle)',
                      border: isHovered ? '1px solid var(--color-primary)' : 'var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      transform: isHovered ? 'translateZ(20px) scale(1.08)' : 'translateZ(0px) scale(1)',
                      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    2
                  </div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: isHovered ? 'var(--color-primary)' : 'var(--color-charcoal)',
                      transform: isHovered ? 'translateZ(14px)' : 'translateZ(0px)',
                      transition: 'all 0.22s ease'
                    }}
                  >
                    Let AI classify responsibility
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-charcoal-muted)',
                      lineHeight: 1.6,
                      transform: isHovered ? 'translateZ(8px)' : 'translateZ(0px)',
                      transition: 'transform 0.22s ease'
                    }}
                  >
                    Relay evaluates the entire thread context to determine whether an email requires client authority, assistant action, or no response.
                  </p>
                </>
              )}
            </TiltCard>

            {/* Step 3 */}
            <TiltCard
              maxTilt={4}
              hoverBorderColor="rgba(53, 75, 63, 0.45)"
              hoverShadow="0 22px 44px -10px rgba(53, 75, 63, 0.15), 0 2px 8px rgba(41, 45, 41, 0.04)"
              style={{
                padding: '30px 26px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                cursor: 'pointer',
                height: '100%'
              }}
              onClick={() => setShowDemoModal(true)}
            >
              {({ isHovered }) => (
                <>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isHovered ? 'var(--color-resp-assistant-bg)' : 'var(--color-surface-subtle)',
                      border: isHovered ? '1px solid var(--color-primary)' : 'var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      transform: isHovered ? 'translateZ(20px) scale(1.08)' : 'translateZ(0px) scale(1)',
                      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    3
                  </div>
                  <h3
                    style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: isHovered ? 'var(--color-primary)' : 'var(--color-charcoal)',
                      transform: isHovered ? 'translateZ(14px)' : 'translateZ(0px)',
                      transition: 'all 0.22s ease'
                    }}
                  >
                    Take the right action
                  </h3>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--color-charcoal-muted)',
                      lineHeight: 1.6,
                      transform: isHovered ? 'translateZ(8px)' : 'translateZ(0px)',
                      transition: 'transform 0.22s ease'
                    }}
                  >
                    Assistants draft and review replies; clients review their dedicated queue to sign off or delegate in two clicks.
                  </p>
                </>
              )}
            </TiltCard>
          </div>
        </div>
      </motion.section>

      {/* 5. Two-User Experience Section */}
      <motion.section
        id="roles"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          padding: '80px 24px',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-primary)'
            }}
          >
            Dual Experiences
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(26px, 3.5vw, 36px)',
              fontWeight: 700,
              color: 'var(--color-charcoal)',
              marginTop: '8px',
              letterSpacing: '-0.02em'
            }}
          >
            Built for assistants and clients to work as one
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}
        >
          {/* For Assistants Card */}
          <TiltCard
            maxTilt={3.5}
            hoverBorderColor="var(--color-primary)"
            hoverShadow="0 24px 50px -12px rgba(53, 75, 63, 0.22), 0 2px 8px rgba(41, 45, 41, 0.04)"
            style={{
              padding: '36px 32px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--color-resp-assistant-border)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%'
            }}
          >
            {({ isHovered }) => (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transform: isHovered ? 'translateZ(18px)' : 'translateZ(0px)',
                    transition: 'transform 0.22s ease'
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isHovered ? 'var(--color-primary)' : 'var(--color-resp-assistant-bg)',
                      color: isHovered ? '#FFFFFF' : 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.22s ease'
                    }}
                  >
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>For Personal Assistants</h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)' }}>Demo Persona: Elena Rostova</div>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '13.5px',
                    color: 'var(--color-charcoal)',
                    lineHeight: 1.6,
                    transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)',
                    transition: 'transform 0.22s ease'
                  }}
                >
                  Manage incoming volume with total clarity. Review AI responsibility triage, override classifications when context demands, verify summaries, and draft contextual replies for human review.
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    fontSize: '13px',
                    transform: isHovered ? 'translateZ(12px)' : 'translateZ(0px)',
                    transition: 'transform 0.22s ease'
                  }}
                >
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={15} color="var(--color-primary)" />
                    <span>Executive overview answering "What needs attention today?"</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={15} color="var(--color-primary)" />
                    <span>Single-conversation focused reader with AI draft composer</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={15} color="var(--color-primary)" />
                    <span>Human override protection against incoming email changes</span>
                  </li>
                </ul>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    transform: isHovered ? 'translateZ(24px)' : 'translateZ(0px)',
                    transition: 'transform 0.22s ease'
                  }}
                >
                  <Button
                    variant="primary"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => handleLaunchDemo('assistant')}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    Launch Assistant Demo (Elena)
                  </Button>
                </div>
              </>
            )}
          </TiltCard>

          {/* For Clients Card */}
          <TiltCard
            maxTilt={3.5}
            hoverBorderColor="var(--color-resp-client)"
            hoverShadow="0 24px 50px -12px rgba(181, 121, 72, 0.22), 0 2px 8px rgba(41, 45, 41, 0.04)"
            style={{
              padding: '36px 32px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              border: '1.5px solid var(--color-resp-client-border)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%'
            }}
          >
            {({ isHovered }) => (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transform: isHovered ? 'translateZ(18px)' : 'translateZ(0px)',
                    transition: 'transform 0.22s ease'
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isHovered ? 'var(--color-resp-client)' : 'var(--color-resp-client-bg)',
                      color: isHovered ? '#FFFFFF' : 'var(--color-resp-client)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 0.22s ease'
                    }}
                  >
                    <UserRound size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600 }}>For Busy Clients</h3>
                    <div style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)' }}>Demo Persona: Marcus Vance</div>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: '13.5px',
                    color: 'var(--color-charcoal)',
                    lineHeight: 1.6,
                    transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)',
                    transition: 'transform 0.22s ease'
                  }}
                >
                  A calm, distraction-free queue showing only items requiring personal statutory consent, advisory feedback, or executive decisions. Routine logistics remain shielded.
                </p>

                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '8px 0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    fontSize: '13px',
                    transform: isHovered ? 'translateZ(12px)' : 'translateZ(0px)',
                    transition: 'transform 0.22s ease'
                  }}
                >
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={15} color="var(--color-resp-client)" />
                    <span>Distraction-free attention queue with explicit action reasons</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={15} color="var(--color-resp-client)" />
                    <span>One-click "Mark as Handled" to resolve and clear the item</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={15} color="var(--color-resp-client)" />
                    <span>"Ask Assistant to Take Over" delegation with pre-composed directives</span>
                  </li>
                </ul>

                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    transform: isHovered ? 'translateZ(24px)' : 'translateZ(0px)',
                    transition: 'transform 0.22s ease'
                  }}
                >
                  <Button
                    variant="secondary"
                    size="md"
                    icon={ArrowRight}
                    iconPosition="right"
                    onClick={() => handleLaunchDemo('client')}
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      borderColor: 'var(--color-resp-client-border)',
                      color: 'var(--color-resp-client)'
                    }}
                  >
                    Launch Client Demo (Marcus)
                  </Button>
                </div>
              </>
            )}
          </TiltCard>
        </div>
      </motion.section>

      {/* 6. Refined Prototype Callout Card */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{
          padding: '56px 24px 72px',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        <TiltCard
          maxTilt={3}
          accentLine={true}
          accentColor="var(--color-primary)"
          hoverBorderColor="rgba(53, 75, 63, 0.35)"
          hoverShadow="0 26px 54px -12px rgba(41, 45, 41, 0.14), 0 4px 14px rgba(41, 45, 41, 0.05)"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-card)',
            padding: '52px 36px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '18px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {({ isHovered }) => (
            <>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                  backgroundColor: isHovered ? 'var(--color-resp-assistant-bg)' : 'var(--color-surface-subtle)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: isHovered ? '1px solid var(--color-primary)' : 'var(--border-subtle)',
                  transform: isHovered ? 'translateZ(16px)' : 'translateZ(0px)',
                  transition: 'all 0.22s ease'
                }}
              >
                Interactive Prototype
              </span>

              <h2
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(24px, 3.2vw, 34px)',
                  fontWeight: 700,
                  color: 'var(--color-charcoal)',
                  letterSpacing: '-0.02em',
                  maxWidth: '640px',
                  margin: 0,
                  transform: isHovered ? 'translateZ(22px)' : 'translateZ(0px)',
                  transition: 'transform 0.22s ease'
                }}
              >
                Ready to inspect the prototype?
              </h2>

              <p
                style={{
                  fontSize: '14.5px',
                  color: 'var(--color-charcoal-muted)',
                  lineHeight: 1.6,
                  maxWidth: '560px',
                  margin: 0,
                  transform: isHovered ? 'translateZ(12px)' : 'translateZ(0px)',
                  transition: 'transform 0.22s ease'
                }}
              >
                Experience Relay's dual-workspace architecture with realistic executive data and contextual email intelligence.
              </p>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginTop: '8px',
                  transform: isHovered ? 'translateZ(26px)' : 'translateZ(0px)',
                  transition: 'transform 0.22s ease'
                }}
              >
                <Button
                  variant="primary"
                  size="lg"
                  icon={Sparkles}
                  iconPosition="right"
                  onClick={() => setShowDemoModal(true)}
                  style={{ padding: '11px 26px', fontSize: '14px', fontWeight: 600 }}
                >
                  Explore live demo
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate('/login')}
                  style={{ padding: '11px 22px', fontSize: '14px' }}
                >
                  Sign in with credentials
                </Button>
              </div>
            </>
          )}
        </TiltCard>
      </motion.section>

      {/* 7. Dedicated Professional Product Footer */}
      <footer
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: 'var(--border-subtle)',
          padding: '64px 32px 32px 32px',
          color: 'var(--color-charcoal)'
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '48px'
          }}
        >
          {/* Top Row: Brand & Multi-Column Navigation */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '40px'
            }}
          >
            {/* Column 1: Brand & Executive Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '320px' }}>
              <Link to="/" className="brand-link" style={{ textDecoration: 'none' }}>
                <div
                  className="brand-icon-box"
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                    letterSpacing: '-0.02em'
                  }}
                >
                  R
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '18px',
                    color: 'var(--color-charcoal)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Relay
                </span>
              </Link>
              <p style={{ fontSize: '12.5px', color: 'var(--color-charcoal-muted)', lineHeight: 1.6 }}>
                AI-powered executive correspondence platform for personal assistants and principals. Grounded triage, dual-workspace synchronization, and human-in-the-loop control.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-success)',
                    display: 'inline-block'
                  }}
                />
                <span style={{ fontSize: '11.5px', color: 'var(--color-charcoal-muted)' }}>
                  Relay Demo Environment
                </span>
              </div>
            </div>

            {/* Column 2: Product Architecture */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-charcoal)' }}>
                Product
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
                <a href="#product" className="footer-link">Autonomous Triage</a>
                <a href="#how-it-works" onClick={scrollToHowItWorks} className="footer-link">Workflow Engine</a>
                <a href="#roles" className="footer-link">Dual Workspaces</a>
                <span onClick={() => setShowDemoModal(true)} className="footer-link" style={{ cursor: 'pointer' }}>
                  Interactive Simulator
                </span>
              </div>
            </div>

            {/* Column 3: Workspaces */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-charcoal)' }}>
                Workspaces
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
                <Link to="/app/overview" className="footer-link">Assistant Overview</Link>
                <Link to="/app/inbox" className="footer-link">Unified Inbox</Link>
                <Link to="/app/ai-assistant" className="footer-link">Executive Copilot</Link>
                <Link to="/client" className="footer-link">Client Decision Desk</Link>
                <Link to="/app/accounts" className="footer-link">Connected Mailboxes</Link>
              </div>
            </div>

            {/* Column 4: Access & Protocol */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-charcoal)' }}>
                Protocol & Access
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '13px' }}>
                <Link to="/login" className="footer-link">Assistant Sign In</Link>
                <Link to="/signup" className="footer-link">Create Workspace</Link>
                <button
                  type="button"
                  onClick={() => handleLaunchDemo('client')}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', font: 'inherit', cursor: 'pointer' }}
                >
                  Marcus Vance Client View
                </button>
                <button
                  type="button"
                  onClick={() => handleLaunchDemo('assistant')}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', font: 'inherit', cursor: 'pointer' }}
                >
                  Elena Rostova Assistant View
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Row: Subtle Divider & Legal / Precision Meta */}
          <div
            style={{
              paddingTop: '24px',
              borderTop: 'var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '12px',
              color: 'var(--color-charcoal-muted)'
            }}
          >
            <div>
              © 2026 Relay. All rights reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span className="keycap">Demo environment</span>
              <span className="keycap">Human Override Available</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Selection Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              backgroundColor: 'rgba(25, 39, 32, 0.55)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              style={{
                width: '100%',
                maxWidth: '480px',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: 'var(--border-subtle)',
                boxShadow: 'var(--shadow-modal)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 600 }}>Select Demo Persona</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)' }}>
                    Instant access without passwords
                  </p>
                </div>
                <button
                  onClick={() => setShowDemoModal(false)}
                  style={{ padding: '6px', cursor: 'pointer', color: 'var(--color-charcoal-muted)' }}
                  aria-label="Close modal"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  disabled={isLoggingIn}
                  onClick={() => handleLaunchDemo('assistant')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-resp-assistant-border)',
                    backgroundColor: 'var(--color-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-resp-assistant-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-primary)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ER
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-primary)' }}>
                        Elena Rostova (Executive Assistant)
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-charcoal-muted)' }}>
                        Full triage inbox, AI drafting, Copilot & overview
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--color-primary)" />
                </button>

                <button
                  type="button"
                  disabled={isLoggingIn}
                  onClick={() => handleLaunchDemo('client')}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1.5px solid var(--color-resp-client-border)',
                    backgroundColor: 'var(--color-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-resp-client-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-resp-client)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      MV
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-resp-client)' }}>
                        Marcus Vance (Managing Partner)
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-charcoal-muted)' }}>
                        Executive attention queue, Mark Handled & delegation
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} color="var(--color-resp-client)" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
