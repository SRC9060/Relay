import { Router } from 'express';
import {
  getConversations,
  getConversation,
  updateConversation,
  updateResponsibility,
  classifyConversation,
  getSummary,
  generateReply,
  simulateIncomingMessage,
  acceptSuggestion,
  dismissSuggestion,
  askCopilot,
  getAiStatus,
  saveDraft,
  sendDraft,
  restoreConversation,
  markCompleted,
  markHandled,
  delegateToAssistant,
  getCounts
} from '../controllers/conversations.controller.js';

const router = Router();

// Specific routes first
router.get('/counts', getCounts);
router.get('/ai-status', getAiStatus);
router.post('/copilot', askCopilot);

// Core list & thread routes
router.get('/', getConversations);
router.get('/:id', getConversation);
router.patch('/:id', updateConversation);
router.patch('/:id/responsibility', updateResponsibility);

// AI Intelligence routes
router.post('/:id/classify', classifyConversation);
router.post('/:id/summary', getSummary);
router.post('/:id/generate-reply', generateReply);
router.post('/:id/incoming-message', simulateIncomingMessage);
router.post('/:id/accept-suggestion', acceptSuggestion);
router.post('/:id/dismiss-suggestion', dismissSuggestion);

// Drafts & Actions
router.post('/:id/drafts', saveDraft);
router.post('/:id/send', sendDraft);
router.post('/:id/restore', restoreConversation);
router.post('/:id/complete', markCompleted);
router.post('/:id/handled', markHandled);
router.post('/:id/delegate', delegateToAssistant);

export default router;
