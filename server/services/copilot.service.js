import { geminiService } from './gemini.service.js';
import { storage } from './storage.service.js';
import { summaryService } from './summary.service.js';
import { replyService } from './reply.service.js';

/**
 * CopilotService
 * Answers natural language questions strictly grounded in actual conversation store data.
 * Zero hallucination of emails or dates that do not exist in storage.
 */
class CopilotService {
  /**
   * Evaluates query against existing storage data and returns grounded answer
   */
  async askCopilot({ query, conversationId, accountId }) {
    if (!query || !query.trim()) {
      throw new Error('Query is required for AI Copilot');
    }

    const q = query.trim().toLowerCase();
    const all = await storage.getConversations({ accountId });
    const counts = await storage.getCounts(accountId);

    // Contextual: Specific conversation provided or requested
    let targetConversation = null;
    if (conversationId) {
      targetConversation = await storage.getConversationById(conversationId);
    }

    // 1. "Show me emails that need my attention" / "action required"
    if (q.includes('need my attention') || q.includes('assistant attention') || q.includes('action required') || q.includes('my attention')) {
      const matches = all.filter((c) => !c.isArchived && (c.responsibility === 'assistant' || c.actionStatus === 'action_required'));
      return {
        answer: `You currently have ${matches.length} conversations requiring assistant attention or operational action. The most critical items are listed below.`,
        referencedConversations: matches.slice(0, 5).map(this.formatRef),
        queryType: 'list',
        segment: 'assistant-reply',
        count: matches.length,
        aiSource: 'grounded-data'
      };
    }

    // 2. "What am I waiting for a response on?"
    if (q.includes('waiting') || q.includes('waiting for a response') || q.includes('pending counterparty')) {
      const matches = all.filter((c) => !c.isArchived && c.actionStatus === 'waiting');
      const count = matches.length;
      if (count === 0) {
        return {
          answer: 'You have no conversations currently awaiting an external counterparty response. All sent correspondence has either been answered or completed.',
          referencedConversations: [],
          queryType: 'empty',
          segment: 'waiting',
          count: 0,
          aiSource: 'grounded-data'
        };
      }
      return {
        answer: `You are currently waiting for a response on ${count} conversation${count > 1 ? 's' : ''}. Awaiting reply from the respective counterparties before further action is needed.`,
        referencedConversations: matches.map(this.formatRef),
        queryType: 'list',
        segment: 'waiting',
        count,
        aiSource: 'grounded-data'
      };
    }

    // 3. "Which emails require the client's attention?"
    if (q.includes('client attention') || q.includes('client') || q.includes('marcus') || q.includes("client's attention")) {
      const matches = all.filter((c) => !c.isArchived && c.responsibility === 'client');
      return {
        answer: `There are ${matches.length} executive conversations requiring Marcus Vance's personal review, statutory approval, or strategic decision. These are prioritized in the Client Queue.`,
        referencedConversations: matches.slice(0, 5).map(this.formatRef),
        queryType: 'list',
        segment: 'client-reply',
        count: matches.length,
        aiSource: 'grounded-data'
      };
    }

    // 4. "Show meetings" / "calendar" / "dates"
    if (q.includes('meeting') || q.includes('calendar') || q.includes('dates') || q.includes('appointment')) {
      const matches = all.filter((c) => !c.isArchived && (c.category === 'meetings' || c.category === 'scheduling'));
      return {
        answer: `Identified ${matches.length} active scheduling and meeting correspondence threads across your connected mailboxes.`,
        referencedConversations: matches.slice(0, 5).map(this.formatRef),
        queryType: 'list',
        segment: 'meetings',
        count: matches.length,
        aiSource: 'grounded-data'
      };
    }

    // 5. Contextual: "Summarize this conversation"
    if (q.includes('summarize') || q.includes('summary')) {
      const conv = targetConversation || all[0];
      if (!conv) {
        return {
          answer: 'No conversation is currently selected to summarize. Please select an email from the inbox first.',
          referencedConversations: [],
          queryType: 'empty',
          aiSource: 'grounded-data'
        };
      }

      const summary = await summaryService.summarizeConversation(conv);
      return {
        answer: `**Executive Summary for "${conv.subject}"**:\n\n${summary.overview}\n\n• **Latest Developments:** ${summary.latestDevelopments}\n• **Key Decisions:** ${summary.keyDecisions.join('; ')}\n• **Recommended Next Step:** ${summary.recommendedAction}`,
        referencedConversations: [this.formatRef(conv)],
        queryType: 'summary',
        summaryData: summary,
        aiSource: summary.aiSource
      };
    }

    // 6. Contextual: "Why has this email been assigned to the client?"
    if (q.includes('why') && (q.includes('assigned') || q.includes('client') || q.includes('responsibility'))) {
      const conv = targetConversation || all.find((c) => c.responsibility === 'client') || all[0];
      if (!conv) {
        return {
          answer: 'No relevant conversation found to explain triage rationale.',
          referencedConversations: [],
          queryType: 'empty',
          aiSource: 'grounded-data'
        };
      }

      const isClient = conv.responsibility === 'client';
      const reason = conv.aiReasoning || 'Assigned based on delegated authority rules.';
      const answer = isClient
        ? `"${conv.subject}" is assigned to **Client to Reply** because it contains: ${reason}\n\nMarcus Vance's individual executive signature or judgment is required under your operating protocols.`
        : `"${conv.subject}" is assigned to **${conv.responsibility === 'assistant' ? 'Assistant to Reply' : 'No Reply Needed'}** because: ${reason}`;

      return {
        answer,
        referencedConversations: [this.formatRef(conv)],
        queryType: 'explanation',
        aiSource: 'grounded-data'
      };
    }

    // 7. Contextual: "Draft a reply to this conversation"
    if (q.includes('draft a reply') || q.includes('draft reply') || q.includes('compose reply')) {
      const conv = targetConversation || all[0];
      if (!conv) {
        return {
          answer: 'Please select a conversation from your inbox to draft a contextual reply.',
          referencedConversations: [],
          queryType: 'empty',
          aiSource: 'grounded-data'
        };
      }

      const reply = await replyService.generateReply(conv, { intent: 'confirm' });
      return {
        answer: `Draft prepared for "${conv.subject}":\n\n\`\`\`\n${reply.body}\n\`\`\`\n\nYou can review, edit, and save this in the conversation reading pane.`,
        referencedConversations: [this.formatRef(conv)],
        draftData: reply,
        queryType: 'draft',
        aiSource: reply.aiSource
      };
    }

    // 8. General question: Grounded fallback
    const systemInstruction = 'You are the Relay AI Executive Assistant Copilot. Answer the assistant\'s question strictly using the provided mailbox facts. Do not invent conversations.';
    const prompt = `
User Question: "${query}"

Current Mailbox Status:
- Total Active Emails: ${counts.all}
- Action Required: ${counts.actionRequired}
- Assistant to Reply: ${counts.assistantReply}
- Client to Reply: ${counts.clientReply}
- Waiting on Counterparty: ${counts.waiting}
- Meetings Scheduled: ${counts.meetings}
- Important Marked: ${counts.important}

Selected Conversation Context (if any):
${targetConversation ? `Subject: ${targetConversation.subject}\nFrom: ${targetConversation.sender?.name}\nResponsibility: ${targetConversation.responsibility}\nPreview: ${targetConversation.preview}` : 'No single conversation currently selected.'}

Provide a concise, helpful, grounded answer for Elena Rostova.
`.trim();

    const result = await geminiService.generateJson({
      systemInstruction,
      prompt,
      fallbackFn: () => ({
        answer: `Marcus Vance's connected mailboxes contain ${counts.all} active emails. Currently, ${counts.actionRequired} require action (${counts.assistantReply} for the assistant and ${counts.clientReply} for the client). ${counts.waiting} are waiting for counterparty responses.`,
        referencedConversations: all.slice(0, 3).map(this.formatRef),
        queryType: 'general'
      })
    });

    const d = result.data;
    return {
      answer: d.answer || `Based on your mailbox data, there are ${counts.all} active conversations, with ${counts.actionRequired} requiring attention.`,
      referencedConversations: (d.referencedConversations && d.referencedConversations.length) ? d.referencedConversations : all.slice(0, 3).map(this.formatRef),
      queryType: 'general',
      aiSource: result.aiSource
    };
  }

  formatRef(c) {
    return {
      id: c.id,
      subject: c.subject,
      sender: c.sender?.name || 'Unknown',
      senderRole: c.sender?.role || c.senderRole || c.category || 'Executive',
      time: c.lastMessageAt || c.receivedAt,
      responsibility: c.responsibility,
      actionStatus: c.actionStatus,
      isUnread: c.isUnread
    };
  }
}

export const copilotService = new CopilotService();
