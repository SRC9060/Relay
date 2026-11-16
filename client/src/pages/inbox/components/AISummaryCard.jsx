import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, ChevronDown, ChevronUp, Sparkles, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useConversations } from '../../../context/ConversationContext';

export default function AISummaryCard({ conversation }) {
  const { getSummary } = useConversations();
  const [summary, setSummary] = useState(conversation?.summaryDetails || null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!conversation) return null;

  const handleFetchSummary = async () => {
    if (summary && isOpen) {
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    if (!summary) {
      setLoading(true);
      try {
        const data = await getSummary(conversation.id);
        if (data) setSummary(data);
      } catch (err) {
        console.error('Failed to fetch summary:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        margin: '10px 20px 0 20px',
        backgroundColor: 'var(--color-surface)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'border-color var(--transition-fast)'
      }}
    >
      {/* Toggle Bar */}
      <div
        onClick={handleFetchSummary}
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: isOpen ? 'var(--color-surface-subtle)' : 'var(--color-surface)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={14} color="var(--color-forest-green)" />
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
            AI Executive Summary
          </span>
          {conversation.aiSummary && !isOpen && (
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-charcoal-muted)',
                maxWidth: '400px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              • {conversation.aiSummary}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-charcoal-light)' }}>
            {isOpen ? 'Collapse' : 'Expand summary'}
          </span>
          {isOpen ? <ChevronUp size={14} color="var(--color-charcoal-muted)" /> : <ChevronDown size={14} color="var(--color-charcoal-muted)" />}
        </div>
      </div>

      {/* Expanded Content with Smooth Height Animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="ai-summary-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '14px 16px', borderTop: 'var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {loading ? (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--color-charcoal-muted)' }}>
                  Generating executive summary with Gemini...
                </div>
              ) : summary ? (
                <>
                  {/* Overview */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-forest-green)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Core Overview
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-charcoal)', lineHeight: 1.5 }}>
                      {summary.overview}
                    </div>
                  </div>

                  {/* Latest Developments */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-charcoal-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Latest Developments
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-charcoal)', lineHeight: 1.5 }}>
                      {summary.latestDevelopments}
                    </div>
                  </div>

                  {/* Key Decisions & Deadlines Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                    {summary.keyDecisions && summary.keyDecisions.length > 0 && (
                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', border: 'var(--border-subtle)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          <CheckCircle2 size={12} color="var(--color-forest-green)" /> Key Decisions
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--color-charcoal)', lineHeight: 1.4 }}>
                          {summary.keyDecisions.map((dec, i) => (
                            <li key={i}>{dec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {summary.deadlines && summary.deadlines.length > 0 && (
                      <div style={{ padding: '10px 12px', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-sm)', border: 'var(--border-subtle)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-charcoal)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                          <Clock size={12} color="var(--color-charcoal-muted)" /> Deadlines & Constraints
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '12px', color: 'var(--color-charcoal)', lineHeight: 1.4 }}>
                          {summary.deadlines.map((dl, i) => (
                            <li key={i}>{dl}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Recommended Next Step */}
                  {summary.recommendedAction && (
                    <div
                      style={{
                        padding: '8px 12px',
                        backgroundColor: 'rgba(37, 56, 46, 0.05)',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(37, 56, 46, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px'
                      }}
                    >
                      <ArrowRight size={13} color="var(--color-forest-green)" />
                      <span style={{ color: 'var(--color-charcoal)' }}>
                        <strong>Next Recommended Step:</strong> {summary.recommendedAction}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px' }}>
                  <Button size="sm" variant="secondary" onClick={handleFetchSummary}>
                    Generate summary
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
