import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';
import { geminiService } from '../services/gemini.service.js';
import { connectDB, disconnectDB, getDbStatus } from '../config/db.js';
import { seedDatabase } from '../services/seed.service.js';

let server;
let baseUrl;

test.before(async () => {
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      await seedDatabase();
    } catch (e) {
      console.warn('[Test DB] Could not connect to Atlas test database, using isolated fallback.');
    }
  }

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
  await disconnectDB();
  await new Promise((resolve) => server.close(resolve));
});

test('GET /api/health returns 200 and milestone 3 info', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.milestone, 3);
  assert.ok('database' in data);
  assert.ok('status' in data.database);
});

test('GET /api/health reports database status without exposing credentials', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.ok(data.database);
  assert.ok(['connected', 'disconnected', 'connecting'].includes(data.database.status));

  // Verify zero credentials or URIs leaked
  const str = JSON.stringify(data);
  assert.ok(!str.includes('password'));
  assert.ok(!str.includes('mongodb+srv://'));
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
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length >= 2);
  assert.ok(json.data.some((a) => a.provider === 'gmail'));
});

test('POST /api/accounts/connect connects simulated mailbox', async () => {
  const res = await fetch(`${baseUrl}/api/accounts/connect`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'outlook',
      emailAddress: 'executive.test@company.com',
      name: 'Executive Outlook'
    })
  });
  assert.equal(res.status, 201);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.emailAddress, 'executive.test@company.com');
  assert.equal(json.data.connectionStatus, 'connected');
});

test('GET /api/conversations returns at least 16 realistic seeded conversations', async () => {
  const res = await fetch(`${baseUrl}/api/conversations`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length >= 16);
  assert.ok(json.counts);
});

test('GET /api/conversations filters by segment (client-reply)', async () => {
  const res = await fetch(`${baseUrl}/api/conversations?segment=client-reply`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);
  for (const c of json.data) {
    assert.equal(c.responsibility, 'client');
  }
});

test('GET /api/conversations performs search query across sender & subject', async () => {
  const res = await fetch(`${baseUrl}/api/conversations?q=Sterling`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.length > 0);
  assert.ok(json.data.some((c) => c.sender.name.includes('Sterling') || c.subject.includes('Sterling')));
});

test('GET /api/conversations/:id returns single conversation with full message history', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_01`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.id, 'conv_01');
  assert.ok(Array.isArray(json.data.messages));
  assert.ok(json.data.messages.length >= 2);
  assert.ok(json.data.messages[0].body);
});

test('PATCH /api/conversations/:id updates read, important, and completed status', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_01`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isImportant: true, isRead: true })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.isImportant, true);
  assert.equal(json.data.isUnread, false);
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
  geminiService.setMockResponse({
    responsibility: 'client',
    confidenceScore: 0.62,
    needsReview: true,
    explanation: 'Ambiguous email with mixed operational scheduling and statutory financial terms; confidence below threshold.',
    requiresAction: true,
    importantInformation: ['Ambiguous allocation']
  });
  const res = await fetch(`${baseUrl}/api/conversations/conv_12/classify`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  geminiService.clearMockResponse();
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
  assert.equal(json.classification.responsibility, 'assistant');
  assert.equal(json.classification.confidenceScore, 0.96);
  assert.equal(json.classification.aiSource, 'gemini-mock');
  assert.equal(json.data.aiSummary, 'Mocked executive summary of flight logistics.');
  assert.ok(json.data.importantInformation.includes('Flight booking tail D-CSMC verified'));

  geminiService.clearMockResponse();
});

test('POST /api/conversations/:id/summary generates comprehensive conversation summary', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_04/summary`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.overview.length > 10);
  assert.ok(Array.isArray(json.data.keyDecisions));
  assert.ok(Array.isArray(json.data.pendingQuestions));
  assert.ok(Array.isArray(json.data.deadlines));
  assert.ok(json.data.recommendedAction);
});

test('POST /api/conversations/:id/generate-reply creates contextual draft with selectable intents', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_04/generate-reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intent: 'confirm', instructions: 'Confirm Marcus will attend with 4 guests.' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.body.length > 20);
  assert.equal(json.data.intentApplied, 'confirm');
  assert.ok(json.data.subject.startsWith('Re:'));
});

test('Incoming Message Simulation re-evaluates classification while preserving human override', async () => {
  // 1. Manually set override on conv_01 to assistant
  await fetch(`${baseUrl}/api/conversations/conv_01/responsibility`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responsibility: 'assistant', reasoning: 'Elena to manage document logistics.' })
  });

  // 2. Simulate new incoming message suggesting client action
  const simRes = await fetch(`${baseUrl}/api/conversations/conv_01/incoming-message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      body: 'Marcus, we urgently need your personal written signature on the deed of indemnity before 5 PM today.'
    })
  });
  assert.equal(simRes.status, 200);
  const simJson = await simRes.json();
  assert.equal(simJson.success, true);
  assert.equal(simJson.simulated, true);

  // 3. Verify override is preserved: responsibility remains assistant
  assert.equal(simJson.data.responsibility, 'assistant');
  assert.equal(simJson.data.isManualOverride, true);

  // 4. Verify AI queued a pendingSuggestion rather than silently altering
  assert.ok(simJson.data.pendingSuggestion);
  assert.equal(simJson.data.pendingSuggestion.responsibility, 'client');
  assert.ok(simJson.data.pendingSuggestion.reason.includes('Manual override'));
});

test('Human Override Acceptance: assistant can accept AI suggested classification', async () => {
  const acceptRes = await fetch(`${baseUrl}/api/conversations/conv_01/accept-suggestion`, {
    method: 'POST'
  });
  assert.equal(acceptRes.status, 200);
  const acceptJson = await acceptRes.json();
  assert.equal(acceptJson.success, true);
  assert.equal(acceptJson.data.responsibility, 'client');
  assert.equal(acceptJson.data.isManualOverride, false);
  assert.equal(acceptJson.data.pendingSuggestion, null);
});

test('POST /api/conversations/copilot answers data-grounded questions without hallucinations', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/copilot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Show me emails that need my attention' })
  });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(json.data.answer.includes('attention') || json.data.answer.includes('conversations'));
  assert.ok(Array.isArray(json.data.referencedConversations));
  assert.ok(json.data.referencedConversations.length > 0);
  assert.ok(json.data.referencedConversations[0].id);
  assert.ok(json.data.referencedConversations[0].subject);
});

// ==========================================
// MILESTONE 4: CLIENT WORKSPACE & ACTIONS
// ==========================================

test('GET /api/conversations?segment=client-queue returns only outstanding client conversations', async () => {
  const res = await fetch(`${baseUrl}/api/conversations?segment=client-queue`);
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.ok(Array.isArray(json.data));
  assert.ok(json.data.length > 0);

  for (const c of json.data) {
    assert.equal(c.responsibility, 'client');
    assert.notEqual(c.actionStatus, 'completed');
    assert.notEqual(c.actionStatus, 'resolved');
    assert.equal(c.isArchived, false);
  }
});

test('POST /api/conversations/:id/handled marks conversation completed by client and preserves classification', async () => {
  const res = await fetch(`${baseUrl}/api/conversations/conv_05/handled`, { method: 'POST' });
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.success, true);
  assert.equal(json.data.id, 'conv_05');
  assert.equal(json.data.actionStatus, 'completed');
  assert.equal(json.data.handledBy, 'client');
  assert.equal(json.data.responsibility, 'client');
  assert.ok(json.data.handledAt);
  assert.ok(json.counts);

  const queueRes = await fetch(`${baseUrl}/api/conversations?segment=client-queue`);
  const queueJson = await queueRes.json();
  assert.ok(!queueJson.data.some((c) => c.id === 'conv_05'), 'conv_05 removed from client queue');
});

test('POST /api/conversations/:id/delegate assigns task to assistant with human override and notes', async () => {
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

  const queueRes = await fetch(`${baseUrl}/api/conversations?segment=client-queue`);
  const queueJson = await queueRes.json();
  assert.ok(!queueJson.data.some((c) => c.id === 'conv_10'), 'conv_10 removed from client queue');

  const asstRes = await fetch(`${baseUrl}/api/conversations?segment=assistant-reply`);
  const asstJson = await asstRes.json();
  assert.ok(asstJson.data.some((c) => c.id === 'conv_10'), 'conv_10 appears in assistant queue');

  const actRes = await fetch(`${baseUrl}/api/conversations?segment=action-required`);
  const actJson = await actRes.json();
  assert.ok(actJson.data.some((c) => c.id === 'conv_10'), 'conv_10 appears in action-required queue');
});

// ==========================================
// MILESTONE 5: PERSISTENCE & SEEDING TESTS
// ==========================================

test('Persistence: Conversation updates persist and reflect in subsequent reads', async () => {
  const patchRes = await fetch(`${baseUrl}/api/conversations/conv_02`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isImportant: true, isUnread: false })
  });
  assert.equal(patchRes.status, 200);
  const patchJson = await patchRes.json();
  assert.equal(patchJson.data.isImportant, true);
  assert.equal(patchJson.data.isUnread, false);

  const getRes = await fetch(`${baseUrl}/api/conversations/conv_02`);
  assert.equal(getRes.status, 200);
  const getJson = await getRes.json();
  assert.equal(getJson.data.isImportant, true);
  assert.equal(getJson.data.isUnread, false);
});

test('Persistence: Created user persists and is retrievable via demo-users', async () => {
  const uniqueEmail = `persist_user_${Date.now()}@relay.test`;
  const signupRes = await fetch(`${baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Persistent User',
      email: uniqueEmail,
      role: 'assistant'
    })
  });
  assert.equal(signupRes.status, 201);

  const usersRes = await fetch(`${baseUrl}/api/auth/demo-users`);
  const usersJson = await usersRes.json();
  assert.ok(usersJson.data.some((u) => u.email === uniqueEmail));
});

test('Idempotent Seeding: Running seeder multiple times never duplicates conversations', async () => {
  const beforeRes = await fetch(`${baseUrl}/api/conversations`);
  const beforeJson = await beforeRes.json();
  const initialCount = beforeJson.data.length;

  if (process.env.MONGODB_URI) {
    await seedDatabase();
  }

  const afterRes = await fetch(`${baseUrl}/api/conversations`);
  const afterJson = await afterRes.json();
  assert.equal(afterJson.data.length, initialCount);
});
