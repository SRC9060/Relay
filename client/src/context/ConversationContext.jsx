import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { fallbackConversations } from '../data/fallbackConversations';
import { useAccounts } from './AccountContext';

const ConversationContext = createContext(null);

export function ConversationProvider({ children }) {
  const { selectedAccountId } = useAccounts();

  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('id') || null;
    }
    return null;
  });
  const [selectedConversation, setSelectedConversation] = useState(() => {
    if (typeof window !== 'undefined') {
      const id = new URLSearchParams(window.location.search).get('id');
      if (id) {
        try {
          const cached = localStorage.getItem('relay_conversations_v2');
          if (cached) {
            const list = JSON.parse(cached);
            const found = list.find((c) => c.id === id);
            if (found) return found;
          }
        } catch {
          // ignore
        }
        const fallback = fallbackConversations.find((c) => c.id === id);
        if (fallback) return fallback;
      }
    }
    return null;
  });
  const [activeSegment, setActiveSegment] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('segment') || 'all';
    }
    return 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [subFilter, setSubFilter] = useState('all'); // all | unread | important | has_draft
  const [counts, setCounts] = useState({
    all: 17,
    unread: 7,
    actionRequired: 11,
    assistantReply: 7,
    clientReply: 5,
    clientQueue: 5,
    noReply: 4,
    needsReview: 1,
    waiting: 1,
    meetings: 4,
    important: 8,
    archive: 1
  });
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  // Fetch conversations based on segment, account, search query, and filter
  const fetchConversations = useCallback(async (preserveSelection = true) => {
    setLoading(true);
    try {
      const res = await api.getConversations({
        segment: activeSegment,
        accountId: selectedAccountId,
        q: searchQuery,
        filter: subFilter
      });
      if (res && res.data) {
        setConversations(res.data);
        if (res.counts) {
          setCounts(res.counts);
        }

        // Selection maintenance: prioritize URL id if present, followed by active selection
        const urlId = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('id') : null;
        const targetId = urlId || (preserveSelection ? selectedConversationId : null);

        if (targetId) {
          const found = res.data.find((c) => c.id === targetId);
          if (found) {
            setSelectedConversationId(targetId);
            setSelectedConversation(found);
          } else {
            // Preserve currently selected conversation even if not present in the filtered slice
            setSelectedConversationId(targetId);
            setSelectedConversation((prev) => {
              if (prev && prev.id === targetId) return prev;
              const fallback = fallbackConversations.find((c) => c.id === targetId);
              return fallback || prev;
            });

            // Asynchronously fetch full thread if not present in memory
            api.getConversation(targetId).then((full) => {
              if (full) setSelectedConversation(full);
            }).catch(() => {});
          }
        } else {
          // List-first mode: do not auto-force reader selection
          setSelectedConversationId(null);
          setSelectedConversation(null);
        }
      }
    } catch (err) {
      console.error('[Relay] Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [activeSegment, selectedAccountId, searchQuery, subFilter, selectedConversationId]);

  // Initial and reactive load
  useEffect(() => {
    fetchConversations(true);
  }, [activeSegment, selectedAccountId, searchQuery, subFilter]);

  // Also fetch counts on mount
  useEffect(() => {
    api.getCounts(selectedAccountId).then((c) => {
      if (c) setCounts(c);
    }).catch(() => {});
  }, [selectedAccountId]);

  // Toggle Read / Unread
  const toggleRead = useCallback(async (id, forceRead) => {
    let newIsUnread = false;

    setConversations((prev) => {
      const target = prev.find((c) => c.id === id);
      newIsUnread = forceRead !== undefined ? !forceRead : (target ? !target.isUnread : false);
      return prev.map((c) => (c.id === id ? { ...c, isUnread: newIsUnread } : c));
    });

    setSelectedConversation((prev) => {
      if (!prev || prev.id !== id) return prev;
      const targetUnread = forceRead !== undefined ? !forceRead : !prev.isUnread;
      return { ...prev, isUnread: targetUnread };
    });

    setCounts((prev) => ({
      ...prev,
      unread: Math.max(0, prev.unread + (newIsUnread ? 1 : -1))
    }));

    try {
      const res = await api.updateConversation(id, { isUnread: newIsUnread });
      if (res && res.counts) setCounts(res.counts);
    } catch (err) {
      console.error('Failed to update read status:', err);
    }
  }, []);

  // Select a conversation by ID
  const selectConversation = useCallback(async (id) => {
    if (!id) {
      setSelectedConversationId(null);
      setSelectedConversation(null);
      return null;
    }
    setSelectedConversationId(id);

    // Immediate optimistic match from fallback or state
    let matched = fallbackConversations.find((c) => c.id === id) || null;
    setConversations((prev) => {
      const found = prev.find((c) => c.id === id);
      if (found) matched = found;
      return prev;
    });

    if (matched) {
      setSelectedConversation(matched);
      if (matched.isUnread) {
        toggleRead(id, true);
      }
    }

    try {
      const full = await api.getConversation(id);
      if (full) {
        setSelectedConversation(full);
        if (full.isUnread) {
          toggleRead(id, true);
        }
        return full;
      }
    } catch (e) {
      if (!matched) {
        console.error('Failed to load full thread:', e);
      }
    }
    return matched;
  }, [toggleRead]);

  // Toggle Important
  const toggleImportant = useCallback(async (id) => {
    const target = conversations.find((c) => c.id === id) || selectedConversation;
    if (!target) return;

    const newIsImportant = !target.isImportant;

    // Optimistic update
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isImportant: newIsImportant } : c))
    );
    if (selectedConversation && selectedConversation.id === id) {
      setSelectedConversation((prev) => ({ ...prev, isImportant: newIsImportant }));
    }
    setCounts((prev) => ({
      ...prev,
      important: Math.max(0, prev.important + (newIsImportant ? 1 : -1))
    }));

    try {
      const res = await api.updateConversation(id, { isImportant: newIsImportant });
      if (res && res.counts) setCounts(res.counts);
      showToast(newIsImportant ? 'Marked as important' : 'Removed from important');
    } catch (err) {
      console.error('Failed to update importance:', err);
    }
  }, [conversations, selectedConversation, showToast]);

  // Archive conversation
  const archiveConversation = useCallback(async (id) => {
    // Optimistic update
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (selectedConversationId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setSelectedConversationId(remaining[0].id);
        setSelectedConversation(remaining[0]);
      } else {
        setSelectedConversationId(null);
        setSelectedConversation(null);
      }
    }

    try {
      const res = await api.updateConversation(id, { isArchived: true });
      if (res && res.counts) setCounts(res.counts);
      showToast('Conversation archived');
    } catch (err) {
      console.error('Failed to archive:', err);
    }
  }, [conversations, selectedConversationId, showToast]);

  // Restore archived conversation
  const restoreConversation = useCallback(async (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await api.restoreConversation(id);
      if (res && res.counts) setCounts(res.counts);
      showToast('Conversation restored to inbox');
    } catch (err) {
      console.error('Failed to restore:', err);
    }
  }, [showToast]);

  // Mark Completed
  const markCompleted = useCallback(async (id) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, actionStatus: 'completed' } : c))
    );
    if (selectedConversation && selectedConversation.id === id) {
      setSelectedConversation((prev) => ({ ...prev, actionStatus: 'completed' }));
    }

    try {
      const res = await api.markCompleted(id);
      if (res && res.counts) setCounts(res.counts);
      showToast('Conversation marked completed');
    } catch (err) {
      console.error('Failed to mark completed:', err);
    }
  }, [selectedConversation, showToast]);

  // Client Action: Mark Handled
  const markHandled = useCallback(async (id) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, actionStatus: 'completed', handledAt: new Date().toISOString(), handledBy: 'client' }
          : c
      )
    );
    if (selectedConversation && selectedConversation.id === id) {
      setSelectedConversation((prev) => ({
        ...prev,
        actionStatus: 'completed',
        handledAt: new Date().toISOString(),
        handledBy: 'client'
      }));
    }

    try {
      const res = await api.markHandled(id);
      if (res && res.counts) setCounts(res.counts);
      showToast('Marked as handled. Completed in client attention queue.');
      return res;
    } catch (err) {
      console.error('Failed to mark handled:', err);
    }
  }, [selectedConversation, showToast]);

  // Client Action: Delegate to Assistant
  const delegateToAssistant = useCallback(async (id, notes = '') => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              responsibility: 'assistant',
              isManualOverride: true,
              delegatedBy: 'client',
              actionStatus: 'action_required',
              delegatedAt: new Date().toISOString()
            }
          : c
      )
    );
    if (selectedConversation && selectedConversation.id === id) {
      setSelectedConversation((prev) => ({
        ...prev,
        responsibility: 'assistant',
        isManualOverride: true,
        delegatedBy: 'client',
        actionStatus: 'action_required',
        delegatedAt: new Date().toISOString()
      }));
    }

    try {
      const res = await api.delegateToAssistant(id, notes);
      if (res && res.counts) setCounts(res.counts);
      showToast('Delegated to assistant Elena Rostova with priority.');
      return res;
    } catch (err) {
      console.error('Failed to delegate to assistant:', err);
    }
  }, [selectedConversation, showToast]);

  // Change Responsibility
  const changeResponsibility = useCallback(async (id, newResp) => {
    const target = conversations.find((c) => c.id === id) || selectedConversation;
    if (!target) return;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              responsibility: newResp,
              confidenceScore: 1.0,
              aiReasoning: `Manually assigned to ${newResp} by executive assistant.`
            }
          : c
      )
    );
    if (selectedConversation && selectedConversation.id === id) {
      setSelectedConversation((prev) => ({
        ...prev,
        responsibility: newResp,
        confidenceScore: 1.0,
        aiReasoning: `Manually assigned to ${newResp} by executive assistant.`
      }));
    }

    try {
      const res = await api.updateResponsibility(id, newResp);
      if (res && res.counts) setCounts(res.counts);
      showToast(`Responsibility updated: ${newResp}`);
    } catch (err) {
      console.error('Failed to update responsibility:', err);
    }
  }, [conversations, selectedConversation, showToast]);

  // Save Draft
  const saveDraft = useCallback(async (id, body) => {
    try {
      const updated = await api.saveDraft(id, { body });
      if (updated) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, draft: updated.draft } : c))
        );
        if (selectedConversation && selectedConversation.id === id) {
          setSelectedConversation((prev) => ({ ...prev, draft: updated.draft }));
        }
        showToast('Draft saved successfully');
      }
    } catch (err) {
      console.error('Failed to save draft:', err);
    }
  }, [selectedConversation, showToast]);

  // Simulated Send
  const sendDraft = useCallback(async (id) => {
    try {
      const res = await api.sendDraft(id);
      if (res && res.data) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? res.data : c))
        );
        if (selectedConversation && selectedConversation.id === id) {
          setSelectedConversation(res.data);
        }
        if (res.counts) setCounts(res.counts);
        showToast('Reply simulated & sent (waiting for response)');
      }
    } catch (err) {
      console.error('Failed to send draft:', err);
    }
  }, [selectedConversation, showToast]);

  // Navigate between conversations (Previous / Next)
  const navigateConversation = useCallback((direction) => {
    if (!conversations.length || !selectedConversationId) return null;
    const currentIndex = conversations.findIndex((c) => c.id === selectedConversationId);
    if (currentIndex === -1) return null;

    let target = null;
    if (direction === 'prev' && currentIndex > 0) {
      target = conversations[currentIndex - 1];
    } else if (direction === 'next' && currentIndex < conversations.length - 1) {
      target = conversations[currentIndex + 1];
    }

    if (target) {
      selectConversation(target.id);
      return target;
    }
    return null;
  }, [conversations, selectedConversationId, selectConversation]);

  // AI Status
  const [aiStatus, setAiStatus] = useState({ isConfigured: false, model: 'gemini-3.8-flash', aiSource: 'deterministic-fallback' });
  useEffect(() => {
    api.getAiStatus().then(setAiStatus).catch(() => {});
  }, []);

  // AI: Classify Conversation
  const classifyConversation = useCallback(async (id) => {
    try {
      const res = await api.classifyConversation(id);
      if (res && res.data) {
        setConversations((prev) => prev.map((c) => (c.id === id ? res.data : c)));
        if (selectedConversation && selectedConversation.id === id) {
          setSelectedConversation(res.data);
        }
        if (res.counts) setCounts(res.counts);
        showToast('AI Triage evaluation complete');
      }
      return res;
    } catch (err) {
      console.error('Classification error:', err);
    }
  }, [selectedConversation, showToast]);

  // AI: Simulate Incoming Message
  const simulateIncomingMessage = useCallback(async (id, customMsg) => {
    try {
      const res = await api.simulateIncomingMessage(id, customMsg);
      if (res && res.data) {
        setConversations((prev) => prev.map((c) => (c.id === id ? res.data : c)));
        if (selectedConversation && selectedConversation.id === id) {
          setSelectedConversation(res.data);
        }
        if (res.counts) setCounts(res.counts);
        showToast('New incoming message simulated & re-evaluated');
      }
      return res;
    } catch (err) {
      console.error('Incoming message simulation error:', err);
    }
  }, [selectedConversation, showToast]);

  // AI: Accept Suggestion
  const acceptSuggestion = useCallback(async (id) => {
    try {
      const res = await api.acceptSuggestion(id);
      if (res && res.data) {
        setConversations((prev) => prev.map((c) => (c.id === id ? res.data : c)));
        if (selectedConversation && selectedConversation.id === id) {
          setSelectedConversation(res.data);
        }
        if (res.counts) setCounts(res.counts);
        showToast('AI recommendation accepted');
      }
    } catch (err) {
      console.error('Accept suggestion error:', err);
    }
  }, [selectedConversation, showToast]);

  // AI: Dismiss Suggestion
  const dismissSuggestion = useCallback(async (id) => {
    try {
      const res = await api.dismissSuggestion(id);
      if (res && res.data) {
        setConversations((prev) => prev.map((c) => (c.id === id ? res.data : c)));
        if (selectedConversation && selectedConversation.id === id) {
          setSelectedConversation(res.data);
        }
        if (res.counts) setCounts(res.counts);
        showToast('AI suggestion dismissed (human override retained)');
      }
    } catch (err) {
      console.error('Dismiss suggestion error:', err);
    }
  }, [selectedConversation, showToast]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        selectedConversationId,
        selectedConversation,
        activeSegment,
        setActiveSegment,
        searchQuery,
        setSearchQuery,
        subFilter,
        setSubFilter,
        counts,
        loading,
        toastMessage,
        aiStatus,
        selectConversation,
        toggleRead,
        toggleImportant,
        archiveConversation,
        restoreConversation,
        markCompleted,
        markHandled,
        delegateToAssistant,
        changeResponsibility,
        saveDraft,
        sendDraft,
        navigateConversation,
        classifyConversation,
        simulateIncomingMessage,
        acceptSuggestion,
        dismissSuggestion,
        getSummary: api.getSummary,
        generateReply: api.generateReply,
        refreshConversations: fetchConversations
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
}
