import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  UserCheck,
  UserRound,
  Mail,
  ArrowRight
} from 'lucide-react';

export default function AuthVisualStage() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.innerWidth < 992) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setTilt({ x: x * 5.5, y: y * 4 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relay-auth-visual-desktop"
      style={{
        perspective: '1200px',
        width: '100%',
        maxWidth: '560px'
      }}
    >
      <motion.div
        animate={{
          rotateX: -tilt.y,
          rotateY: tilt.x
        }}
        transition={{
          type: 'spring',
          stiffness: 140,
          damping: 20,
          mass: 0.6
        }}
        style={{
          transformStyle: 'preserve-3d',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '12px 0'
        }}
      >
        {/* Floating Autonomous Triage Banner */}
        <motion.div
          style={{
            transform: 'translateZ(36px)',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 12px 28px -6px rgba(41, 45, 41, 0.08), 0 2px 6px rgba(41, 45, 41, 0.04)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--color-surface-subtle)',
                color: 'var(--color-primary)'
              }}
            >
              98.4% Confidence
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                padding: '2px 7px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--color-success-bg)',
                color: 'var(--color-success)'
              }}
            >
              Synchronized
            </span>
          </div>
        </motion.div>

        {/* Card 1: Client Attention Card (Marcus Vance) */}
        <motion.div
          style={{
            transform: 'translateZ(26px)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-resp-client-border)',
            boxShadow: '0 20px 42px -12px rgba(181, 121, 72, 0.18), 0 2px 6px rgba(41, 45, 41, 0.04)',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--color-resp-client-bg)',
                  color: 'var(--color-resp-client)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <UserRound size={14} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--color-resp-client)' }}>
                CLIENT ATTENTION DESK
              </span>
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-resp-client-bg)',
                color: 'var(--color-resp-client)',
                border: '1px solid var(--color-resp-client-border)'
              }}
            >
              Client to Reply
            </span>
          </div>

          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-charcoal)' }}>
              Board Resolution: Series B Written Consent
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-charcoal-muted)', marginTop: '2px' }}>
              David Sterling (Chairman) → Marcus Vance
            </div>
          </div>

          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--color-resp-client-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-resp-client-border)',
              fontSize: '11.5px',
              color: 'var(--color-resp-client-dark)',
              lineHeight: 1.5
            }}
          >
            <strong style={{ fontWeight: 600 }}>AI Reason:</strong> Managing partner statutory sign-off required. Routine travel and logistics are safely shielded.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
              Action: Marcus 1-Click Handled
            </span>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-resp-client)' }}>
              Ready for Decision →
            </span>
          </div>
        </motion.div>

        {/* Card 2: Assistant Workspace Triage & Copilot (Elena Rostova) */}
        <motion.div
          style={{
            transform: 'translateZ(14px)',
            backgroundColor: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            border: '1.5px solid var(--color-resp-assistant-border)',
            boxShadow: '0 16px 36px -10px rgba(53, 75, 63, 0.14), 0 2px 6px rgba(41, 45, 41, 0.04)',
            padding: '22px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--color-resp-assistant-bg)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <UserCheck size={14} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--color-primary)' }}>
                ASSISTANT COPILOT INBOX
              </span>
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-resp-assistant-bg)',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-resp-assistant-border)'
              }}
            >
              Assistant to Reply
            </span>
          </div>

          <div>
            <div style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--color-charcoal)' }}>
              London Technology Summit: Suite & Transfers
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-charcoal-muted)', marginTop: '2px' }}>
              Clara Hayes &lt;clara.hayes@summits-london.org&gt;
            </div>
          </div>

          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--color-resp-assistant-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-resp-assistant-border)',
              fontSize: '11.5px',
              color: 'var(--color-primary)',
              lineHeight: 1.5
            }}
          >
            <strong style={{ fontWeight: 600 }}>Copilot Draft:</strong> VIP transfer schedule & dietary preferences drafted for Elena's verification.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
              Human Override Protected
            </span>
            <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--color-primary)' }}>
              Draft Ready for Send →
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
