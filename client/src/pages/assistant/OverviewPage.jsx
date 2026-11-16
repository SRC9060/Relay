import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAccounts } from '../../context/AccountContext';
import { useConversations } from '../../context/ConversationContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import {
  Inbox,
  AlertCircle,
  UserCheck,
  UserRound,
  Clock,
  Calendar,
  RotateCw,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function OverviewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { accounts, syncAll, isSyncing } = useAccounts();
  const { conversations, counts, countsLoaded, loading, selectConversation } = useConversations();

  // 1. Central Action Queue: unarchived action-required conversations
  const actionQueue = useMemo(() => {
    return conversations
      .filter((c) => !c.isArchived && c.actionStatus === 'action_required')
      .slice(0, 6);
  }, [conversations]);

  // 2. Client Attention items (for Marcus Vance)
  const clientAttentionItems = useMemo(() => {
    return conversations
      .filter((c) => !c.isArchived && c.responsibility === 'client' && c.actionStatus !== 'completed')
      .slice(0, 3);
  }, [conversations]);

  // 3. Upcoming Meetings & Calendar Logistics
  const meetingItems = useMemo(() => {
    return conversations
      .filter((c) => !c.isArchived && (c.category === 'meetings' || c.category === 'scheduling'))
      .slice(0, 3);
  }, [conversations]);

  const handleThreadClick = (threadId) => {
    selectConversation(threadId);
    navigate(`/app/inbox?id=${threadId}`);
  };

  const clientCount = countsLoaded ? (counts.clientQueue ?? counts.clientReply ?? 0) : '—';
  const assistantCount = countsLoaded ? (counts.assistantReply ?? 0) : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Executive Context Banner */}
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          border: 'var(--border-subtle)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
              What needs attention today?
            </h1>
            <Badge type="assistant" size="sm">
              <ShieldCheck size={11} /> Elena Rostova
            </Badge>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--color-charcoal-muted)' }}>
            Executive communications for <strong>{user?.clientName || 'Marcus Vance'}</strong> across {accounts.length} active gateways.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="secondary"
            size="md"
            icon={RotateCw}
            loading={isSyncing}
            onClick={syncAll}
          >
            Sync mailboxes
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Inbox}
            onClick={() => navigate('/app/inbox')}
          >
            Open inbox
          </Button>
        </div>
      </div>

      {/* 2. Four Prioritized Metric Cards (Exact order requested) */}
      <div
        className="bento-metrics-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px'
        }}
      >
        {/* Priority 1: Client Attention */}
        <Card hoverable onClick={() => navigate('/app/client-reply')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-resp-client)' }}>
              1. Client Decisions
            </span>
            <UserRound size={15} color="var(--color-resp-client)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-resp-client)' }} className="tabular-nums">
            {clientCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-charcoal-muted)', marginTop: '4px' }}>
            Statutory & board approvals for Marcus
          </div>
        </Card>

        {/* Priority 2: Assistant Actions */}
        <Card hoverable onClick={() => navigate('/app/assistant-reply')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
              2. Assistant Actions
            </span>
            <UserCheck size={15} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }} className="tabular-nums">
            {assistantCount}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-charcoal-muted)', marginTop: '4px' }}>
            Drafting, logistics & coordination tasks
          </div>
        </Card>

        {/* Priority 3: Waiting for Response */}
        <Card hoverable onClick={() => navigate('/app/waiting')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>
              3. Waiting for Reply
            </span>
            <Clock size={15} color="var(--color-charcoal-muted)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-charcoal)' }} className="tabular-nums">
            {countsLoaded ? (counts.waiting ?? 0) : '—'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-charcoal-muted)', marginTop: '4px' }}>
            Awaiting counterparty replies
          </div>
        </Card>

        {/* Priority 4: Upcoming Meetings */}
        <Card hoverable onClick={() => navigate('/app/meetings')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-charcoal-muted)' }}>
              4. Upcoming Meetings
            </span>
            <Calendar size={15} color="var(--color-charcoal-muted)" />
          </div>
          <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-charcoal)' }} className="tabular-nums">
            {countsLoaded ? (counts.meetings ?? 0) : '—'}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-charcoal-muted)', marginTop: '4px' }}>
            Keynotes, private dining & summits
          </div>
        </Card>
      </div>

      {/* 3. Main Bento Layout: Central Action Queue (Left) + Context Cards (Right) */}
      <div
        className="bento-overview-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
          gap: '16px'
        }}
      >
        {/* Central Element: Today's Action Queue */}
        <Card
          title="Today's Action Queue"
          subtitle="Prioritized conversations requiring immediate assistant or client action"
          action={
            <Button
              variant="ghost"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              onClick={() => navigate('/app/action-required')}
            >
              View all ({countsLoaded ? (counts.actionRequired ?? 0) : '—'})
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-charcoal-muted)', fontSize: '13px' }}>Loading action items…</div>
            ) : actionQueue.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-charcoal-muted)', fontSize: '13px' }}>
                All action items are resolved. No pending triage required.
              </div>
            ) : (
              actionQueue.map((thread) => {
                const isClientResp = thread.responsibility === 'client';
                const timeText = formatRelativeTime(thread.lastMessageAt);

                return (
                  <div
                    key={thread.id}
                    onClick={() => handleThreadClick(thread.id)}
                    className="action-queue-row"
                    style={{
                      padding: '14px 16px',
                      backgroundColor: 'var(--color-surface-subtle)',
                      borderRadius: 'var(--radius-md)',
                      border: 'var(--border-subtle)',
                      borderLeft: isClientResp
                        ? '3px solid var(--color-resp-client)'
                        : '3px solid var(--color-primary)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                          {thread.sender?.name}
                        </span>
                        {thread.sender?.role && (
                          <span style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }} className="desktop-only">
                            • {thread.sender.role}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <Badge type={thread.responsibility} size="sm" dot />
                        <span style={{ fontSize: '11px', color: 'var(--color-charcoal-light)' }} className="tabular-nums">
                          {timeText}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '4px' }}>
                      {thread.subject}
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--color-charcoal-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {thread.aiReasoning || thread.preview}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Right Column: Client Attention Spotlight + Upcoming Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Client Attention Spotlight */}
          <Card
            title="Client Attention Queue"
            subtitle={`Marcus Vance • ${clientCount} pending decisions`}
            action={
              <Button
                variant="ghost"
                size="sm"
                icon={ExternalLink}
                iconPosition="right"
                onClick={() => navigate('/client')}
              >
                Client View
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {clientAttentionItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleThreadClick(item.id)}
                  className="client-spotlight-item"
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--color-resp-client-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-resp-client-border)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-resp-client-dark)', marginBottom: '2px' }}>
                    {item.subject}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                    {item.sender?.name} • {formatRelativeTime(item.lastMessageAt)}
                  </div>
                </div>
              ))}

              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/client')}
                style={{ width: '100%', marginTop: '6px', borderColor: 'var(--color-resp-client-border)', color: 'var(--color-resp-client)' }}
              >
                Open Marcus's Decision Desk
              </Button>
            </div>
          </Card>

          {/* Upcoming Meetings & Calendar Logistics */}
          <Card
            title="Upcoming Logistics"
            subtitle="Extracted dates & executive engagements"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/app/meetings')}
              >
                Calendar
              </Button>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {meetingItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleThreadClick(item.id)}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--color-surface-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: 'var(--border-subtle)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '2px' }}>
                    {item.subject}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-charcoal-muted)' }}>
                    {item.sender?.name}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
