import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';
import { geminiService } from '../services/gemini.service.js';

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  geminiService.clearMockResponse();
  await new Promise((resolve) => server.close(resolve));
});

test('GET /api/health returns 200 and milestone 3 info', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.milestone, 3);
});

test('GET /api/auth/demo-users returns seeded assistant and client', async () => {
  const res = await fetch(`${baseUrl}/api/auth/demo-users`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 2);
  const roles = json.data.map((u) => u.role);
  assert.ok(roles.includes('assistant'));
  assert.ok(roles.includes('client'));
});

test('POST /api/auth/login logs in assistant demo user', async () => {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role: 'assistant' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.user.role, 'assistant');
  assert.ok(json.data.token);
});

test('POST /api/auth/signup creates a new user', async () => {
  const res = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Sarah Connor',
      email: `sarah_${Date.now()}@relay.test`,
      role: 'assistant'
    })
  });
  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.user.name, 'Sarah Connor');
});

test('GET /api/accounts returns connected accounts', async () => {
  const res = await fetch(`${baseUrl}/api/accounts`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 2);
});

test('POST /api/accounts/connect connects simulated mailbox', async () => {
  const res = await fetch(`${baseUrl}/api/accounts/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'gmail',
      emailAddress: 'test.exec@gmail.com',
      name: 'Test Executive Gmail'
    })
  });
  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.provider, 'gmail');
  assert.equal(json.data.isSimulated, true);
});

test('GET /api/conversations returns at least 16 realistic seeded conversations', async () => {
  const res = await fetch(`${baseUrl}/api/conversations`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 16);
  assert.ok(json.counts.all >= 16);
});

test('GET /api/conversations filters by segment (client-reply)', async () => {
  const res = await fetch(`${baseUrl}/api/conversations?segment=client-reply`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);
  json.data.forEach((c) => {
    assert.equal(c.responsibility, 'client');
    assert.equal(c.isArchived, false);
  });
});

test('GET /api/conversations performs search query across sender & subject', async () => {
  const res = await fetch(`${baseUrl}/api/conversations?q=Sterling`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length >= 1);
  assert.ok(json.data.some((c) => c.sender.name.includes('Sterling')));
});

test('GET /api/conversations/:id returns single conversation with full message history', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_01`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.id, 'conv_01');
  assert.ok(json.data.messages.length >= 2);
  assert.ok(json.data.aiReasoning);
});

test('PATCH /api/conversations/:id updates read, important, and completed status', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_01`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isRead: true, isImportant: false, actionStatus: 'completed' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.isUnread, false);
  assert.equal(json.data.isImportant, false);
  assert.equal(json.data.actionStatus, 'completed');
});

test('PATCH /api/conversations/:id/responsibility updates triage classification as human override', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_01/responsibility`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responsibility: 'assistant', reasoning: 'Reassigned to assistant for scheduling prep.' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.responsibility, 'assistant');
  assert.equal(json.data.isManualOverride, true);
  assert.equal(json.data.confidenceScore, 1.0);
});

test('POST /api/conversations/:id/drafts saves and updates reply draft', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_01/drafts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body: 'Draft reply for board approval.' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.draft.body, 'Draft reply for board approval.');
});

test('POST /api/conversations/:id/send simulates sending draft message', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_01/send`, {
    method: 'POST'
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.simulated, true);
  assert.equal(json.data.draft, null);
  assert.equal(json.data.actionStatus, 'waiting');
});

test('GET /api/conversations/counts returns live synchronized segment counts', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/counts`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(typeof json.data.all === 'number');
  assert.ok(typeof json.data.actionRequired === 'number');
  assert.ok(typeof json.data.assistantReply === 'number');
  assert.ok(typeof json.data.clientReply === 'number');
  assert.ok(typeof json.data.archive === 'number');
});

// ==========================================
// MILESTONE 3: AI INTELLIGENCE TEST SUITE
// ==========================================

test('GET /api/conversations/ai-status reports Gemini configuration and fallback engine state', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/ai-status`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok('isConfigured' in json.data);
  assert.ok(json.data.model);
  assert.ok(['gemini', 'deterministic-fallback'].includes(json.data.aiSource));
});

test('POST /api/conversations/:id/classify classifies administrative email as assistant responsibility', async () => {
  // conv_04 is The Connaught Hotel (private dining concierge)
  const res = await fetch(`${baseUrl}/api/conversations/conv_04/classify`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.classification.responsibility, 'assistant');
  assert.ok(json.classification.confidenceScore >= 0.75);
  assert.equal(json.classification.needsReview, false);
  assert.ok(json.classification.explanation.length > 10);
  assert.ok(Array.isArray(json.classification.importantInformation));
});

test('POST /api/conversations/:id/classify classifies governance resolution as client responsibility', async () => {
  // conv_03 is Dr. Aris Thorne (IP licensing & co-investment)
  const res = await fetch(`${baseUrl}/api/conversations/conv_03/classify`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.classification.responsibility, 'client');
  assert.ok(json.classification.confidenceScore >= 0.8);
  assert.ok(json.classification.explanation.length > 10);
});

test('POST /api/conversations/:id/classify classifies newsletter as none responsibility', async () => {
  // conv_07 is Financial Times / Bloomberg digest
  const res = await fetch(`${baseUrl}/api/conversations/conv_07/classify`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.classification.responsibility, 'none');
  assert.equal(json.classification.requiresAction, false);
});

test('POST /api/conversations/:id/classify flags low-confidence email as needsReview', async () => {
  // conv_12 is an ambiguous allocation thread
  const res = await fetch(`${baseUrl}/api/conversations/conv_12/classify`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.classification.confidenceScore < 0.75);
  assert.equal(json.classification.needsReview, true);
  assert.ok(json.classification.explanation.includes('confidence') || json.classification.explanation.includes('review') || json.classification.explanation.includes('ambiguous'));
});

test('Gemini Mock Mode: validates structured LLM response processing', async () => {
  geminiService.setMockResponse({
    responsibility: 'assistant',
    confidenceScore: 0.96,
    needsReview: false,
    explanation: 'Mocked Gemini API response confirming flight reservation logistics.',
    summary: 'Mocked executive summary of flight logistics.',
    requiresAction: true,
    clientAttentionReason: null,
    suggestedCategory: 'scheduling',
    importantInformation: ['Flight booking tail D-CSMC verified'],
    identifiedDates: [{ date: '2026-11-18', description: 'Flight to London', isMeeting: true }],
    suggestedFollowUp: 'Send passenger manifest.'
  });

  const res = await fetch(`${baseUrl}/api/conversations/conv_04/classify`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.classification.aiSource, 'gemini-mock');
  assert.equal(json.classification.confidenceScore, 0.96);
  assert.equal(json.classification.explanation, 'Mocked Gemini API response confirming flight reservation logistics.');

  geminiService.clearMockResponse();
});

test('POST /api/conversations/:id/summary generates comprehensive conversation summary', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_04/summary`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.overview);
  assert.ok(json.data.latestDevelopments);
  assert.ok(Array.isArray(json.data.keyDecisions));
  assert.ok(Array.isArray(json.data.deadlines));
  assert.ok(json.data.recommendedAction);
});

test('POST /api/conversations/:id/generate-reply creates contextual draft with selectable intents', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_04/generate-reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intent: 'confirm' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.body.length > 50);
  assert.ok(json.data.body.includes('Elena Rostova'));
  assert.ok(json.data.body.includes('Marcus Vance'));
  assert.equal(json.data.intentApplied, 'confirm');
});

test('Incoming Message Simulation re-evaluates classification while preserving human override', async () => {
  // First manually override conv_02 to 'client'
  await fetch(`${baseUrl}/api/conversations/conv_02/responsibility`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responsibility: 'client', reasoning: 'Elena manually flagged for Marcus review.' })
  });

  // Now simulate incoming message on conv_02
  const res = await fetch(`${baseUrl}/api/conversations/conv_02/incoming-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      body: 'Hi Elena, the hotel arrival window has been updated to next Thursday.'
    })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);

  // Verification: human override must NOT be silently overwritten!
  assert.equal(json.data.responsibility, 'client', 'Human manual override was preserved');
  assert.equal(json.data.isManualOverride, true);
  // An AI recommendation can be offered separately as pendingSuggestion if different
  if (json.data.pendingSuggestion) {
    assert.equal(json.data.pendingSuggestion.responsibility, 'assistant');
  }
});

test('Human Override Acceptance: assistant can accept AI suggested classification', async () => {
  // conv_02 has isManualOverride = true with pendingSuggestion
  const res = await fetch(`${baseUrl}/api/conversations/conv_02/accept-suggestion`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.isManualOverride, false);
  assert.equal(json.data.pendingSuggestion, null);
});

test('POST /api/conversations/copilot answers data-grounded questions without hallucinations', async () => {
  // 1. Question about assistant attention
  const res1 = await fetch(`${baseUrl}/api/conversations/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Show me emails that need my attention' })
  });
  assert.equal(res1.status, 200);
  const json1 = await res1.json();
  assert.equal(json1.success, true);
  assert.ok(json1.data.answer.includes('attention') || json1.data.answer.includes('conversations'));
  assert.ok(Array.isArray(json1.data.referencedConversations));

  // 2. Question about client attention
  const res2 = await fetch(`${baseUrl}/api/conversations/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: "Which emails require the client's attention?" })
  });
  assert.equal(res2.status, 200);
  const json2 = await res2.json();
  assert.equal(json2.success, true);
  assert.ok(json2.data.answer.includes('Marcus Vance') || json2.data.answer.includes('client'));
  assert.ok(json2.data.referencedConversations.length > 0);

  // 3. Question about what is waiting
  const res3 = await fetch(`${baseUrl}/api/conversations/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'What am I waiting for a response on?' })
  });
  assert.equal(res3.status, 200);
  const json3 = await res3.json();
  assert.equal(json3.success, true);
  assert.ok(json3.data.answer);
});

// ==========================================
// MILESTONE 4: CLIENT-FACING & SHARED WORKFLOWS
// ==========================================

test('GET /api/conversations?segment=client-queue returns only outstanding client conversations', async () => {
  const res = await fetch(`${baseUrl}/api/conversations?segment=client-queue`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);

  // Every conversation must be client responsibility and not completed/resolved/archived
  for (const c of json.data) {
    assert.equal(c.responsibility, 'client');
    assert.notEqual(c.actionStatus, 'completed');
    assert.notEqual(c.actionStatus, 'resolved');
    assert.equal(c.isArchived, false);
  }
});

test('POST /api/conversations/:id/handled marks conversation completed by client and preserves classification', async () => {
  // Use conv_05 (Stealth Spinout IP Licensing & Co-Investment Strategy)
  const res = await fetch(`${baseUrl}/api/conversations/conv_05/handled`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.id, 'conv_05');
  assert.equal(json.data.actionStatus, 'completed');
  assert.equal(json.data.handledBy, 'client');
  assert.equal(json.data.responsibility, 'client'); // Preserves responsibility classification
  assert.ok(json.data.handledAt);
  assert.ok(json.counts);

  // Verify it is now excluded from the active client attention queue
  const queueRes = await fetch(`${baseUrl}/api/conversations?segment=client-queue`);
  const queueJson = await queueRes.json();
  assert.ok(!queueJson.data.some(c => c.id === 'conv_05'), 'conv_05 removed from client queue');
});

test('POST /api/conversations/:id/delegate assigns task to assistant with human override and notes', async () => {
  // Use conv_10 (Personal Invitation: Oxford Philanthropy Round Table & Chancellor Dinner)
  const notes = 'Elena, please send regrets for the dinner but accept the afternoon roundtable.';
  const res = await fetch(`${baseUrl}/api/conversations/conv_10/delegate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.id, 'conv_10');
  assert.equal(json.data.responsibility, 'assistant');
  assert.equal(json.data.isManualOverride, true);
  assert.equal(json.data.delegatedBy, 'client');
  assert.equal(json.data.actionStatus, 'action_required');
  assert.equal(json.data.confidenceScore, 1.0);
  assert.equal(json.data.aiReasoning, notes);
  assert.ok(json.data.delegatedAt);

  // Verify shared workspace synchronization:
  // 1. Removed from client queue
  const queueRes = await fetch(`${baseUrl}/api/conversations?segment=client-queue`);
  const queueJson = await queueRes.json();
  assert.ok(!queueJson.data.some(c => c.id === 'conv_10'), 'conv_10 removed from client queue');

  // 2. Appears in assistant reply queue
  const asstRes = await fetch(`${baseUrl}/api/conversations?segment=assistant-reply`);
  const asstJson = await asstRes.json();
  assert.ok(asstJson.data.some(c => c.id === 'conv_10'), 'conv_10 appears in assistant queue');

  // 3. Appears in action-required queue
  const actRes = await fetch(`${baseUrl}/api/conversations?segment=action-required`);
  const actJson = await actRes.json();
  assert.ok(actJson.data.some(c => c.id === 'conv_10'), 'conv_10 appears in action-required queue');
});
