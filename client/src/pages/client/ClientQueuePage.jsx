import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  CheckCircle2,
  Clock,
  Shield,
  FileCheck,
  Filter,
  Inbox,
  ArrowRight
} from 'lucide-react';
import { useConversations } from '../../context/ConversationContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useAccounts } from '../../context/AccountContext';
import ClientTopBar from './components/ClientTopBar';
import ClientAttentionCard from './components/ClientAttentionCard';
import ClientConversationView from './components/ClientConversationView';
import ClientDelegateModal from './components/ClientDelegateModal';

export default function ClientQueuePage() {
  const { user } = useAuth();
  const {
    counts,
    markHandled,
    delegateToAssistant,
    toastMessage
  } = useConversations();
  const { accounts, selectedAccountId, setSelectedAccountId } = useAccounts();

  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [delegateTarget, setDelegateTarget] = useState(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [clientConversations, setClientConversations] = useState([]);
  const [queueLoading, setQueueLoading] = useState(true);

  // Load the Client Decision Desk from its own unfiltered inbox request.
  // This deliberately avoids inheriting the Assistant workspace's current segment.
  const loadClientConversations = useCallback(async () => {
    setQueueLoading(true);
    try {
      const response = await api.getConversations({
        segment: 'all',
        accountId: selectedAccountId
      });
      if (response && Array.isArray(response.data)) {
        setClientConversations(response.data);
      } else {
        setClientConversations([]);
      }
    } catch (error) {
      console.error('[Relay Client] Failed to load decision queue:', error);
      setClientConversations([]);
    } finally {
      setQueueLoading(false);
    }
  }, [selectedAccountId]);

  useEffect(() => {
    loadClientConversations();
  }, [loadClientConversations]);

  // All outstanding client conversations before category filtering
  const totalClientQueue = useMemo(() => {
    let list = clientConversations.filter(
      (c) =>
        c.responsibility === 'client' &&
        c.actionStatus !== 'completed' &&
        c.actionStatus !== 'resolved' &&
        !c.isArchived
    );

    // Account filter
    if (selectedAccountId && selectedAccountId !== 'all') {
      list = list.filter((c) => c.accountId === selectedAccountId);
    }
    return list;
  }, [clientConversations, selectedAccountId]);

  // Client Attention Queue: filtered by category and search
  const clientQueue = useMemo(() => {
    let list = totalClientQueue;

    // Category filter
    if (filterCategory === 'approvals') {
      list = list.filter((c) => c.category === 'approvals' || c.subject.toLowerCase().includes('consent') || c.subject.toLowerCase().includes('audit'));
    } else if (filterCategory === 'advisory') {
      list = list.filter((c) => c.category === 'advisory' || c.subject.toLowerCase().includes('advisory') || c.subject.toLowerCase().includes('term'));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((c) => {
        const inSubject = c.subject && c.subject.toLowerCase().includes(q);
        const inSender = c.sender && (c.sender.name.toLowerCase().includes(q) || c.sender.email.toLowerCase().includes(q));
        const inReason = (c.clientAttentionReason || c.aiReasoning || '').toLowerCase().includes(q);
        return inSubject || inSender || inReason;
      });
    }

    return list;
  }, [totalClientQueue, filterCategory, searchQuery]);

  // Selected conversation
  const selectedConversation = useMemo(() => {
    if (selectedId) {
      const found = clientQueue.find((c) => c.id === selectedId);
      if (found) return found;
    }
    return clientQueue[0] || null;
  }, [clientQueue, selectedId]);

  // Sync selectedId if current selection drops out of queue
  useEffect(() => {
    if (clientQueue.length > 0 && (!selectedId || !clientQueue.some((c) => c.id === selectedId))) {
      setSelectedId(clientQueue[0].id);
    }
  }, [clientQueue, selectedId]);

  // Time-of-day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const handleSelectCard = (id) => {
    setSelectedId(id);
    setShowMobileDetail(true);
  };

  const handleMarkHandled = async (id) => {
    const currentIndex = clientQueue.findIndex((c) => c.id === id);
    await markHandled(id);
    await loadClientConversations();

    // Pick next item in queue if available
    const remaining = clientQueue.filter((c) => c.id !== id);
    if (remaining.length > 0) {
      const nextIndex = Math.min(currentIndex, remaining.length - 1);
      setSelectedId(remaining[nextIndex].id);
    } else {
      setSelectedId(null);
      setShowMobileDetail(false);
    }
  };

  const handleConfirmDelegate = async (id, notes) => {
    const currentIndex = clientQueue.findIndex((c) => c.id === id);
    await delegateToAssistant(id, notes);
    await loadClientConversations();

    // Pick next item in queue if available
    const remaining = clientQueue.filter((c) => c.id !== id);
    if (remaining.length > 0) {
      const nextIndex = Math.min(currentIndex, remaining.length - 1);
      setSelectedId(remaining[nextIndex].id);
    } else {
      setSelectedId(null);
      setShowMobileDetail(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        backgroundColor: 'var(--color-bg)',
        overflow: 'hidden'
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            padding: '10px 16px',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-dropdown)',
            fontSize: '12.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={15} color="#A7D7B9" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <ClientTopBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedAccountId={selectedAccountId}
        onAccountChange={setSelectedAccountId}
      />

      {/* Main Content Area */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          overflow: 'hidden'
        }}
      >
        {/* Left Pane: Attention Queue List */}
        <section
          aria-label="Attention Queue List"
          style={{
            width: '420px',
            minWidth: '340px',
            maxWidth: '460px',
            backgroundColor: 'var(--color-surface)',
            borderRight: 'var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
          }}
          className={showMobileDetail ? 'mobile-hidden' : ''}
        >
          {/* Executive Greeting Header */}
          <div
            style={{
              padding: '20px 20px 14px',
              borderBottom: 'var(--border-subtle)',
              backgroundColor: 'var(--color-surface)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <h1
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'var(--color-charcoal)',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                {greeting}, {user?.role === 'client' ? (user?.name?.split(' ')[0] || 'Marcus') : (user?.clientName?.split(' ')[0] || 'Marcus')}
              </h1>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: clientQueue.length > 0 ? 'var(--color-resp-client-bg)' : 'var(--color-success-bg)',
                  color: clientQueue.length > 0 ? 'var(--color-resp-client)' : 'var(--color-success)',
                  border: clientQueue.length > 0 ? '1px solid var(--color-resp-client-border)' : '1px solid #B8E0CA'
                }}
              >
                {clientQueue.length} Pending
              </span>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)', lineHeight: 1.45 }}>
              {clientQueue.length > 0
                ? `${clientQueue.length} conversation${clientQueue.length === 1 ? '' : 's'} require your personal decision or statutory approval.`
                : 'You are all caught up. No executive approvals or personal decisions pending.'}
            </p>

            {/* Quick Filter Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '12px'
              }}
            >
              <button
                onClick={() => setFilterCategory('all')}
                className={`filter-tab-pill ${filterCategory === 'all' ? 'active' : ''}`}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11.5px',
                  fontWeight: filterCategory === 'all' ? 600 : 500,
                  backgroundColor: filterCategory === 'all' ? 'var(--color-primary)' : 'var(--color-surface-subtle)',
                  color: filterCategory === 'all' ? '#FFFFFF' : 'var(--color-charcoal)',
                  border: 'var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                All ({totalClientQueue.length})
              </button>
              <button
                onClick={() => setFilterCategory('approvals')}
                className={`filter-tab-pill ${filterCategory === 'approvals' ? 'active' : ''}`}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11.5px',
                  fontWeight: filterCategory === 'approvals' ? 600 : 500,
                  backgroundColor: filterCategory === 'approvals' ? 'var(--color-primary)' : 'var(--color-surface-subtle)',
                  color: filterCategory === 'approvals' ? '#FFFFFF' : 'var(--color-charcoal)',
                  border: 'var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                Approvals & Legal
              </button>
              <button
                onClick={() => setFilterCategory('advisory')}
                className={`filter-tab-pill ${filterCategory === 'advisory' ? 'active' : ''}`}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11.5px',
                  fontWeight: filterCategory === 'advisory' ? 600 : 500,
                  backgroundColor: filterCategory === 'advisory' ? 'var(--color-primary)' : 'var(--color-surface-subtle)',
                  color: filterCategory === 'advisory' ? '#FFFFFF' : 'var(--color-charcoal)',
                  border: 'var(--border-subtle)',
                  cursor: 'pointer'
                }}
              >
                Advisory
              </button>
            </div>
          </div>

          {/* Attention Queue List Content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {queueLoading ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'var(--color-charcoal-muted)',
                  fontSize: '12px'
                }}
              >
                Loading client decisions…
              </div>
            ) : clientQueue.length === 0 ? (
              <div
                style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-success-bg)',
                    color: 'var(--color-success)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}
                >
                  <CheckCircle2 size={24} />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-charcoal)', marginBottom: '4px' }}>
                  Queue Clear
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)', maxWidth: '260px', lineHeight: 1.45 }}>
                  No outstanding client responses required. Elena Rostova is actively managing all routine operational correspondence.
                </p>
              </div>
            ) : (
              clientQueue.map((conv) => (
                <ClientAttentionCard
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedConversation?.id === conv.id}
                  onClick={() => handleSelectCard(conv.id)}
                />
              ))
            )}
          </div>

          {/* Bottom Summary Bar */}
          <div
            style={{
              padding: '10px 16px',
              borderTop: 'var(--border-subtle)',
              backgroundColor: 'var(--color-surface-subtle)',
              fontSize: '11px',
              color: 'var(--color-charcoal-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={12} color="var(--color-primary)" />
              <span>Executive Assistant: Elena Rostova</span>
            </div>
            <span style={{ fontWeight: 600 }}>{counts.assistantReply || 12} Delegated</span>
          </div>
        </section>

        {/* Right Pane: Conversation Reader & Action Desk */}
        <main
          aria-label="Conversation Reader"
          style={{
            flex: 1,
            height: '100%',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg)'
          }}
          className={!showMobileDetail ? 'mobile-hidden' : ''}
        >
          <ClientConversationView
            conversation={selectedConversation}
            onBack={() => setShowMobileDetail(false)}
            onMarkHandled={handleMarkHandled}
            onOpenDelegate={(conv) => setDelegateTarget(conv)}
          />
        </main>
      </div>

      {/* Delegation Modal */}
      <ClientDelegateModal
        conversation={delegateTarget}
        isOpen={Boolean(delegateTarget)}
        onClose={() => setDelegateTarget(null)}
        onConfirm={handleConfirmDelegate}
      />
    </div>
  );
}
