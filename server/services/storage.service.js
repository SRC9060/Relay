import { seedUsers, seedAccounts, seedConversations } from '../data/seedData.js';
import { classificationService } from './classification.service.js';

/**
 * StorageService
 * Provides in-memory persistence with fallback capabilities.
 * Manages conversation lifecycle, manual overrides, AI classifications,
 * incoming message simulation, and live counts.
 */
class StorageService {
  constructor() {
    this.users = [...seedUsers];
    this.accounts = [...seedAccounts];
    this.conversations = JSON.parse(JSON.stringify(seedConversations));
    this.syncHistory = [];

    // Ensure all seed conversations have baseline AI and override attributes
    this.conversations.forEach((c) => {
      if (c.needsReview === undefined) {
        c.needsReview = c.responsibility === 'review' || (c.confidenceScore && c.confidenceScore < 0.75);
      }
      if (c.isManualOverride === undefined) {
        c.isManualOverride = false;
      }
      if (c.pendingSuggestion === undefined) {
        c.pendingSuggestion = null;
      }
      if (!c.importantInformation) {
        c.importantInformation = [];
      }
      if (!c.identifiedDates) {
        c.identifiedDates = [];
      }
    });
  }

  // Users
  getUsers() {
    return this.users;
  }

  getUserById(id) {
    return this.users.find((u) => u.id === id) || null;
  }

  getUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  createUser(userData) {
    const newUser = {
      id: `user_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role || 'assistant',
      title: userData.title || (userData.role === 'client' ? 'Client' : 'Executive Assistant'),
      avatar: (userData.name || 'User')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    };
    this.users.push(newUser);
    return newUser;
  }

  // Accounts
  getAccounts() {
    return this.accounts;
  }

  getAccountById(id) {
    return this.accounts.find((a) => a.id === id) || null;
  }

  connectAccount({ provider, emailAddress, name }) {
    const existing = this.accounts.find(
      (a) => a.emailAddress.toLowerCase() === emailAddress.toLowerCase()
    );
    if (existing) {
      existing.connectionStatus = 'connected';
      existing.lastSyncedAt = new Date().toISOString();
      return existing;
    }

    const newAccount = {
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

    this.accounts.push(newAccount);
    return newAccount;
  }

  updateAccountSync(id) {
    const account = this.getAccountById(id);
    if (!account) return null;
    account.lastSyncedAt = new Date().toISOString();
    return account;
  }

  disconnectAccount(id) {
    const index = this.accounts.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this.accounts.splice(index, 1);
    return true;
  }

  // Conversations
  getConversations({ segment = 'all', accountId, q, filter } = {}) {
    let list = [...this.conversations];

    // Segment filter
    const seg = segment.toLowerCase();
    if (seg === 'all') {
      list = list.filter((c) => !c.isArchived);
    } else if (seg === 'action-required' || seg === 'action_required') {
      list = list.filter((c) => !c.isArchived && c.actionStatus === 'action_required');
    } else if (seg === 'assistant-reply' || seg === 'assistant_reply') {
      list = list.filter((c) => !c.isArchived && c.responsibility === 'assistant');
    } else if (seg === 'client-reply' || seg === 'client_reply') {
      list = list.filter((c) => !c.isArchived && c.responsibility === 'client');
    } else if (seg === 'client-queue' || seg === 'client_queue') {
      list = list.filter((c) => !c.isArchived && c.responsibility === 'client' && c.actionStatus !== 'completed' && c.actionStatus !== 'resolved');
    } else if (seg === 'no-reply' || seg === 'no_reply') {
      list = list.filter((c) => !c.isArchived && c.responsibility === 'none');
    } else if (seg === 'review' || seg === 'needs-review' || seg === 'needs_review') {
      list = list.filter((c) => !c.isArchived && (c.needsReview || c.responsibility === 'review'));
    } else if (seg === 'waiting') {
      list = list.filter((c) => !c.isArchived && c.actionStatus === 'waiting');
    } else if (seg === 'meetings') {
      list = list.filter((c) => !c.isArchived && (c.category === 'meetings' || c.category === 'scheduling'));
    } else if (seg === 'important') {
      list = list.filter((c) => !c.isArchived && c.isImportant);
    } else if (seg === 'archive' || seg === 'archived') {
      list = list.filter((c) => c.isArchived);
    }

    // Account filter
    if (accountId && accountId !== 'all') {
      list = list.filter((c) => c.accountId === accountId);
    }

    // Quick filter
    if (filter === 'unread') {
      list = list.filter((c) => c.isUnread);
    } else if (filter === 'important') {
      list = list.filter((c) => c.isImportant);
    } else if (filter === 'has_draft') {
      list = list.filter((c) => !!c.draft && c.draft.body);
    } else if (filter === 'needs_review') {
      list = list.filter((c) => c.needsReview || c.responsibility === 'review');
    }

    // Search query
    if (q && q.trim()) {
      const term = q.trim().toLowerCase();
      list = list.filter((c) => {
        const inSubject = c.subject && c.subject.toLowerCase().includes(term);
        const inPreview = c.preview && c.preview.toLowerCase().includes(term);
        const inSenderName = c.sender && c.sender.name && c.sender.name.toLowerCase().includes(term);
        const inSenderEmail = c.sender && c.sender.email && c.sender.email.toLowerCase().includes(term);
        const inMessages = c.messages && c.messages.some((m) => m.body && m.body.toLowerCase().includes(term));
        return inSubject || inPreview || inSenderName || inSenderEmail || inMessages;
      });
    }

    // Sort by lastMessageAt descending
    list.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

    return list;
  }

  getConversationById(id) {
    return this.conversations.find((c) => c.id === id) || null;
  }

  updateConversation(id, updates = {}) {
    const conv = this.getConversationById(id);
    if (!conv) return null;

    const allowed = ['isRead', 'isUnread', 'isImportant', 'isArchived', 'actionStatus', 'category', 'needsReview'];
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        if (key === 'isRead') {
          conv.isUnread = !updates.isRead;
        } else {
          conv[key] = updates[key];
        }
      }
    }
    return conv;
  }

  /**
   * Human Override Protection:
   * Sets manual human decision, flags isManualOverride=true, clears review state,
   * and clears any pending AI suggestion.
   */
  updateResponsibility(id, responsibility, reasoning) {
    const conv = this.getConversationById(id);
    if (!conv) return null;

    conv.responsibility = responsibility;
    conv.isManualOverride = true;
    conv.manualOverrideAt = new Date().toISOString();
    conv.manualDecision = responsibility;
    conv.needsReview = false; // Manual decision resolves review state
    conv.confidenceScore = 1.0;
    conv.pendingSuggestion = null;

    if (reasoning) {
      conv.aiReasoning = reasoning;
    } else {
      conv.aiReasoning = `Human override: Manually assigned to ${responsibility} by executive assistant.`;
    }

    return conv;
  }

  /**
   * Applies an AI classification result to a conversation, strictly respecting human overrides
   */
  applyClassification(id, classification) {
    const conv = this.getConversationById(id);
    if (!conv) return null;

    // Preserve non-responsibility AI extracted values
    conv.aiSummary = classification.summary;
    conv.importantInformation = classification.importantInformation || [];
    conv.identifiedDates = classification.identifiedDates || [];
    conv.aiSource = classification.aiSource;
    conv.modelUsed = classification.modelUsed;

    if (conv.isManualOverride) {
      // Human decision is protected: do not overwrite current responsibility
      if (classification.responsibility !== conv.responsibility) {
        conv.suggestedResponsibility = classification.responsibility;
        conv.pendingSuggestion = {
          responsibility: classification.responsibility,
          confidenceScore: classification.confidenceScore,
          explanation: classification.explanation,
          reason: `New information suggests ${classification.responsibility}. Manual override (${conv.responsibility}) currently active.`
        };
      } else {
        conv.pendingSuggestion = null;
      }
    } else {
      // Normal AI classification update
      conv.responsibility = classification.responsibility;
      conv.confidenceScore = classification.confidenceScore;
      conv.needsReview = Boolean(classification.needsReview || classification.confidenceScore < 0.75);
      conv.aiReasoning = classification.explanation;
      conv.pendingSuggestion = null;
    }

    return conv;
  }

  /**
   * Accept an AI suggested change after an override
   */
  acceptSuggestion(id) {
    const conv = this.getConversationById(id);
    if (!conv || !conv.pendingSuggestion) return conv;

    conv.responsibility = conv.pendingSuggestion.responsibility;
    conv.confidenceScore = conv.pendingSuggestion.confidenceScore;
    conv.aiReasoning = conv.pendingSuggestion.explanation;
    conv.isManualOverride = false;
    conv.manualDecision = null;
    conv.pendingSuggestion = null;
    conv.needsReview = Boolean(conv.confidenceScore < 0.75);

    return conv;
  }

  /**
   * Dismiss an AI suggested change, keeping the human override
   */
  dismissSuggestion(id) {
    const conv = this.getConversationById(id);
    if (!conv) return conv;
    conv.pendingSuggestion = null;
    return conv;
  }

  /**
   * Demonstrable Incoming Message Simulation:
   * Appends realistic new message to conversation, triggers AI re-classification,
   * and preserves manual overrides.
   */
  async simulateIncomingMessage(id, customMessage = {}) {
    const conv = this.getConversationById(id);
    if (!conv) return null;

    const senderName = conv.sender?.name || 'Counterparty';
    const senderEmail = conv.sender?.email || 'counterparty@external.com';

    let defaultBody = '';
    let isUrgent = false;

    // Contextual demo message generation
    if (conv.responsibility === 'assistant') {
      defaultBody = `Hi Elena,\n\nFollowing up on our earlier note: we have now received authorization for the booking. Could Mr. Vance personally confirm whether he requires formal execution sign-off on the Master Services Annex before departure?`;
      isUrgent = true;
    } else if (conv.responsibility === 'client') {
      defaultBody = `Marcus — Latham & Watkins has clarified Section 4. If you prefer, Elena can sign the operational appendix on your behalf if you authorize her via email. Let us know your decision.`;
    } else {
      defaultBody = `Update: An important operational deadline has been set for this thread. Please acknowledge receipt.`;
      isUrgent = true;
    }

    const newMsg = {
      id: `msg_incoming_${Date.now()}`,
      sender: {
        name: customMessage.senderName || senderName,
        email: customMessage.senderEmail || senderEmail
      },
      timestamp: new Date().toISOString(),
      body: customMessage.body || defaultBody
    };

    conv.messages.push(newMsg);
    conv.lastMessageAt = newMsg.timestamp;
    conv.isUnread = true;
    if (isUrgent) conv.actionStatus = 'action_required';

    // Re-evaluate with AI classification service
    try {
      const newClassification = await classificationService.classifyConversation(conv);
      this.applyClassification(id, newClassification);
    } catch (e) {
      console.error('[Relay] AI re-classification failed during incoming message simulation:', e);
    }

    return conv;
  }

  saveDraft(id, draft) {
    const conv = this.getConversationById(id);
    if (!conv) return null;

    conv.draft = {
      body: draft.body || '',
      updatedAt: new Date().toISOString()
    };
    return conv;
  }

  sendDraft(id) {
    const conv = this.getConversationById(id);
    if (!conv) return null;

    if (conv.draft && conv.draft.body) {
      const newMsg = {
        id: `msg_reply_${Date.now()}`,
        sender: {
          name: 'Elena Rostova (on behalf of Marcus Vance)',
          email: 'elena.rostova@relay-assistant.io'
        },
        timestamp: new Date().toISOString(),
        body: conv.draft.body
      };
      conv.messages.push(newMsg);
      conv.lastMessageAt = newMsg.timestamp;
      conv.draft = null;
      conv.actionStatus = 'waiting'; // Waiting for counterparty response
      conv.isUnread = false;
    }
    return conv;
  }

  restoreConversation(id) {
    const conv = this.getConversationById(id);
    if (!conv) return null;
    conv.isArchived = false;
    return conv;
  }

  markCompleted(id) {
    const conv = this.getConversationById(id);
    if (!conv) return null;
    conv.actionStatus = 'completed';
    return conv;
  }

  /**
   * Client Action: Mark as Handled
   * Marks conversation completed, preserves responsibility, removes from client queue,
   * and updates assistant workspace.
   */
  markHandled(id) {
    const conv = this.getConversationById(id);
    if (!conv) return null;
    conv.actionStatus = 'completed';
    conv.handledAt = new Date().toISOString();
    conv.handledBy = 'client';
    conv.pendingSuggestion = null;
    return conv;
  }

  /**
   * Client Action: Ask Assistant to Take Over
   * Reassigns responsibility to assistant, records human override by client,
   * marks actionStatus as action_required, and removes from client attention queue.
   */
  delegateToAssistant(id, notes) {
    const conv = this.getConversationById(id);
    if (!conv) return null;

    conv.responsibility = 'assistant';
    conv.isManualOverride = true;
    conv.delegatedBy = 'client';
    conv.actionStatus = 'action_required';
    conv.delegatedAt = new Date().toISOString();
    conv.confidenceScore = 1.0;
    conv.pendingSuggestion = null;
    conv.needsReview = false;
    conv.aiReasoning = notes || 'Delegated to executive assistant Elena Rostova by client Marcus Vance.';

    return conv;
  }

  getCounts(accountId) {
    let list = this.conversations;
    if (accountId && accountId !== 'all') {
      list = list.filter((c) => c.accountId === accountId);
    }

    const unarchived = list.filter((c) => !c.isArchived);

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
      archive: list.filter((c) => c.isArchived).length
    };
  }
}

export const storage = new StorageService();
