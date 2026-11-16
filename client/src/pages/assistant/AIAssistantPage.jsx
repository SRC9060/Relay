import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Cpu,
  Mail,
  UserCheck,
  UserRound,
  Clock,
  ArrowRight,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { useConversations } from '../../context/ConversationContext';
import { api } from '../../services/api';

export default function AIAssistantPage() {
  const navigate = useNavigate();
  const { conversations, selectedConversation, aiStatus } = useConversations();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Good morning, Elena. I am your Relay Executive Copilot. I can query Marcus Vance’s connected mailboxes, summarize correspondence, identify deadlines, and draft contextual replies strictly grounded in your actual conversation history.',
      referencedConversations: [],
      timestamp: 'Just now'
    }
  ]);

  const starterPrompts = [
    'Show me emails that need my attention',
    'What am I waiting for a response on?',
    "Which emails require the client's attention?",
    'Show scheduled meetings and calendar dates',
    'Why is Board Resolution assigned to client?'
  ];

  const handleSend = async (userQuery) => {
    const q = userQuery || query;
    if (!q.trim() || loading) return;

    const userMsg = {
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await api.askCopilot({
        query: q,
        conversationId: selectedConversation?.id || conversations[0]?.id
      });

      const copilotMsg = {
        sender: 'assistant',
        text: res.answer || 'Query processed.',
        referencedConversations: res.referencedConversations || [],
        aiSource: res.aiSource,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, copilotMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'Unable to process query at this time. Please ensure the backend service is operational.',
          referencedConversations: [],
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        sender: 'assistant',
        text: 'Session reset. What would you like to review across Marcus Vance’s communications?',
        referencedConversations: [],
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1000px', margin: '0 auto', height: 'calc(100vh - 100px)' }}>
      {/* Header Context Banner */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Relay Executive Copilot</h1>
            <Badge type="assistant" size="sm">
              <ShieldCheck size={11} /> Grounded in Mailbox Data
            </Badge>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)' }}>
            Real-time intelligence across <strong>{conversations.length} conversations</strong> for Marcus Vance.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface-subtle)',
              border: 'var(--border-subtle)',
              color: 'var(--color-charcoal-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Cpu size={12} />
            {aiStatus?.isConfigured ? 'Gemini 1.5 Flash (Live API)' : 'Deterministic Fallback Engine'}
          </span>

          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={handleClearHistory}
            title="Reset conversation"
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Suggested Starter Prompts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={11} color="var(--color-forest-green)" /> Suggested:
        </span>
        {starterPrompts.map((p, idx) => (
          <button
            key={idx}
            disabled={loading}
            onClick={() => handleSend(p)}
            className="filter-tab-pill ai-prompt-chip"
            style={{
              fontSize: '11px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface)',
              border: 'var(--border-subtle)',
              color: 'var(--color-charcoal)',
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Main Chat Message Scroll Window */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: 'var(--color-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {messages.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
                gap: '4px'
              }}
            >
              {/* Message Bubble */}
              <div
                style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  backgroundColor: isUser ? 'var(--color-primary)' : 'var(--color-surface-subtle)',
                  color: isUser ? '#FFFFFF' : 'var(--color-charcoal)',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  border: isUser ? 'none' : 'var(--border-subtle)',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.text}

                {/* Referenced Conversation Cards */}
                {msg.referencedConversations && msg.referencedConversations.length > 0 && (
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>
                      Referenced Conversations ({msg.referencedConversations.length}):
                    </div>
                    {msg.referencedConversations.map((ref) => (
                      <div
                        key={ref.id}
                        onClick={() => navigate(`/app/inbox?id=${ref.id}`)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#FFFFFF',
                          border: 'var(--border-subtle)',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          transition: 'background-color var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                      >
                        <div style={{ minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                              {ref.sender}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                              • {ref.senderRole}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'var(--color-charcoal)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: '420px'
                            }}
                          >
                            {ref.subject}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <Badge type={ref.responsibility} size="sm" dot />
                          <ArrowRight size={13} color="var(--color-charcoal-muted)" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timestamp & Copy Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--color-charcoal-light)' }} className="tabular-nums">
                  {msg.timestamp}
                </span>
                {!isUser && (
                  <button
                    onClick={() => handleCopy(msg.text, idx)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '10px',
                      color: 'var(--color-charcoal-light)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                    title="Copy response"
                  >
                    {copiedIndex === idx ? <Check size={10} color="var(--color-success)" /> : <Copy size={10} />}
                    {copiedIndex === idx ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', color: 'var(--color-charcoal-muted)', fontSize: '12px' }}>
            <Sparkles size={14} className="animate-spin" color="var(--color-forest-green)" />
            <span>
              {aiStatus?.isConfigured
                ? 'Analyzing mailbox state with Gemini AI...'
                : 'Analyzing mailbox state with Copilot engine...'}
            </span>
          </div>
        )}
      </div>

      {/* Query Input Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '8px 12px'
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Ask a question about Marcus Vance's emails, approvals, meetings, or pending replies..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            color: 'var(--color-charcoal)',
            backgroundColor: 'transparent'
          }}
        />

        <Button
          variant="primary"
          size="md"
          icon={Send}
          loading={loading}
          disabled={!query.trim() || loading}
          onClick={() => handleSend()}
        >
          Ask Copilot
        </Button>
      </div>
    </div>
  );
}
