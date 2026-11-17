import mongoose from 'mongoose';
import { User } from '../models/User.model.js';
import { Account } from '../models/Account.model.js';
import { Conversation } from '../models/Conversation.model.js';
import { classificationService } from './classification.service.js';
import { seedUsers, seedAccounts, seedConversations } from '../data/seedData.js';

/**
 * StorageService for Relay
 * Backed by MongoDB Atlas via Mongoose models.
 * Manages conversation lifecycle, manual overrides, AI classifications,
 * incoming message simulation, and live synchronized counts.
 */
class StorageService {
  constructor() {
    // In-memory fallback dataset for isolated/offline testing if MongoDB is unavailable
    this._memUsers = [...seedUsers];
    this._memAccounts = [...seedAccounts];
    this._memConversations = JSON.parse(JSON.stringify(seedConversations));
    this._initMemConversations();
  }

  _initMemConversations() {
    this._memConversations.forEach((c) => {
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

  isDbReady() {
    return mongoose.connection.readyState === 1;
  }

  // ============================================================================
  // USERS
  // ============================================================================

  async getUsers() {
    if (this.isDbReady()) {
      return await User.find().lean();
    }
    return this._memUsers;
  }

  async getUserById(id) {
    if (this.isDbReady()) {
      return await User.findOne({ id }).lean();
    }
    return this._memUsers.find((u) => u.id === id) || null;
  }

  async getUserByEmail(email) {
    if (!email) return null;
    const clean = email.toLowerCase().trim();
    if (this.isDbReady()) {
      return await User.findOne({ email: clean }).lean();
    }
    return this._memUsers.find((u) => u.email.toLowerCase() === clean) || null;
  }

  async createUser(userData) {
    const id = `user_${Date.now()}`;
    const cleanEmail = userData.email.toLowerCase().trim();
    const newUser = {
      id,
      name: userData.name,
      email: cleanEmail,
      role: userData.role || 'assistant',
      title: userData.title || (userData.role === 'client' ? 'Client' : 'Executive Assistant'),
      avatar: (userData.name || 'User')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    };

    if (this.isDbReady()) {
      const created = await User.create(newUser);
      return created.toObject ? created.toObject() : created;
    }

    this._memUsers.push(newUser);
    return newUser;
  }

  // ============================================================================
  // ACCOUNTS
  // ============================================================================

  async getAccounts() {
    if (this.isDbReady()) {
      return await Account.find().lean();
    }
    return this._memAccounts;
  }

  async getAccountById(id) {
    if (this.isDbReady()) {
      return await Account.findOne({ id }).lean();
    }
    return this._memAccounts.find((a) => a.id === id) || null;
  }

  async connectAccount({ provider, emailAddress, name }) {
    const cleanEmail = emailAddress.toLowerCase().trim();

    if (this.isDbReady()) {
      const existing = await Account.findOne({ emailAddress: cleanEmail });
      if (existing) {
        existing.connectionStatus = 'connected';
        existing.lastSyncedAt = new Date().toISOString();
        await existing.save();
        return existing.toObject ? existing.toObject() : existing;
      }

      const newAccount = await Account.create({
        id: `acc_${provider}_${Date.now()}`,
        provider,
        name: name || (provider === 'gmail' ? 'Google Workspace' : 'Microsoft 365'),
        emailAddress: cleanEmail,
        connectionStatus: 'connected',
        isSimulated: true,
        lastSyncedAt: new Date().toISOString(),
        totalEmails: 12,
        actionRequiredCount: 3
      });
      return newAccount.toObject ? newAccount.toObject() : newAccount;
    }

    const existing = this._memAccounts.find((a) => a.emailAddress.toLowerCase() === cleanEmail);
    if (existing) {
      existing.connectionStatus = 'connected';
      existing.lastSyncedAt = new Date().toISOString();
      return existing;
    }

    const newAccount = {
      id: `acc_${provider}_${Date.now()}`,
      provider,
      name: name || (provider === 'gmail' ? 'Google Workspace' : 'Microsoft 365'),
      emailAddress: cleanEmail,
      connectionStatus: 'connected',
      isSimulated: true,
      lastSyncedAt: new Date().toISOString(),
      totalEmails: 12,
      actionRequiredCount: 3
    };
    this._memAccounts.push(newAccount);
    return newAccount;
  }

  async updateAccountSync(id) {
    if (this.isDbReady()) {
      return await Account.findOneAndUpdate(
        { id },
        { $set: { lastSyncedAt: new Date().toISOString() } },
        { new: true }
      ).lean();
    }

    const account = this._memAccounts.find((a) => a.id === id);
    if (!account) return null;
    account.lastSyncedAt = new Date().toISOString();
    return account;
  }

  async disconnectAccount(id) {
    if (this.isDbReady()) {
      const result = await Account.deleteOne({ id });
      return result.deletedCount > 0;
    }

    const index = this._memAccounts.findIndex((a) => a.id === id);
    if (index === -1) return false;
    this._memAccounts.splice(index, 1);
    return true;
  }

  // ============================================================================
  // CONVERSATIONS
  // ============================================================================

  async getConversations({ segment = 'all', accountId, q, filter } = {}) {
    if (this.isDbReady()) {
      const query = {};
      const seg = (segment || 'all').toLowerCase();

      // Segment filter
      if (seg === 'all') {
        query.isArchived = { $ne: true };
      } else if (seg === 'action-required' || seg === 'action_required') {
        query.isArchived = { $ne: true };
        query.actionStatus = 'action_required';
      } else if (seg === 'assistant-reply' || seg === 'assistant_reply') {
        query.isArchived = { $ne: true };
        query.responsibility = 'assistant';
      } else if (seg === 'client-reply' || seg === 'client_reply') {
        query.isArchived = { $ne: true };
        query.responsibility = 'client';
      } else if (seg === 'client-queue' || seg === 'client_queue') {
        query.isArchived = { $ne: true };
        query.responsibility = 'client';
        query.actionStatus = { $nin: ['completed', 'resolved'] };
      } else if (seg === 'no-reply' || seg === 'no_reply') {
        query.isArchived = { $ne: true };
        query.responsibility = 'none';
      } else if (seg === 'review' || seg === 'needs-review' || seg === 'needs_review') {
        query.isArchived = { $ne: true };
        query.$or = [{ needsReview: true }, { responsibility: 'review' }];
      } else if (seg === 'waiting') {
        query.isArchived = { $ne: true };
        query.actionStatus = 'waiting';
      } else if (seg === 'meetings') {
        query.isArchived = { $ne: true };
        query.category = { $in: ['meetings', 'scheduling'] };
      } else if (seg === 'important') {
        query.isArchived = { $ne: true };
        query.isImportant = true;
      } else if (seg === 'archive' || seg === 'archived') {
        query.isArchived = true;
      }

      // Account filter
      if (accountId && accountId !== 'all') {
        query.accountId = accountId;
      }

      // Secondary quick filter
      if (filter === 'unread') {
        query.isUnread = true;
      } else if (filter === 'important') {
        query.isImportant = true;
      } else if (filter === 'has_draft') {
        query['draft.body'] = { $exists: true, $ne: '' };
      } else if (filter === 'needs_review') {
        const reviewCond = [{ needsReview: true }, { responsibility: 'review' }];
        if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: reviewCond }];
          delete query.$or;
        } else {
          query.$or = reviewCond;
        }
      }

      // Search query across subject, preview, sender, messages
      if (q && q.trim()) {
        const regex = new RegExp(q.trim(), 'i');
        const searchConditions = [
          { subject: regex },
          { preview: regex },
          { 'sender.name': regex },
          { 'sender.email': regex },
          { 'messages.body': regex }
        ];

        if (query.$and) {
          query.$and.push({ $or: searchConditions });
        } else if (query.$or) {
          query.$and = [{ $or: query.$or }, { $or: searchConditions }];
          delete query.$or;
        } else {
          query.$or = searchConditions;
        }
      }

      const list = await Conversation.find(query).sort({ lastMessageAt: -1 }).lean();
      return list;
    }

    // In-Memory Fallback
    let list = [...this._memConversations];
    const seg = (segment || 'all').toLowerCase();

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

    if (accountId && accountId !== 'all') {
      list = list.filter((c) => c.accountId === accountId);
    }

    if (filter === 'unread') {
      list = list.filter((c) => c.isUnread);
    } else if (filter === 'important') {
      list = list.filter((c) => c.isImportant);
    } else if (filter === 'has_draft') {
      list = list.filter((c) => !!c.draft && c.draft.body);
    } else if (filter === 'needs_review') {
      list = list.filter((c) => c.needsReview || c.responsibility === 'review');
    }

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

    list.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
    return list;
  }

  async getConversationById(id) {
    if (this.isDbReady()) {
      return await Conversation.findOne({ id }).lean();
    }
    return this._memConversations.find((c) => c.id === id) || null;
  }

  async updateConversation(id, updates = {}) {
    const allowed = ['isRead', 'isUnread', 'isImportant', 'isArchived', 'actionStatus', 'category', 'needsReview', 'aiSummary', 'summaryDetails', 'handledBy', 'handledAt'];
    const updateFields = {};

    for (const key of allowed) {
      if (updates[key] !== undefined) {
        if (key === 'isRead') {
          updateFields.isUnread = !updates.isRead;
        } else {
          updateFields[key] = updates[key];
        }
      }
    }

    if (this.isDbReady()) {
      return await Conversation.findOneAndUpdate(
        { id },
        { $set: updateFields },
        { new: true }
      ).lean();
    }

    const conv = this._memConversations.find((c) => c.id === id);
    if (!conv) return null;
    Object.assign(conv, updateFields);
    return conv;
  }

  /**
   * Human Override Protection:
   * Sets manual human decision, flags isManualOverride=true, clears review state,
   * and clears any pending AI suggestion.
   */
  async updateResponsibility(id, responsibility, reasoning) {
    const updateFields = {
      responsibility,
      isManualOverride: true,
      manualOverrideAt: new Date().toISOString(),
      manualDecision: responsibility,
      needsReview: false,
      confidenceScore: 1.0,
      pendingSuggestion: null,
      aiReasoning: reasoning || `Human override: Manually assigned to ${responsibility} by executive assistant.`
    };

    if (this.isDbReady()) {
      return await Conversation.findOneAndUpdate(
        { id },
        { $set: updateFields },
        { new: true }
      ).lean();
    }

    const conv = this._memConversations.find((c) => c.id === id);
    if (!conv) return null;
    Object.assign(conv, updateFields);
    return conv;
  }

  /**
   * Applies an AI classification result to a conversation, strictly respecting human overrides
   */
  async applyClassification(id, classification) {
    if (this.isDbReady()) {
      const conv = await Conversation.findOne({ id });
      if (!conv) return null;

      conv.aiSummary = classification.summary;
      conv.importantInformation = classification.importantInformation || [];
      conv.identifiedDates = classification.identifiedDates || [];
      conv.aiSource = classification.aiSource;
      conv.modelUsed = classification.modelUsed;

      if (conv.isManualOverride) {
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
        conv.responsibility = classification.responsibility;
        conv.confidenceScore = classification.confidenceScore;
        conv.needsReview = Boolean(classification.needsReview || classification.confidenceScore < 0.75);
        conv.aiReasoning = classification.explanation;
        conv.pendingSuggestion = null;
      }

      await conv.save();
      return conv.toObject ? conv.toObject() : conv;
    }

    const conv = this._memConversations.find((c) => c.id === id);
    if (!conv) return null;

    conv.aiSummary = classification.summary;
    conv.importantInformation = classification.importantInformation || [];
    conv.identifiedDates = classification.identifiedDates || [];
    conv.aiSource = classification.aiSource;
    conv.modelUsed = classification.modelUsed;

    if (conv.isManualOverride) {
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
  async acceptSuggestion(id) {
    if (this.isDbReady()) {
      const conv = await Conversation.findOne({ id });
      if (!conv || !conv.pendingSuggestion) return conv ? (conv.toObject ? conv.toObject() : conv) : null;

      conv.responsibility = conv.pendingSuggestion.responsibility;
      conv.confidenceScore = conv.pendingSuggestion.confidenceScore;
      conv.aiReasoning = conv.pendingSuggestion.explanation;
      conv.isManualOverride = false;
      conv.manualDecision = null;
      conv.pendingSuggestion = null;
      conv.needsReview = Boolean(conv.confidenceScore < 0.75);

      await conv.save();
      return conv.toObject ? conv.toObject() : conv;
    }

    const conv = this._memConversations.find((c) => c.id === id);
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
  async dismissSuggestion(id) {
    if (this.isDbReady()) {
      return await Conversation.findOneAndUpdate(
        { id },
        { $set: { pendingSuggestion: null } },
        { new: true }
      ).lean();
    }

    const conv = this._memConversations.find((c) => c.id === id);
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
    const conv = await this.getConversationById(id);
    if (!conv) return null;

    const senderName = conv.sender?.name || 'Counterparty';
    const senderEmail = conv.sender?.email || 'counterparty@external.com';

    let defaultBody = '';
    let isUrgent = false;

    if (conv.responsibility === 'assistant') {
      defaultBody = `Hi Ananya,\n\nFollowing up on our earlier note: we have now received authorization for the booking. Could Mr. Mehta personally confirm whether he requires formal execution sign-off on the Master Services Annex before departure?`;
      isUrgent = true;
    } else if (conv.responsibility === 'client') {
      defaultBody = `Arjun — Shardul Amarchand Mangaldas has clarified Section 4. If you prefer, Ananya can sign the operational appendix on your behalf if you authorize her via email. Let us know your decision.`;
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

    if (this.isDbReady()) {
      const dbConv = await Conversation.findOne({ id });
      if (!dbConv) return null;
      dbConv.messages.push(newMsg);
      dbConv.lastMessageAt = newMsg.timestamp;
      dbConv.isUnread = true;
      if (isUrgent) dbConv.actionStatus = 'action_required';
      await dbConv.save();

      // Re-evaluate with AI classification service
      try {
        const newClassification = await classificationService.classifyConversation(dbConv.toObject ? dbConv.toObject() : dbConv);
        await this.applyClassification(id, newClassification);
      } catch (e) {
        console.error('[Relay] AI re-classification failed during incoming message simulation:', e);
      }

      return await Conversation.findOne({ id }).lean();
    }

    conv.messages.push(newMsg);
    conv.lastMessageAt = newMsg.timestamp;
    conv.isUnread = true;
    if (isUrgent) conv.actionStatus = 'action_required';

    try {
      const newClassification = await classificationService.classifyConversation(conv);
      await this.applyClassification(id, newClassification);
    } catch (e) {
      console.error('[Relay] AI re-classification failed during incoming message simulation:', e);
    }

    return conv;
  }

  async saveDraft(id, draft) {
    const draftData = {
      body: draft.body || '',
      updatedAt: new Date().toISOString()
    };

    if (this.isDbReady()) {
      return await Conversation.findOneAndUpdate(
        { id },
        { $set: { draft: draftData } },
        { new: true }
      ).lean();
    }

    const conv = this._memConversations.find((c) => c.id === id);
    if (!conv) return null;
    conv.draft = draftData;
    return conv;
  }

  async sendDraft(id) {
    if (this.isDbReady()) {
      const conv = await Conversation.findOne({ id });
      if (!conv) return null;

      if (conv.draft && conv.draft.body) {
        const newMsg = {
          id: `msg_reply_${Date.now()}`,
          sender: {
            name: 'Ananya Sharma (on behalf of Arjun Mehta)',
            email: 'ananya.sharma@relay-assistant.in'
          },
          timestamp: new Date().toISOString(),
          body: conv.draft.body
        };
        conv.messages.push(newMsg);
        conv.lastMessageAt = newMsg.timestamp;
        conv.draft = null;
        conv.actionStatus = 'waiting';
        conv.isUnread = false;
        await conv.save();
      }
      return conv.toObject ? conv.toObject() : conv;
    }

    const conv = this._memConversations.find((c) => c.id === id);
    if (!conv) return null;

    if (conv.draft && conv.draft.body) {
      const newMsg = {
        id: `msg_reply_${Date.now()}`,
        sender: {
          name: 'Ananya Sharma (on behalf of Arjun Mehta)',
          email: 'ananya.sharma@relay-assistant.in'
        },
        timestamp: new Date().toISOString(),
        body: conv.draft.body
      };
      conv.messages.push(newMsg);
      conv.lastMessageAt = newMsg.timestamp;
      conv.draft = null;
      conv.actionStatus = 'waiting';
      conv.isUnread = false;
    }
    return conv;
  }

  async restoreConversation(id) {
    if (this.isDbReady()) {
      return await Conversation.findOneAndUpdate(
        { id },
        { $set: { isArchived: false } },
        { new: true }
      ).lean();
    }

    const conv = this._memConversations.find((c) => c.id === id);
    if (!conv) return null;
    conv.isArchived = false;
    return conv;
  }

  async markCompleted(id) {
    if (this.isDbReady()) {
      return await Conversation.findOneAndUpdate(
        { id },
        { $set: { actionStatus: 'completed' } },
        { new: true }
      ).lean();
    }

    const conv = this._memConversations.find((c) => c.id === id);
    if (!conv) return null;
    conv.actionStatus = 'completed';
    return conv;
  }

  /**
   * Client Action: Mark as Handled
   */
  async markHandled(id) {
    const updateFields = {
      actionStatus: 'completed',
      handledAt: new Date().toISOString(),
      handledBy: 'client',
      pendingSuggestion: null
    };

    if (this.isDbReady()) {
      return await Conversation.findOneAndUpdate(
        { id },
        { $set: updateFields },
        { new: true }
      ).lean();
    }

    const conv = this._memConversations.find((c) => c.id === id);
    if (!conv) return null;
    Object.assign(conv, updateFields);
    return conv;
  }

  /**
   * Client Action: Ask Assistant to Take Over
   */
  async delegateToAssistant(id, notes) {
    const updateFields = {
      responsibility: 'assistant',
      isManualOverride: true,
      delegatedBy: 'client',
      actionStatus: 'action_required',
      delegatedAt: new Date().toISOString(),
      confidenceScore: 1.0,
      pendingSuggestion: null,
      needsReview: false,
      aiReasoning: notes || 'Delegated to executive assistant Ananya Sharma by client Arjun Mehta.'
    };

    if (this.isDbReady()) {
      return await Conversation.findOneAndUpdate(
        { id },
        { $set: updateFields },
        { new: true }
      ).lean();
    }

    const conv = this._memConversations.find((c) => c.id === id);
    if (!conv) return null;
    Object.assign(conv, updateFields);
    return conv;
  }

  async markAllRead(accountId) {
    if (this.isDbReady()) {
      const query = { isUnread: true };
      if (accountId && accountId !== 'all') {
        query.accountId = accountId;
      }
      await Conversation.updateMany(query, { $set: { isUnread: false } });
      return await this.getCounts(accountId);
    }

    this._memConversations.forEach((c) => {
      if (!accountId || accountId === 'all' || c.accountId === accountId) {
        c.isUnread = false;
      }
    });
    return await this.getCounts(accountId);
  }

  async getCounts(accountId) {
    if (this.isDbReady()) {
      const baseQuery = {};
      if (accountId && accountId !== 'all') {
        baseQuery.accountId = accountId;
      }
      const allList = await Conversation.find(baseQuery).lean();
      const unarchived = allList.filter((c) => !c.isArchived);

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
        archive: allList.filter((c) => c.isArchived).length
      };
    }

    let list = this._memConversations;
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
