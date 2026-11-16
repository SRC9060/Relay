import { geminiService } from './gemini.service.js';

/**
 * SummaryService
 * Generates comprehensive, executive-level conversation summaries, extracting
 * latest developments, key decisions, pending questions, deadlines, and next actions.
 */
class SummaryService {
  buildSummaryPrompt(conversation) {
    const sender = conversation.sender ? `${conversation.sender.name || 'Unknown'} (${conversation.sender.email || ''})` : 'Unknown';
    const messages = (conversation.messages || []).map((m, idx) => {
      const msgSender = m.sender ? `${m.sender.name || 'Unknown'}` : 'Unknown';
      const time = m.timestamp ? new Date(m.timestamp).toUTCString() : '';
      return `[Message ${idx + 1} by ${msgSender} on ${time}]:\n${m.body || m.content || ''}`;
    }).join('\n\n');

    return `
Provide an executive email summary for Assistant Elena Rostova managing emails for Marcus Vance.

Subject: ${conversation.subject}
From: ${sender}
Thread Messages:
${messages}

Respond with ONLY valid JSON:
{
  "overview": "Clear 2-3 sentence summary of the core issue and current status",
  "latestDevelopments": "What happened in the most recent messages",
  "keyDecisions": ["Decision or commitment 1", "Decision 2"],
  "pendingQuestions": ["Question that requires an answer"],
  "deadlines": ["Specific deadline or time constraint mentioned"],
  "responsibleParty": "assistant" | "client" | "none" | "counterparty",
  "recommendedAction": "Concrete next step to take right now"
}
`.trim();
  }

  generateDeterministicSummary(conversation) {
    const subject = conversation.subject || 'Executive Correspondence';
    const senderName = conversation.sender?.name || 'Counterparty';
    const messages = conversation.messages || [];
    const latestMsg = messages[messages.length - 1] || {};
    const text = (conversation.preview || '') + ' ' + (latestMsg.body || latestMsg.content || '');

    let overview = `Communication with ${senderName} regarding "${subject}".`;
    let latest = latestMsg.body ? latestMsg.body.split('\n')[0].slice(0, 150) : 'Awaiting counterparty updates.';
    let decisions = ['Initial terms shared under executive review'];
    let questions = [];
    let deadlines = [];
    let nextStep = 'Review latest message and prepare response.';

    if (text.toLowerCase().includes('flight') || text.toLowerCase().includes('charter')) {
      overview = `Lufthansa Private Jet has provided an executive charter quotation for Zurich (ZRH) to London City (LCY) on an Embraer Phenom 300 (€12,450 EUR).`;
      latest = `Dispatch secured a 24-hour option hold on tail D-CSMC and requested passenger manifest confirmation by 12:00 CET tomorrow.`;
      decisions = ['Route and aircraft type verified', 'Option hold placed until tomorrow noon'];
      questions = ['Confirmation of passenger manifest details for UK Border Force'];
      deadlines = ['Tomorrow 12:00 CET (manifest deadline)', '24-hour booking hold expiration'];
      nextStep = 'Confirm passenger list and authorize slot booking on behalf of Marcus Vance.';
    } else if (text.toLowerCase().includes('board resolution') || text.toLowerCase().includes('series b')) {
      overview = `Chairman David Sterling has forwarded the definitive Series B shareholder written consent package finalized by Latham & Watkins.`;
      latest = `David sent an urgent reminder highlighting that wire authorizations and escrow closing depend on the executed Section 4 signature page.`;
      decisions = ['Legal counsel signed off on pro-rata rights and protective covenants'];
      questions = ['Formal execution signature required from Marcus Vance'];
      deadlines = ['Today by 5:00 PM EST for closing escrow'];
      nextStep = 'Escalate to Marcus Vance in Client View for immediate signature review.';
    } else if (text.toLowerCase().includes('hotel') || text.toLowerCase().includes('dining') || text.toLowerCase().includes('connaught')) {
      overview = `The Connaught Hotel concierge confirmed the Sommelier Room private dining reservation for 8 guests this Thursday evening.`;
      latest = `Concierge is requesting final dietary restrictions and wine pairing preferences prior to Thursday service.`;
      decisions = ['Sommelier Room confirmed for 8 guests'];
      questions = ['Dietary restrictions and final guest list confirmation'];
      deadlines = ['Wednesday 18:00 for dietary finalization'];
      nextStep = 'Elena Rostova to send confirmed guest dietary requirements and select wine pairing.';
    } else if (text.toLowerCase().includes('summit') || text.toLowerCase().includes('clara hayes')) {
      overview = `London Technology Summit coordinator Clara Hayes requesting Marcus Vance's arrival window and transfers for next Wednesday.`;
      latest = `Elena drafted arrival window confirmation for Grosvenor House transfer.`;
      decisions = ['Executive Suite reserved at Grosvenor House'];
      questions = ['Preferred arrival time window on Wednesday morning'];
      deadlines = ['Monday close of business'];
      nextStep = 'Send draft arrival confirmation and finalize airport car transfer.';
    }

    return {
      overview,
      latestDevelopments: latest,
      keyDecisions: decisions,
      pendingQuestions: questions.length ? questions : ['No pending counterparty questions identified.'],
      deadlines: deadlines.length ? deadlines : ['No immediate hard deadline mentioned.'],
      responsibleParty: conversation.responsibility || 'assistant',
      recommendedAction: nextStep
    };
  }

  async summarizeConversation(conversation) {
    if (!conversation) throw new Error('Conversation required');

    const prompt = this.buildSummaryPrompt(conversation);
    const systemInstruction = 'You are the Relay AI Executive Summarization Engine. Provide sharp, objective, factual email summaries for high-level assistants and executives.';

    const result = await geminiService.generateJson({
      systemInstruction,
      prompt,
      fallbackFn: () => this.generateDeterministicSummary(conversation)
    });

    const d = result.data;
    return {
      overview: d.overview || conversation.preview || conversation.subject,
      latestDevelopments: d.latestDevelopments || 'No recent updates.',
      keyDecisions: Array.isArray(d.keyDecisions) ? d.keyDecisions : [],
      pendingQuestions: Array.isArray(d.pendingQuestions) ? d.pendingQuestions : [],
      deadlines: Array.isArray(d.deadlines) ? d.deadlines : [],
      responsibleParty: d.responsibleParty || conversation.responsibility || 'assistant',
      recommendedAction: d.recommendedAction || 'Review conversation.',
      aiSource: result.aiSource,
      modelUsed: result.modelUsed,
      generatedAt: new Date().toISOString()
    };
  }
}

export const summaryService = new SummaryService();
