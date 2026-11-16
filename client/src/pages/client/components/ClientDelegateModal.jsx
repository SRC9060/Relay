import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, X, Send, Sparkles } from 'lucide-react';
import Button from '../../../components/common/Button';

export default function ClientDelegateModal({ conversation, isOpen, onClose, onConfirm }) {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !conversation) return null;

  const quickDirectives = [
    'Ananya, please draft standard response acknowledging receipt.',
    'Please decline politely on my behalf; schedule is constrained.',
    'Coordinate meeting times directly with them for next Thursday.',
    'Review terms and prepare a redlined comparison for my review.'
  ];

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(conversation.id, notes.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(25, 39, 32, 0.45)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%',
          maxWidth: '520px',
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
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-resp-assistant-bg)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UserCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Delegate to Assistant</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)' }}>
                Hand over to Ananya Sharma with priority assignment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              color: 'var(--color-charcoal-muted)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Conversation Context Pill */}
        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)',
            border: 'var(--border-subtle)',
            fontSize: '12px'
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '3px' }}>
            {conversation.subject}
          </div>
          <div style={{ color: 'var(--color-charcoal-muted)', fontSize: '11px' }}>
            From: {conversation.sender?.name} ({conversation.sender?.email})
          </div>
        </div>

        {/* Quick Instructions Directives */}
        <div>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-charcoal-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '8px'
            }}
          >
            <Sparkles size={12} color="var(--color-primary)" />
            Quick instructions for Ananya
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {quickDirectives.map((directive, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setNotes(directive)}
                className="modal-directive-btn"
                style={{
                  textAlign: 'left',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: notes === directive ? 'var(--color-resp-assistant-bg)' : 'var(--color-surface)',
                  border: notes === directive ? '1px solid var(--color-primary)' : 'var(--border-subtle)',
                  fontSize: '11.5px',
                  color: notes === directive ? 'var(--color-primary)' : 'var(--color-charcoal)',
                  cursor: 'pointer'
                }}
              >
                "{directive}"
              </button>
            ))}
          </div>
        </div>

        {/* Custom Directives Textarea */}
        <div>
          <label
            htmlFor="custom-notes"
            style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--color-charcoal-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '6px'
            }}
          >
            Custom instructions (optional)
          </label>
          <textarea
            id="custom-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any specific guidelines, limits, or talking points for Ananya..."
            rows={3}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '12.5px',
              fontFamily: 'var(--font-body)',
              color: 'var(--color-charcoal)',
              backgroundColor: 'var(--color-surface)',
              border: 'var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              outline: 'none',
              resize: 'vertical'
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(41, 43, 41, 0.09)')}
          />
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '6px' }}>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Send}
            iconPosition="right"
            onClick={handleConfirm}
            loading={isSubmitting}
          >
            Delegate to Ananya
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
