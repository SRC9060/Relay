import { storage } from '../services/storage.service.js';
import { classificationService } from '../services/classification.service.js';
import { summaryService } from '../services/summary.service.js';
import { replyService } from '../services/reply.service.js';
import { copilotService } from '../services/copilot.service.js';
import { geminiService } from '../services/gemini.service.js';

export const getConversations = async (req, res) => {
  try {
    const { segment, accountId, q, filter } = req.query;
    const conversations = storage.getConversations({ segment, accountId, q, filter });
    const counts = storage.getCounts(accountId);
    res.json({
      success: true,
      data: conversations,
      counts,
      meta: {
        total: conversations.length,
        segment: segment || 'all',
        accountId: accountId || 'all'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conversation = storage.getConversationById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.json({ success: true, data: conversation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.updateConversation(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const counts = storage.getCounts();
    res.json({ success: true, data: updated, counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateResponsibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { responsibility, reasoning } = req.body;
    if (!['assistant', 'client', 'none', 'review'].includes(responsibility)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid responsibility classification. Must be assistant, client, none, or review.'
      });
    }
    const updated = storage.updateResponsibility(id, responsibility, reasoning);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const counts = storage.getCounts();
    res.json({ success: true, data: updated, counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Trigger AI Classification on demand
 */
export const classifyConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const conv = storage.getConversationById(id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const classification = await classificationService.classifyConversation(conv);
    const updated = storage.applyClassification(id, classification);
    const counts = storage.getCounts();

    res.json({
      success: true,
      data: updated,
      classification,
      counts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate AI Summary for thread
 */
export const getSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const conv = storage.getConversationById(id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const summary = await summaryService.summarizeConversation(conv);
    // Attach to conversation in storage
    conv.aiSummary = summary.overview;
    conv.summaryDetails = summary;

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Generate AI Reply Draft
 */
export const generateReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { intent, instructions } = req.body;
    const conv = storage.getConversationById(id);
    if (!conv) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const reply = await replyService.generateReply(conv, { intent, instructions });
    res.json({
      success: true,
      data: reply
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Simulate Incoming Message
 */
export const simulateIncomingMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await storage.simulateIncomingMessage(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const counts = storage.getCounts();
    res.json({
      success: true,
      data: updated,
      counts,
      simulated: true,
      message: 'Incoming message simulated. AI re-evaluation triggered.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Human Override: Accept AI Suggestion
 */
export const acceptSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.acceptSuggestion(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const counts = storage.getCounts();
    res.json({ success: true, data: updated, counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Human Override: Dismiss AI Suggestion
 */
export const dismissSuggestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.dismissSuggestion(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const counts = storage.getCounts();
    res.json({ success: true, data: updated, counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * AI Assistant / Copilot Query
 */
export const askCopilot = async (req, res) => {
  try {
    const { query, conversationId, accountId } = req.body;
    const response = await copilotService.askCopilot({ query, conversationId, accountId });
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * AI Status & Configuration Check
 */
export const getAiStatus = async (req, res) => {
  const isConfigured = geminiService.isConfigured();
  let liveVerification = { success: false };
  if (isConfigured) {
    liveVerification = await geminiService.verifyLiveConnection();
  }

  res.json({
    success: true,
    data: {
      provider: 'Google Gemini REST API (v1beta)',
      model: geminiService.getModel(),
      configuredModel: geminiService.getModel(),
      isConfigured,
      aiSource: isConfigured && liveVerification.success ? 'gemini' : 'deterministic-fallback',
      liveRequestSucceeded: Boolean(liveVerification.success),
      lastVerifiedAt: liveVerification.timestamp || null,
      envVarName: 'GEMINI_API_KEY'
    }
  });
};

export const saveDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;
    const updated = storage.saveDraft(id, { body });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendDraft = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.sendDraft(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const counts = storage.getCounts();
    res.json({
      success: true,
      data: updated,
      counts,
      simulated: true,
      message: 'Simulated reply sent successfully.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const restoreConversation = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.restoreConversation(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const counts = storage.getCounts();
    res.json({ success: true, data: updated, counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.markCompleted(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const counts = storage.getCounts();
    res.json({ success: true, data: updated, counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Client Action: Mark Handled
 */
export const markHandled = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = storage.markHandled(id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const counts = storage.getCounts();
    res.json({
      success: true,
      data: updated,
      counts,
      message: 'Conversation marked as handled by client.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Client Action: Delegate to Assistant
 */
export const delegateToAssistant = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const updated = storage.delegateToAssistant(id, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }
    const counts = storage.getCounts();
    res.json({
      success: true,
      data: updated,
      counts,
      message: 'Delegated to executive assistant Elena Rostova.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCounts = async (req, res) => {
  try {
    const { accountId } = req.query;
    const counts = storage.getCounts(accountId);
    res.json({ success: true, data: counts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
