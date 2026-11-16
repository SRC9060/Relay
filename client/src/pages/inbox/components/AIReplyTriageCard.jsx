import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  MailPlus,
  Check,
  X,
  FileText,
  Calendar,
  Clock
} from 'lucide-react';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { useConversations } from '../../../context/ConversationContext';

export default function AIReplyTriageCard({ conversation, onToggleSummary }) {
  if (!conversation) return null;

  const {
    classifyConversation,
    simulateIncomingMessage,
    acceptSuggestion,
    dismissSuggestion,
    aiStatus
  } = useConversations();

  const [isClassifying, setIsClassifying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const {
    id,
    responsibility,
    confidenceScore,
    aiReasoning,
    needsReview,
    isManualOverride,
    pendingSuggestion,
    aiSource,
    importantInformation = [],
    identifiedDates = []
  } = conversation;

  // Seeded demo records may contain a placeholder score before any AI evaluation.
  // Only display a percentage when a classifier result and score are both present.
  const hasConfidence = confidenceScore !== null &&
    confidenceScore !== undefined &&
    Number.isFinite(Number(confidenceScore)) &&
    Boolean(aiSource);
  const confidencePercent = hasConfidence ? Math.round(Number(confidenceScore) * 100) : null;
  const isLowConfidence = Boolean(
    needsReview ||
    responsibility === 'review' ||
    (hasConfidence && confidencePercent < 75)
  );

  const handleReevaluate = async () => {
    setIsClassifying(true);
    try {
      await classifyConversation(id);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSimulateIncoming = async () => {
    setIsSimulating(true);
    try {
      await simulateIncomingMessage(id);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div
      style={{
        margin: '16px 20px 0 20px',
        padding: '16px 18px',
        backgroundColor: isLowConfidence ? 'var(--color-resp-review-bg)' : 'var(--color-surface-subtle)',
        border: isLowConfidence
          ? '1px solid var(--color-resp-review-border)'
          : 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Top Banner: Classification Pill + Source Tag + Confidence */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: isLowConfidence ? 'var(--color-resp-review)' : 'var(--color-primary)',
              color: '#FFFFFF'
            }}
          >
            {isLowConfidence ? <AlertTriangle size={13} /> : <Sparkles size={13} />}
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
            AI Reply Triage
          </span>
          <Badge type={responsibility} size="sm" dot />

          {isManualOverride && (
            <span
              style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(37, 56, 46, 0.1)',
                color: 'var(--color-forest-green)',
                fontWeight: 600
              }}
            >
              Manual Override Active
            </span>
          )}
        </div>

        {/* Confidence Meter & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '50px',
                height: '4px',
                backgroundColor: 'rgba(41, 43, 41, 0.12)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: hasConfidence ? `${confidencePercent}%` : '0%',
                  height: '100%',
                  backgroundColor: !hasConfidence
                    ? 'var(--color-charcoal-light)'
                    : isLowConfidence
                    ? 'var(--color-resp-review)'
                    : confidencePercent > 90
                    ? 'var(--color-success)'
                    : 'var(--color-warning)'
                }}
              />
            </div>
            <span
              className="tabular-nums"
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: !hasConfidence ? 'var(--color-charcoal-muted)' : isLowConfidence ? 'var(--color-resp-review)' : 'var(--color-charcoal-muted)'
              }}
              title={hasConfidence ? 'Classifier confidence estimate' : 'Run Re-evaluate to calculate a confidence score'}
            >
              {hasConfidence ? `${confidencePercent}% confidence` : 'Not evaluated'}
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={RotateCw}
            loading={isClassifying}
            onClick={handleReevaluate}
            title="Re-run AI classification on this thread"
          >
            Re-evaluate
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={MailPlus}
            loading={isSimulating}
            onClick={handleSimulateIncoming}
            title="Simulate incoming counterparty message to test automatic AI re-evaluation"
          >
            Simulate reply
          </Button>
        </div>
      </div>

      {/* Decision Rationale */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--color-charcoal)',
          lineHeight: 1.5,
          paddingLeft: '32px'
        }}
      >
        <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>
          Decision Rationale:{' '}
        </span>
        <span style={{ color: 'var(--color-charcoal-muted)' }}>
          {aiReasoning || 'Conversation content evaluated against executive delegated authority criteria.'}
        </span>
      </div>

      {/* Low-confidence / Needs Review Banner */}
      {isLowConfidence && (
        <div
          style={{
            marginLeft: '32px',
            padding: '8px 12px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-resp-review-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-resp-review)' }}>
            <AlertTriangle size={13} />
            <span>
              <strong>Needs Assistant Review:</strong>{' '}
              {hasConfidence
                ? 'Confidence is below the 0.75 threshold. Please verify responsibility.'
                : 'This sample is flagged for review. Re-evaluate to calculate a current confidence score.'}
            </span>
          </div>
        </div>
      )}

      {/* Human Override Protection Banner: Pending AI Suggestion */}
      {pendingSuggestion && (
        <div
          style={{
            marginLeft: '32px',
            padding: '10px 14px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--color-charcoal)', maxWidth: '520px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-forest-green)' }}>AI Re-evaluation: </span>
            New message suggests assigning to <strong>{pendingSuggestion.responsibility === 'client' ? 'Client to Reply' : 'Assistant to Reply'}</strong>.
            Manual override ({responsibility}) currently active.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Button
              variant="primary"
              size="sm"
              icon={Check}
              onClick={() => acceptSuggestion(id)}
            >
              Accept {pendingSuggestion.responsibility}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={() => dismissSuggestion(id)}
            >
              Keep manual override
            </Button>
          </div>
        </div>
      )}

      {/* Extracted Important Information & Dates Chips */}
      {(importantInformation.length > 0 || identifiedDates.length > 0) && (
        <div
          style={{
            marginLeft: '32px',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '6px',
            fontSize: '11px'
          }}
        >
          {identifiedDates.map((item, idx) => (
            <span
              key={`date-${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                backgroundColor: 'rgba(37, 56, 46, 0.06)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--color-forest-green)',
                fontWeight: 500
              }}
            >
              <Calendar size={11} />
              {item.date}: {item.description}
            </span>
          ))}

          {importantInformation.slice(0, 2).map((info, idx) => (
            <span
              key={`info-${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                backgroundColor: 'rgba(41, 43, 41, 0.05)',
                borderRadius: 'var(--radius-xs)',
                color: 'var(--color-charcoal-muted)'
              }}
            >
              <Clock size={11} />
              {info}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
