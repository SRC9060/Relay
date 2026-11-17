import { fallbackConversations } from '../data/fallbackConversations.js';

/**
 * Relay Client API Service
 * Communicates with the Express backend with local storage fallback for resilience.
 */

const getApiBase = () => {
  if (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '') + '/api';
  }
  if (typeof process !== 'undefined' && process?.env?.VITE_API_URL) {
    return process.env.VITE_API_URL.replace(/\/$/, '') + '/api';
  }
  return '/api';
};

const API_BASE = getApiBase();

// Fallback demo users if server is unreachable
const LOCAL_DEMO_USERS = [
  {
    id: 'user_assistant_01',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@relay-assistant.in',
    role: 'assistant',
    title: 'Senior Executive Assistant',
    avatar: 'AS',
    clientName: 'Arjun Mehta',
    clientId: 'user_client_01'
  },
  {
    id: 'user_client_01',
    name: 'Arjun Mehta',
    email: 'arjun.mehta@mehtaventures.in',
    role: 'client',
    title: 'Founder & Managing Partner',
    avatar: 'AM',
    assistantName: 'Ananya Sharma',
    assistantId: 'user_assistant_01'
  }
];

const LOCAL_ACCOUNTS_KEY = 'relay_connected_accounts';
const LOCAL_CONVERSATIONS_KEY = 'relay_conversations_v2';

function getLocalAccounts() {
  if (typeof localStorage !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore parse error
      }
    }
  }
  const defaults = [
    {
      id: 'acc_gmail_01',
      provider: 'gmail',
      name: 'Mehta Ventures Work Gmail',
      emailAddress: 'arjun.mehta@mehtaventures.in',
      connectionStatus: 'connected',
      isSimulated: true,
      lastSyncedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      totalEmails: 18,
      actionRequiredCount: 7
    },
    {
      id: 'acc_outlook_01',
      provider: 'outlook',
      name: 'Advisory Board Outlook',
      emailAddress: 'arjun.mehta@board-advisory.in',
      connectionStatus: 'connected',
      isSimulated: true,
      lastSyncedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      totalEmails: 14,
      actionRequiredCount: 4
    }
  ];
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(defaults));
  }
  return defaults;
}

function saveLocalAccounts(accounts) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

let _nodeMemConversations = null;

function getLocalConversations() {
  if (typeof localStorage !== 'undefined') {
    const cached = localStorage.getItem(LOCAL_CONVERSATIONS_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
  } else if (_nodeMemConversations) {
    return _nodeMemConversations;
  }
  const cloned = JSON.parse(JSON.stringify(fallbackConversations));
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_CONVERSATIONS_KEY, JSON.stringify(cloned));
  } else {
    _nodeMemConversations = cloned;
  }
  return cloned;
}

function saveLocalConversations(list) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCAL_CONVERSATIONS_KEY, JSON.stringify(list));
  } else {
    _nodeMemConversations = list;
  }
}

function computeLocalCounts(list, accountId) {
  let filtered = list;
  if (accountId && accountId !== 'all') {
    filtered = list.filter((c) => c.accountId === accountId);
  }
  const unarchived = filtered.filter((c) => !c.isArchived);
  return {
    all: unarchived.length,
    unread: unarchived.filter((c) => c.isUnread).length,
    actionRequired: unarchived.filter((c) => c.actionStatus === 'action_required').length,
    assistantReply: unarchived.filter((c) => c.responsibility === 'assistant').length,
    clientReply: unarchived.filter((c) => c.responsibility === 'client').length,
    clientQueue: unarchived.filter((c) => c.responsibility === 'client' && c.actionStatus !== 'completed' && c.actionStatus !== 'resolved').length,
    noReply: unarchived.filter((c) => c.responsibility === 'none').length,
    needsReview: unarchived.filter((c) => c.needsReview || c.responsibility === 'review').length,
    waiting: unarchived.filter((c) => c.actionStatus === 'waiting').length,
    meetings: unarchived.filter((c) => c.category === 'meetings' || c.category === 'scheduling').length,
    important: unarchived.filter((c) => c.isImportant).length,
    archive: filtered.filter((c) => c.isArchived).length
  };
}

export const api = {
  // Auth
  async getDemoUsers() {
    try {
      const res = await fetch(`${API_BASE}/auth/demo-users`);
      if (!res.ok) throw new Error('Network error');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for demo users');
      return LOCAL_DEMO_USERS;
    }
  },

  async login({ email, role }) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || 'Invalid email or password');
      }
      const json = await res.json();
      return json.data;
    } catch (e) {
      if (e.message && e.message !== 'Failed to fetch' && !e.message.includes('network') && !e.message.includes('fetch')) {
        throw e;
      }
      console.warn('[Relay API] Using local fallback for login');
      const user = LOCAL_DEMO_USERS.find((u) => (role ? u.role === role : u.email === email));
      if (!user) {
        throw new Error('Invalid email or password');
      }
      return { user, token: `mock_token_${user.id}` };
    }
  },

  async signup({ name, email, role }) {
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Signup failed');
      }
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for signup');
      const user = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: role || 'assistant',
        title: role === 'client' ? 'Client' : 'Executive Assistant',
        avatar: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
      };
      return { user, token: `mock_token_${user.id}` };
    }
  },

  // Accounts
  async getAccounts() {
    try {
      const res = await fetch(`${API_BASE}/accounts`);
      if (!res.ok) throw new Error('Fetch failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for accounts');
      return getLocalAccounts();
    }
  },

  async connectAccount({ provider, emailAddress, name }) {
    try {
      const res = await fetch(`${API_BASE}/accounts/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, emailAddress, name })
      });
      if (!res.ok) throw new Error('Connect failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for connect account');
      const accounts = getLocalAccounts();
      const newAcc = {
        id: `acc_${provider}_${Date.now()}`,
        provider,
        name: name || (provider === 'gmail' ? 'Google Workspace' : 'Microsoft 365'),
        emailAddress,
        connectionStatus: 'connected',
        isSimulated: true,
        lastSyncedAt: new Date().toISOString(),
        totalEmails: 12,
        actionRequiredCount: 3
      };
      accounts.push(newAcc);
      saveLocalAccounts(accounts);
      return newAcc;
    }
  },

  async syncAccount(id) {
    try {
      const res = await fetch(`${API_BASE}/accounts/${id}/sync`, { method: 'POST' });
      if (!res.ok) throw new Error('Sync failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for sync');
      const accounts = getLocalAccounts();
      const acc = accounts.find((a) => a.id === id);
      if (acc) {
        acc.lastSyncedAt = new Date().toISOString();
        saveLocalAccounts(accounts);
      }
      return acc;
    }
  },

  async disconnectAccount(id) {
    try {
      const res = await fetch(`${API_BASE}/accounts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Disconnect failed');
      return true;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for disconnect');
      const accounts = getLocalAccounts().filter((a) => a.id !== id);
      saveLocalAccounts(accounts);
      return true;
    }
  },

  // Conversations
  async getConversations({ segment = 'all', accountId, q, filter } = {}) {
    try {
      const params = new URLSearchParams();
      if (segment) params.set('segment', segment);
      if (accountId && accountId !== 'all') params.set('accountId', accountId);
      if (q) params.set('q', q);
      if (filter) params.set('filter', filter);

      const res = await fetch(`${API_BASE}/conversations?${params.toString()}`);
      if (!res.ok) throw new Error('Fetch conversations failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for conversations');
      const all = getLocalConversations();
      let list = [...all];

      const seg = segment.toLowerCase();
      if (seg === 'all') list = list.filter((c) => !c.isArchived);
      else if (seg === 'action-required' || seg === 'action_required') list = list.filter((c) => !c.isArchived && c.actionStatus === 'action_required');
      else if (seg === 'assistant-reply' || seg === 'assistant_reply') list = list.filter((c) => !c.isArchived && c.responsibility === 'assistant');
      else if (seg === 'client-reply' || seg === 'client_reply') list = list.filter((c) => !c.isArchived && c.responsibility === 'client');
      else if (seg === 'client-queue' || seg === 'client_queue') list = list.filter((c) => !c.isArchived && c.responsibility === 'client' && c.actionStatus !== 'completed' && c.actionStatus !== 'resolved');
      else if (seg === 'no-reply' || seg === 'no_reply') list = list.filter((c) => !c.isArchived && c.responsibility === 'none');
      else if (seg === 'review' || seg === 'needs-review' || seg === 'needs_review') list = list.filter((c) => !c.isArchived && (c.needsReview || c.responsibility === 'review'));
      else if (seg === 'waiting') list = list.filter((c) => !c.isArchived && c.actionStatus === 'waiting');
      else if (seg === 'meetings') list = list.filter((c) => !c.isArchived && (c.category === 'meetings' || c.category === 'scheduling'));
      else if (seg === 'important') list = list.filter((c) => !c.isArchived && c.isImportant);
      else if (seg === 'archive' || seg === 'archived') list = list.filter((c) => c.isArchived);

      if (accountId && accountId !== 'all') {
        list = list.filter((c) => c.accountId === accountId);
      }

      if (filter === 'unread') list = list.filter((c) => c.isUnread);
      else if (filter === 'important') list = list.filter((c) => c.isImportant);
      else if (filter === 'has_draft') list = list.filter((c) => !!c.draft && c.draft.body);

      if (q && q.trim()) {
        const term = q.trim().toLowerCase();
        list = list.filter((c) => {
          const inSubject = c.subject && c.subject.toLowerCase().includes(term);
          const inPreview = c.preview && c.preview.toLowerCase().includes(term);
          const inSender = c.sender && (c.sender.name.toLowerCase().includes(term) || c.sender.email.toLowerCase().includes(term));
          const inMessages = c.messages && c.messages.some((m) => m.body && m.body.toLowerCase().includes(term));
          return inSubject || inPreview || inSender || inMessages;
        });
      }

      list.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
      const counts = computeLocalCounts(all, accountId);
      return { success: true, data: list, counts };
    }
  },

  async getConversation(id) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`);
      if (!res.ok) throw new Error('Fetch conversation failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for single conversation');
      const all = getLocalConversations();
      return all.find((c) => c.id === id) || null;
    }
  },

  async updateConversation(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error('Update conversation failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for update conversation');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        if (updates.isRead !== undefined) conv.isUnread = !updates.isRead;
        if (updates.isUnread !== undefined) conv.isUnread = updates.isUnread;
        if (updates.isImportant !== undefined) conv.isImportant = updates.isImportant;
        if (updates.isArchived !== undefined) conv.isArchived = updates.isArchived;
        if (updates.actionStatus !== undefined) conv.actionStatus = updates.actionStatus;
        saveLocalConversations(all);
      }
      const counts = computeLocalCounts(all);
      return { success: true, data: conv, counts };
    }
  },

  async updateResponsibility(id, responsibility, reasoning) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/responsibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responsibility, reasoning })
      });
      if (!res.ok) throw new Error('Update responsibility failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for update responsibility');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        conv.responsibility = responsibility;
        conv.confidenceScore = 1.0;
        conv.aiReasoning = reasoning || `Manually assigned to ${responsibility} by executive assistant.`;
        saveLocalConversations(all);
      }
      const counts = computeLocalCounts(all);
      return { success: true, data: conv, counts };
    }
  },

  async saveDraft(id, draft) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/drafts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      if (!res.ok) throw new Error('Save draft failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for save draft');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        conv.draft = { body: draft.body || '', updatedAt: new Date().toISOString() };
        saveLocalConversations(all);
      }
      return conv;
    }
  },

  async sendDraft(id) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/send`, { method: 'POST' });
      if (!res.ok) throw new Error('Send draft failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for send draft');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv && conv.draft && conv.draft.body) {
        const newMsg = {
          id: `msg_reply_${Date.now()}`,
          sender: { name: 'Ananya Sharma (on behalf of Arjun Mehta)', email: 'ananya.sharma@relay-assistant.in' },
          timestamp: new Date().toISOString(),
          body: conv.draft.body
        };
        conv.messages.push(newMsg);
        conv.lastMessageAt = newMsg.timestamp;
        conv.draft = null;
        conv.actionStatus = 'waiting';
        conv.isUnread = false;
        saveLocalConversations(all);
      }
      const counts = computeLocalCounts(all);
      return { success: true, data: conv, counts, simulated: true };
    }
  },

  async restoreConversation(id) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/restore`, { method: 'POST' });
      if (!res.ok) throw new Error('Restore failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for restore');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        conv.isArchived = false;
        saveLocalConversations(all);
      }
      const counts = computeLocalCounts(all);
      return { success: true, data: conv, counts };
    }
  },

  async markCompleted(id) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/complete`, { method: 'POST' });
      if (!res.ok) throw new Error('Complete failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for mark completed');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        conv.actionStatus = 'completed';
        saveLocalConversations(all);
      }
      const counts = computeLocalCounts(all);
      return { success: true, data: conv, counts };
    }
  },

  async markHandled(id) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/handled`, { method: 'POST' });
      if (!res.ok) throw new Error('Mark handled failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for mark handled');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        conv.actionStatus = 'completed';
        conv.handledAt = new Date().toISOString();
        conv.handledBy = 'client';
        conv.pendingSuggestion = null;
        saveLocalConversations(all);
      }
      const counts = computeLocalCounts(all);
      return { success: true, data: conv, counts };
    }
  },

  async delegateToAssistant(id, notes = '') {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/delegate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (!res.ok) throw new Error('Delegate to assistant failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for delegate to assistant');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        conv.responsibility = 'assistant';
        conv.isManualOverride = true;
        conv.delegatedBy = 'client';
        conv.actionStatus = 'action_required';
        conv.delegatedAt = new Date().toISOString();
        conv.confidenceScore = 1.0;
        conv.pendingSuggestion = null;
        conv.needsReview = false;
        conv.aiReasoning = notes || 'Delegated to executive assistant Ananya Sharma by client Arjun Mehta.';
        saveLocalConversations(all);
      }
      const counts = computeLocalCounts(all);
      return { success: true, data: conv, counts };
    }
  },

  async getCounts(accountId) {
    try {
      const params = accountId && accountId !== 'all' ? `?accountId=${accountId}` : '';
      const res = await fetch(`${API_BASE}/conversations/counts${params}`);
      if (!res.ok) throw new Error('Get counts failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for counts');
      const all = getLocalConversations();
      return computeLocalCounts(all, accountId);
    }
  },

  async markAllRead(accountId) {
    try {
      const res = await fetch(`${API_BASE}/conversations/mark-all-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId })
      });
      if (!res.ok) throw new Error('Mark all read failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for mark all read');
      const all = getLocalConversations();
      all.forEach((c) => {
        if (!accountId || accountId === 'all' || c.accountId === accountId) {
          c.isUnread = false;
        }
      });
      saveLocalConversations(all);
      const counts = computeLocalCounts(all, accountId);
      return { success: true, counts };
    }
  },

  // Milestone 3: AI Intelligence Endpoints
  async getAiStatus() {
    try {
      const res = await fetch(`${API_BASE}/conversations/ai-status`);
      if (!res.ok) throw new Error('AI status failed');
      const json = await res.json();
      return json.data;
    } catch {
      return {
        isConfigured: false,
        model: 'deterministic-engine',
        aiSource: 'deterministic-fallback',
        envVarName: 'GEMINI_API_KEY'
      };
    }
  },

  async classifyConversation(id) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/classify`, { method: 'POST' });
      if (!res.ok) throw new Error('Classify failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for classify');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        conv.aiSource = 'deterministic-fallback';
        conv.classifiedAt = new Date().toISOString();
        saveLocalConversations(all);
      }
      return { success: true, data: conv, classification: conv, counts: computeLocalCounts(all) };
    }
  },

  async getSummary(id) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/summary`, { method: 'POST' });
      if (!res.ok) throw new Error('Summary failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for summary');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id) || {};
      return {
        overview: `Executive summary for ${conv.subject || 'selected conversation'}. Key action items extracted.`,
        latestDevelopments: conv.preview || 'Awaiting counterparty updates.',
        keyDecisions: ['Terms under executive review'],
        pendingQuestions: ['Awaiting response or approval'],
        deadlines: ['Standard business timeline'],
        responsibleParty: conv.responsibility || 'assistant',
        recommendedAction: 'Review correspondence and proceed with drafted response.',
        aiSource: 'deterministic-fallback'
      };
    }
  },

  async generateReply(id, { intent = 'confirm', instructions = '' } = {}) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/generate-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intent, instructions })
      });
      if (!res.ok) throw new Error('Reply generation failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for generate reply');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id) || {};
      const senderName = conv.sender?.name?.split(' ')[0] || 'Sir/Madam';
      return {
        subject: `Re: ${conv.subject || 'Correspondence'}`,
        body: `Dear ${senderName},\n\nThank you for your correspondence regarding "${conv.subject}".\n\nI have confirmed the details with Mr. Mehta and we are pleased to proceed on this basis.\n\nWarm regards,\nAnanya Sharma\nExecutive Assistant to Arjun Mehta`,
        intentApplied: intent,
        tone: 'Executive Professional',
        keyPointsAddressed: ['Acknowledged message', 'Approved next steps on behalf of client'],
        aiSource: 'deterministic-fallback'
      };
    }
  },

  async simulateIncomingMessage(id, messageData = {}) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/incoming-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      if (!res.ok) throw new Error('Simulate incoming message failed');
      const json = await res.json();
      return json;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for incoming message');
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        const newMsg = {
          id: `msg_incoming_${Date.now()}`,
          sender: { name: conv.sender?.name || 'Counterparty', email: conv.sender?.email || 'external@partner.com' },
          timestamp: new Date().toISOString(),
          body: messageData.body || 'Hi Ananya, could Mr. Mehta personally confirm the attached schedule before noon tomorrow?'
        };
        conv.messages.push(newMsg);
        conv.lastMessageAt = newMsg.timestamp;
        conv.isUnread = true;
        saveLocalConversations(all);
      }
      return { success: true, data: conv, counts: computeLocalCounts(all), simulated: true };
    }
  },

  async acceptSuggestion(id) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/accept-suggestion`, { method: 'POST' });
      if (!res.ok) throw new Error('Accept suggestion failed');
      const json = await res.json();
      return json;
    } catch (e) {
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv && conv.pendingSuggestion) {
        conv.responsibility = conv.pendingSuggestion.responsibility;
        conv.isManualOverride = false;
        conv.pendingSuggestion = null;
        saveLocalConversations(all);
      }
      return { success: true, data: conv, counts: computeLocalCounts(all) };
    }
  },

  async dismissSuggestion(id) {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}/dismiss-suggestion`, { method: 'POST' });
      if (!res.ok) throw new Error('Dismiss suggestion failed');
      const json = await res.json();
      return json;
    } catch (e) {
      const all = getLocalConversations();
      const conv = all.find((c) => c.id === id);
      if (conv) {
        conv.pendingSuggestion = null;
        saveLocalConversations(all);
      }
      return { success: true, data: conv, counts: computeLocalCounts(all) };
    }
  },

  async askCopilot({ query, conversationId, accountId }) {
    try {
      const res = await fetch(`${API_BASE}/conversations/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, conversationId, accountId })
      });
      if (!res.ok) throw new Error('Copilot query failed');
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.warn('[Relay API] Using local fallback for Copilot');
      const all = getLocalConversations();
      const q = (query || '').toLowerCase();
      const unarchived = all.filter((c) => !c.isArchived);

      const pendingClient = unarchived.filter(
        (c) => c.responsibility === 'client' && c.actionStatus !== 'completed' && c.actionStatus !== 'resolved'
      );
      const handled = unarchived.filter((c) => c.actionStatus === 'completed' || c.handledBy);
      const pendingAssistant = unarchived.filter(
        (c) => c.responsibility === 'assistant' && c.actionStatus === 'action_required'
      );
      const waiting = unarchived.filter((c) => c.actionStatus === 'waiting');

      // Specific conversation match
      const matched = unarchived.find((c) => {
        const sub = (c.subject || '').toLowerCase();
        return sub && q.includes(sub.slice(0, 15));
      });

      if (matched && (q.includes('is ') || q.includes('status') || q.includes('awaiting') || q.includes('handled') || q.includes('still'))) {
        const isDone = matched.actionStatus === 'completed' || matched.handledBy;
        return {
          answer: `**"${matched.subject}"** has already been **handled and completed**${matched.handledBy === 'client' ? ' by Arjun Mehta' : ''}. It is no longer pending or awaiting action.`,
          referencedConversations: [{
            id: matched.id,
            subject: matched.subject,
            sender: matched.sender?.name,
            time: matched.lastMessageAt,
            responsibility: matched.responsibility,
            actionStatus: matched.actionStatus,
            handledBy: matched.handledBy || null
          }],
          queryType: 'status_check',
          aiSource: 'deterministic-fallback'
        };
      }

      if (q.includes('handled') || q.includes('completed')) {
        return {
          answer: `Identified ${handled.length} completed conversation${handled.length === 1 ? '' : 's'}. Handled items are safely archived as completed.`,
          referencedConversations: handled.slice(0, 5).map((c) => ({
            id: c.id,
            subject: c.subject,
            sender: c.sender?.name,
            time: c.lastMessageAt,
            responsibility: c.responsibility,
            actionStatus: c.actionStatus,
            handledBy: c.handledBy || null
          })),
          queryType: 'list',
          segment: 'handled',
          aiSource: 'deterministic-fallback'
        };
      }

      if (q.includes('client') || q.includes('arjun') || q.includes('decisions')) {
        return {
          answer: `There are currently **${pendingClient.length}** conversations requiring Arjun Mehta's personal decision or review. Completed items are excluded.`,
          referencedConversations: pendingClient.map((c) => ({
            id: c.id,
            subject: c.subject,
            sender: c.sender?.name,
            time: c.lastMessageAt,
            responsibility: c.responsibility,
            actionStatus: c.actionStatus,
            handledBy: c.handledBy || null
          })),
          queryType: 'list',
          segment: 'client-reply',
          aiSource: 'deterministic-fallback'
        };
      }

      if (q.includes('waiting')) {
        return {
          answer: `You are currently waiting for a counterparty response on ${waiting.length} conversation${waiting.length === 1 ? '' : 's'}.`,
          referencedConversations: waiting.map((c) => ({
            id: c.id,
            subject: c.subject,
            sender: c.sender?.name,
            time: c.lastMessageAt,
            responsibility: c.responsibility,
            actionStatus: c.actionStatus
          })),
          queryType: 'list',
          segment: 'waiting',
          aiSource: 'deterministic-fallback'
        };
      }

      return {
        answer: `You currently have ${pendingAssistant.length} conversations requiring assistant attention across Arjun Mehta's accounts.`,
        referencedConversations: pendingAssistant.slice(0, 4).map((c) => ({
          id: c.id,
          subject: c.subject,
          sender: c.sender?.name,
          time: c.lastMessageAt,
          responsibility: c.responsibility,
          actionStatus: c.actionStatus
        })),
        queryType: 'list',
        segment: 'assistant-reply',
        aiSource: 'deterministic-fallback'
      };
    }
  }
};
