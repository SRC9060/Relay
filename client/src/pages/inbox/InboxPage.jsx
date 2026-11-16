import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Inbox, MailCheck, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useConversations } from '../../context/ConversationContext';
import ErrorBoundary from '../../components/common/ErrorBoundary';

import ConversationListHeader from './components/ConversationListHeader';
import ConversationListItem from './components/ConversationListItem';
import ConversationReaderHeader from './components/ConversationReaderHeader';
import ConversationActionBar from './components/ConversationActionBar';
import AIReplyTriageCard from './components/AIReplyTriageCard';
import AISummaryCard from './components/AISummaryCard';
import MessageThreadView from './components/MessageThreadView';
import ReplyComposer from './components/ReplyComposer';

function ReaderSkeleton({ onBack }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        minHeight: 0,
        backgroundColor: 'var(--color-bg)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'var(--color-surface)',
          borderBottom: 'var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={onBack}
            className="relay-button secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              fontSize: '12.5px',
              borderRadius: 'var(--radius-md)'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Inbox</span>
          </button>
          <div
            style={{
              width: '120px',
              height: '18px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface-subtle)',
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        </div>
        <div
          style={{
            width: '60%',
            height: '24px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'var(--color-surface-subtle)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
        <div
          style={{
            width: '35%',
            height: '14px',
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'var(--color-surface-subtle)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div
          style={{
            height: '64px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface-subtle)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
        <div
          style={{
            height: '40px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-surface-subtle)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
        <div
          style={{
            height: '190px',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--color-surface)',
            border: 'var(--border-subtle)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>
    </div>
  );
}

function ConversationNotFound({ onBack }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: '100%',
        padding: '48px 24px',
        textAlign: 'center',
        backgroundColor: 'var(--color-bg)'
      }}
    >
      <div
        style={{
          maxWidth: '420px',
          padding: '32px 24px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          border: 'var(--border-subtle)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-charcoal-muted)'
          }}
        >
          <Inbox size={22} />
        </div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
          Conversation Not Found
        </div>
        <div style={{ fontSize: '12.5px', color: 'var(--color-charcoal-muted)', lineHeight: 1.5 }}>
          The requested conversation could not be located in this mailbox segment.
        </div>
        <button
          type="button"
          onClick={onBack}
          className="relay-button primary"
          style={{
            marginTop: '6px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            fontSize: '12.5px'
          }}
        >
          <ArrowLeft size={14} />
          <span>Return to Inbox</span>
        </button>
      </div>
    </div>
  );
}

export default function InboxPage({ defaultSegment }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const segmentParam = searchParams.get('segment') || defaultSegment;
  const idParam = searchParams.get('id');

  const {
    conversations,
    selectedConversationId,
    selectedConversation,
    selectConversation,
    activeSegment,
    setActiveSegment,
    toggleImportant,
    loading,
    toastMessage
  } = useConversations();

  // Sync route segment or query parameter with context on change
  useEffect(() => {
    if (segmentParam) {
      setActiveSegment(segmentParam);
    }
  }, [segmentParam, setActiveSegment]);

  // Stable URL id param synchronization without cascade
  const lastRequestedIdRef = React.useRef(null);
  useEffect(() => {
    if (idParam) {
      if (lastRequestedIdRef.current !== idParam || selectedConversationId !== idParam) {
        lastRequestedIdRef.current = idParam;
        selectConversation(idParam);
      }
    } else {
      if (lastRequestedIdRef.current !== null || selectedConversationId !== null) {
        lastRequestedIdRef.current = null;
        selectConversation(null);
      }
    }
  }, [idParam, selectedConversationId, selectConversation]);

  // Handle opening a conversation (transitions from list to focused detail view)
  const handleSelectConversation = (id) => {
    lastRequestedIdRef.current = id;
    selectConversation(id);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (id) {
        next.set('id', id);
      } else {
        next.delete('id');
      }
      return next;
    });
  };

  // Handle returning from conversation detail to the spacious list view
  const handleBackToInbox = () => {
    lastRequestedIdRef.current = null;
    selectConversation(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('id');
      return next;
    });
  };

  // Keyboard navigation: Escape key returns to list view
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && (idParam || selectedConversation)) {
        handleBackToInbox();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [idParam, selectedConversation]);

  const readerScrollRef = React.useRef(null);

  // Guarantee scroll resets to top whenever opening or switching conversation
  useEffect(() => {
    if (readerScrollRef.current) {
      readerScrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [selectedConversation?.id]);

  const isReaderView = Boolean(idParam);
  const isConversationLoaded = Boolean(selectedConversation && selectedConversation.id === idParam);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        height: '100%',
        minHeight: 0,
        backgroundColor: 'var(--color-bg)',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 300,
              padding: '10px 18px',
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              fontSize: '12.5px',
              fontWeight: 500,
              boxShadow: 'var(--shadow-dropdown)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <MailCheck size={15} color="#E7E9DF" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Interaction: Reader view if id is requested, else List view */}
      {isReaderView ? (
        <ErrorBoundary
          title="Unable to display conversation"
          onBack={handleBackToInbox}
          onReset={() => {
            if (idParam) selectConversation(idParam);
          }}
        >
          {isConversationLoaded ? (
            <div
              key={`detail-${selectedConversation.id}`}
              className="conversation-reader-layout"
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                height: '100%',
                minHeight: 0,
                backgroundColor: 'var(--color-bg)',
                overflow: 'hidden'
              }}
            >
              {/* Sticky Header: Reader Navigation, Subject, and Action Bar */}
              <div
                style={{
                  flexShrink: 0,
                  zIndex: 30,
                  backgroundColor: 'var(--color-surface)',
                  boxShadow: '0 1px 2px rgba(41, 43, 41, 0.04)'
                }}
              >
                <ConversationReaderHeader
                  conversation={selectedConversation}
                  onBackToInbox={handleBackToInbox}
                  onNavigate={handleSelectConversation}
                />
                <ConversationActionBar
                  conversation={selectedConversation}
                  onNavigate={handleSelectConversation}
                />
              </div>

              {/* Dedicated Scrollable Content Region */}
              <div
                ref={readerScrollRef}
                className="conversation-reader-scrollable"
                style={{
                  flex: 1,
                  minHeight: 0,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  paddingBottom: '32px'
                }}
              >
                {/* AI Reply Responsibility Triage Card */}
                <AIReplyTriageCard conversation={selectedConversation} />

                {/* AI Comprehensive Summary Card */}
                <AISummaryCard conversation={selectedConversation} />

                {/* Chronological Message Thread */}
                <MessageThreadView conversation={selectedConversation} />

                {/* Reply Composer */}
                <ReplyComposer conversation={selectedConversation} />
              </div>
            </div>
          ) : loading ? (
            <ReaderSkeleton onBack={handleBackToInbox} />
          ) : (
            <ConversationNotFound onBack={handleBackToInbox} />
          )}
        </ErrorBoundary>
      ) : (
        /* Spacious, Readable Email Conversation List View */
        <div
          key="inbox-list"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: '100%',
            minHeight: 0,
            backgroundColor: 'var(--color-surface)',
            overflow: 'hidden'
          }}
        >
          {/* List Header with Responsibility Filter Tabs & Search */}
          <ConversationListHeader />

          {/* Scrollable Conversation List */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {loading ? (
              <div style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--color-charcoal-muted)', fontSize: '13px' }}>
                Loading conversations...
              </div>
            ) : conversations.length === 0 ? (
              <div
                style={{
                  padding: '64px 24px',
                  textAlign: 'center',
                  color: 'var(--color-charcoal-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-surface-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-charcoal-light)'
                  }}
                >
                  <Inbox size={24} />
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                  No conversations found
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-charcoal-muted)', maxWidth: '300px', lineHeight: 1.5 }}>
                  No emails match this filter or search query in the active mailbox.
                </div>
              </div>
            ) : (
              conversations.map((conv) => (
                <ConversationListItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={conv.id === selectedConversationId}
                  onSelect={handleSelectConversation}
                  onToggleImportant={toggleImportant}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
