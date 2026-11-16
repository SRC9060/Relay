import { geminiService } from './gemini.service.js';

/**
 * ReplyService
 * Generates contextual executive email replies based on thread history,
 * current triage classification, and user-selected reply intent.
 */
class ReplyService {
  buildReplyPrompt(conversation, { intent = 'confirm', instructions = '', assistantName = 'Ananya Sharma', clientName = 'Arjun Mehta' }) {
    const sender = conversation.sender ? `${conversation.sender.name || 'Unknown'} (${conversation.sender.email || ''})` : 'Unknown';
    const messages = (conversation.messages || []).map((m, idx) => {
      const msgSender = m.sender ? `${m.sender.name || 'Unknown'}` : 'Unknown';
      return `Message ${idx + 1} from ${msgSender}:\n${m.body || m.content || ''}`;
    }).join('\n\n');

    return `
You are drafting an executive email reply on behalf of client ${clientName}, written by executive assistant ${assistantName}.

THREAD CONTEXT:
Subject: ${conversation.subject}
From: ${sender}
Current Triage Classification: ${conversation.responsibility}

THREAD MESSAGES:
${messages}

REPLY INTENT:
${intent.toUpperCase()}
Additional instructions from assistant: ${instructions || 'None provided. Keep tone polished, concise, understated, and decisive.'}

GUIDELINES:
- Formal, refined executive tone (Warm Swiss Minimalist character: courteous, direct, zero fluff).
- Sign off cleanly as "${assistantName}\nExecutive Office of ${clientName}".
- Never invent flight numbers, account balances, or dates not grounded in the thread or instructions.

Respond with ONLY valid JSON:
{
  "subject": "Re: ${conversation.subject}",
  "body": "The drafted email response text",
  "intentApplied": "${intent}",
  "tone": "Executive Professional",
  "keyPointsAddressed": ["Point 1 addressed", "Point 2 addressed"]
}
`.trim();
  }

  generateDeterministicReply(conversation, { intent = 'confirm', instructions = '', assistantName = 'Ananya Sharma', clientName = 'Arjun Mehta' }) {
    const subject = conversation.subject || 'Correspondence';
    const recipientName = conversation.sender?.name ? conversation.sender.name.split(' ')[0] : 'Sir/Madam';
    const text = (conversation.preview || '') + ' ' + ((conversation.messages?.[0]?.body) || '');

    let body = '';
    let keyPoints = [];

    switch (intent.toLowerCase()) {
      case 'confirm':
      case 'confirmation':
        if (text.toLowerCase().includes('flight') || text.toLowerCase().includes('charter')) {
          body = `Dear ${recipientName},\n\nThank you for the prompt dispatch quotation for the Mumbai to New Delhi flight on the Dassault Falcon 2000 (₹12,45,000 INR).\n\nWe would like to formally confirm the reservation and release the passenger manifest. Mr. Mehta will be traveling with one colleague; I will transmit their government ID details shortly before the 12:00 IST deadline tomorrow.\n\nPlease proceed with slot confirmation and send over the final invoice for payment authorization.\n\nWarm regards,\n${assistantName}\nExecutive Assistant to ${clientName}`;
          keyPoints = ['Confirmed Falcon 2000 charter quote', 'Accepted 12:00 IST manifest deadline', 'Requested final invoice'];
        } else if (text.toLowerCase().includes('dining') || text.toLowerCase().includes('taj') || text.toLowerCase().includes('connaught')) {
          body = `Dear ${recipientName},\n\nThank you for confirming the Sea Lounge Private Suite for Thursday evening. We are delighted with the arrangements.\n\nMr. Mehta will be hosting seven guests (eight total). We have two vegetarian guests and no severe allergies. We will gladly defer to the Head Sommelier for the recommended cellar pairings.\n\nThank you for your attentive assistance,\n${assistantName}\nExecutive Office of ${clientName}`;
          keyPoints = ['Confirmed 8 guests for Thursday', 'Specified dietary restrictions', 'Approved cellar pairing'];
        } else {
          body = `Dear ${recipientName},\n\nThank you for your message regarding ${subject}.\n\nI have reviewed the details with Mr. Mehta and we are pleased to confirm that the proposed arrangements are approved. Please proceed on this basis.\n\nShould you require any additional details, please let me know.\n\nSincerely,\n${assistantName}\nExecutive Office of ${clientName}`;
          keyPoints = ['Confirmed proposed details', 'Authorized counterparty to proceed'];
        }
        break;

      case 'request_info':
      case 'clarification':
        body = `Dear ${recipientName},\n\nThank you for sharing the latest update regarding "${subject}".\n\nBefore Mr. Mehta provides his final sign-off, could you kindly clarify the specific timelines and any immediate deliverables required from our side?\n\nOnce we have those parameters, we will turn around our feedback promptly.\n\nBest regards,\n${assistantName}\nExecutive Office of ${clientName}`;
        keyPoints = ['Acknowledged receipt', 'Requested timeline clarification', 'Committed to prompt turnaround'];
        break;

      case 'approve':
      case 'approval':
        body = `Dear ${recipientName},\n\nMr. Mehta has reviewed the document package for "${subject}" and provided his formal approval.\n\nAttached is the executed counterpart signature page for your records. Kindly confirm receipt and keep us apprised of the closing timeline.\n\nBest regards,\n${assistantName}\nOn behalf of ${clientName}`;
        keyPoints = ['Conveyed Arjun Mehta executive approval', 'Provided signature confirmation', 'Requested closing confirmation'];
        break;

      case 'reschedule':
        body = `Dear ${recipientName},\n\nThank you for following up. Due to an unavoidable shift in Mr. Mehta’s executive calendar, we need to adjust our scheduled discussion regarding "${subject}".\n\nCould we propose either of the following alternative windows:\n• Tuesday, Nov 17 at 14:00 IST\n• Wednesday, Nov 18 at 10:30 IST\n\nPlease let me know if either works for your team.\n\nKind regards,\n${assistantName}\nExecutive Assistant to ${clientName}`;
        keyPoints = ['Politely requested reschedule', 'Offered two alternative meeting slots', 'Requested confirmation'];
        break;

      default:
        body = `Dear ${recipientName},\n\nThank you for your correspondence regarding "${subject}".\n\n${instructions ? instructions : 'We have received your note and are reviewing the materials with Mr. Mehta. We will revert with our formal response shortly.'}\n\nWarm regards,\n${assistantName}\nExecutive Office of ${clientName}`;
        keyPoints = ['Custom response drafted', 'Polite executive sign-off'];
    }

    return {
      subject: `Re: ${subject}`,
      body,
      intentApplied: intent,
      tone: 'Executive Professional',
      keyPointsAddressed: keyPoints
    };
  }

  async generateReply(conversation, options = {}) {
    if (!conversation) throw new Error('Conversation required');

    const prompt = this.buildReplyPrompt(conversation, options);
    const systemInstruction = 'You are the Relay AI Executive Reply Engine. Generate concise, highly professional email replies with Swiss minimalist clarity and executive tact.';

    const result = await geminiService.generateJson({
      systemInstruction,
      prompt,
      fallbackFn: () => this.generateDeterministicReply(conversation, options)
    });

    const d = result.data;
    return {
      subject: d.subject || `Re: ${conversation.subject}`,
      body: d.body || '',
      intentApplied: options.intent || 'confirm',
      tone: d.tone || 'Executive Professional',
      keyPointsAddressed: Array.isArray(d.keyPointsAddressed) ? d.keyPointsAddressed : [],
      aiSource: result.aiSource,
      modelUsed: result.modelUsed,
      generatedAt: new Date().toISOString()
    };
  }
}

export const replyService = new ReplyService();
