import React, { useState, useEffect } from 'react';
import { Send, Save, Trash2, CheckCircle2, Sparkles, Wand2, ShieldAlert } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useConversations } from '../../../context/ConversationContext';

export default function ReplyComposer({ conversation }) {
  const { saveDraft, sendDraft, generateReply } = useConversations();
  const [replyText, setReplyText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [isAiDraft, setIsAiDraft] = useState(false);
  const [activeIntent, setActiveIntent] = useState('confirm');

  // Sync with existing conversation draft on conversation switch
  useEffect(() => {
    if (conversation && conversation.draft && conversation.draft.body) {
      setReplyText(conversation.draft.body);
      setIsAiDraft(false);
    } else {
      setReplyText('');
      setIsAiDraft(false);
    }
    setSavedFeedback(false);
  }, [conversation?.id]);

  if (!conversation) return null;

  const handleSave = async () => {
    if (!replyText.trim()) return;
    setIsSaving(true);
    try {
      await saveDraft(conversation.id, replyText);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSend = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      // First persist the text into draft if modified
      await saveDraft(conversation.id, replyText);
      await sendDraft(conversation.id);
      setReplyText('');
      setIsAiDraft(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleDiscard = async () => {
    setReplyText('');
    setIsAiDraft(false);
    await saveDraft(conversation.id, '');
  };

  const handleAiGenerate = async (intent) => {
    setIsGenerating(true);
    setActiveIntent(intent);
    try {
      const res = await generateReply(conversation.id, { intent });
      if (res && res.body) {
        setReplyText(res.body);
        setIsAiDraft(true);
      }
    } catch (err) {
      console.error('Failed to generate reply:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const intents = [
    { id: 'confirm', label: 'Confirm' },
    { id: 'request_info', label: 'Request Details' },
    { id: 'approve', label: 'Approve' },
    { id: 'reschedule', label: 'Reschedule' }
  ];

  return (
    <div
      style={{
        margin: '0 20px 24px 20px',
        padding: '16px',
        backgroundColor: 'var(--color-surface)',
        border: 'var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      {/* Composer Header & AI Intent Generator Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
            Reply
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
            from Ananya Sharma (on behalf of Arjun Mehta)
          </span>
        </div>

        {/* AI Intent Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={11} color="var(--color-forest-green)" /> Draft with AI:
          </span>
          {intents.map((item) => (
            <button
              key={item.id}
              disabled={isGenerating}
              onClick={() => handleAiGenerate(item.id)}
              className="intent-pill"
              style={{
                fontSize: '11px',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                border: 'var(--border-subtle)',
                backgroundColor: isGenerating && activeIntent === item.id ? 'var(--color-sage)' : 'var(--color-surface-subtle)',
                color: 'var(--color-charcoal)',
                cursor: isGenerating ? 'wait' : 'pointer'
              }}
            >
              {isGenerating && activeIntent === item.id ? 'Drafting...' : item.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Draft Banner */}
      {isAiDraft && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: 'rgba(37, 56, 46, 0.05)',
            border: '1px solid rgba(37, 56, 46, 0.15)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            color: 'var(--color-forest-green)'
          }}
        >
          <ShieldAlert size={13} />
          <span>
            <strong>AI Draft Generated:</strong> Human review required before simulated send. Never dispatched automatically.
          </span>
        </div>
      )}

      {/* Reply Textarea */}
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        placeholder={`Write an executive reply to ${conversation.sender?.name || 'Counterparty'} or use the AI draft pills above...`}
        rows={5}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '13px',
          fontFamily: 'var(--font-body)',
          backgroundColor: 'var(--color-surface-subtle)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--color-charcoal)',
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: 1.5,
          transition: 'border-color var(--transition-fast)'
        }}
        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
        onBlur={(e) => (e.target.style.borderColor = 'rgba(41, 43, 41, 0.09)')}
      />

      {/* Composer Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          {replyText && (
            <button
              onClick={handleDiscard}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: 'var(--color-charcoal-light)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px 6px'
              }}
              title="Discard draft"
            >
              <Trash2 size={12} />
              Discard
            </button>
          )}

          {savedFeedback && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                color: 'var(--color-success)',
                fontWeight: 500,
                marginLeft: '8px'
              }}
            >
              <CheckCircle2 size={12} />
              Draft saved
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={Save}
            loading={isSaving}
            disabled={!replyText.trim() || isSending || isGenerating}
            onClick={handleSave}
          >
            Save draft
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Send}
            iconPosition="right"
            loading={isSending}
            disabled={!replyText.trim() || isSaving || isGenerating}
            onClick={handleSend}
          >
            Send (Simulated)
          </Button>
        </div>
      </div>
    </div>
  );
}
