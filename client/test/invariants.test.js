import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('Design system tokens match Swiss Minimalist specification', () => {
  const css = fs.readFileSync(path.resolve('./src/styles/tokens.css'), 'utf-8');
  assert.ok(css.includes('#F6F5F0') || css.includes('#F7F6F1'), 'Background token #F6F5F0 / #F7F6F1 present');
  assert.ok(css.includes('#FFFFFF'), 'Surface token #FFFFFF present');
  assert.ok(css.includes('#354B3F') || css.includes('#25382E'), 'Primary Forest Green #354B3F / #25382E present');
  assert.ok(css.includes('#E9EDE6') || css.includes('#E7E9DF'), 'Sage token #E9EDE6 / #E7E9DF present');
  assert.ok(css.includes('#292D29') || css.includes('#292B29'), 'Charcoal token #292D29 / #292B29 present');
  assert.ok(css.includes('#DFD8CA'), 'Sand token #DFD8CA present');
  assert.ok(css.includes('--color-resp-assistant'), 'Assistant responsibility token present');
  assert.ok(css.includes('--color-resp-client'), 'Client responsibility token present');
  assert.ok(css.includes('--color-resp-none'), 'No reply token present');
  assert.ok(css.includes('--color-resp-review'), 'Needs review token present');
});

test('Typography fonts Manrope and Inter are integrated', () => {
  const html = fs.readFileSync(path.resolve('./index.html'), 'utf-8');
  assert.ok(html.includes('family=Inter'), 'Inter font imported');
  assert.ok(html.includes('family=Manrope'), 'Manrope font imported');
});

test('App routing declares all 13 required navigation sections', () => {
  const appCode = fs.readFileSync(path.resolve('./src/App.jsx'), 'utf-8');
  const requiredRoutes = [
    'overview',
    'inbox',
    'action-required',
    'assistant-reply',
    'client-reply',
    'no-reply',
    'waiting',
    'meetings',
    'important',
    'archive',
    'ai-assistant',
    'accounts',
    'settings'
  ];

  for (const r of requiredRoutes) {
    assert.ok(appCode.includes(`path="${r}"`), `Route path="${r}" registered in App.jsx`);
  }
});

test('Sidebar component implements simplified primary and secondary navigation architecture', () => {
  const sidebarCode = fs.readFileSync(path.resolve('./src/components/navigation/Sidebar.jsx'), 'utf-8');
  assert.ok(sidebarCode.includes('/app/overview'), 'Sidebar has /app/overview');
  assert.ok(sidebarCode.includes('/app/inbox'), 'Sidebar has /app/inbox');
  assert.ok(sidebarCode.includes('/app/action-required'), 'Sidebar has /app/action-required (Needs Attention)');
  assert.ok(sidebarCode.includes('/app/waiting'), 'Sidebar has /app/waiting');
  assert.ok(sidebarCode.includes('/app/meetings'), 'Sidebar has /app/meetings');
  assert.ok(sidebarCode.includes('/app/important'), 'Sidebar has /app/important');
  assert.ok(sidebarCode.includes('/app/ai-assistant'), 'Sidebar has /app/ai-assistant');
  assert.ok(sidebarCode.includes('/app/archive'), 'Sidebar has /app/archive');
  assert.ok(sidebarCode.includes('/app/accounts'), 'Sidebar has /app/accounts');
  assert.ok(sidebarCode.includes('/app/settings'), 'Sidebar has /app/settings');
  assert.ok(sidebarCode.includes('useConversations'), 'Sidebar connects to dynamic conversation counts');
});

test('Inbox conversation list header provides responsibility category filter tabs', () => {
  const headerCode = fs.readFileSync(path.resolve('./src/pages/inbox/components/ConversationListHeader.jsx'), 'utf-8');
  assert.ok(headerCode.includes('Assistant to Reply'), 'Header has Assistant to Reply filter tab');
  assert.ok(headerCode.includes('Client to Reply'), 'Header has Client to Reply filter tab');
  assert.ok(headerCode.includes('No Reply Needed'), 'Header has No Reply Needed filter tab');
  assert.ok(headerCode.includes('Needs Review'), 'Header has Needs Review filter tab');
});

test('TopNav component includes search, account selector, sync status, and client view switch', () => {
  const topNavCode = fs.readFileSync(path.resolve('./src/components/navigation/TopNav.jsx'), 'utf-8');
  assert.ok(topNavCode.includes('searchQuery'), 'TopNav has search state');
  assert.ok(topNavCode.includes('selectedAccountId'), 'TopNav has account selector');
  assert.ok(topNavCode.includes('syncAll'), 'TopNav has sync action');
  assert.ok(topNavCode.includes('Client View'), 'TopNav has Client View switch button');
  assert.ok(topNavCode.includes('switchRole'), 'TopNav has role switch in user menu');
});

test('Fallback seeded conversations contain at least 16 executive emails with AI reasoning', async () => {
  const mod = await import('../src/data/fallbackConversations.js');
  const conversations = mod.fallbackConversations;
  assert.ok(Array.isArray(conversations), 'fallbackConversations is an array');
  assert.ok(conversations.length >= 16, `Expected at least 16 conversations, got ${conversations.length}`);

  const hasAssistant = conversations.some(c => c.responsibility === 'assistant');
  const hasClient = conversations.some(c => c.responsibility === 'client');
  const hasNone = conversations.some(c => c.responsibility === 'none');
  const hasReview = conversations.some(c => c.responsibility === 'review' || (c.confidenceScore || c.aiConfidence) < 0.75);

  assert.ok(hasAssistant, 'Has Assistant to Reply emails');
  assert.ok(hasClient, 'Has Client to Reply emails');
  assert.ok(hasNone, 'Has No Reply Needed emails');
  assert.ok(hasReview, 'Has Low Confidence / Needs Review emails');

  for (const c of conversations) {
    assert.ok(c.id, 'Conversation has id');
    assert.ok(c.subject, 'Conversation has subject');
    assert.ok(c.sender, 'Conversation has sender');
    assert.ok(Array.isArray(c.messages) && c.messages.length > 0, 'Conversation has message history');
    assert.ok(c.aiReasoning, 'Conversation has AI reasoning explanation');
    assert.ok(typeof (c.confidenceScore ?? c.aiConfidence) === 'number', 'Conversation has AI confidence score');
  }
});

test('Milestone 2 Inbox components exist and contain core UI implementation', () => {
  const components = [
    { file: './src/pages/inbox/InboxPage.jsx', exportName: 'InboxPage' },
    { file: './src/pages/inbox/components/ConversationListHeader.jsx', exportName: 'ConversationListHeader' },
    { file: './src/pages/inbox/components/ConversationListItem.jsx', exportName: 'ConversationListItem' },
    { file: './src/pages/inbox/components/ConversationReaderHeader.jsx', exportName: 'ConversationReaderHeader' },
    { file: './src/pages/inbox/components/ConversationActionBar.jsx', exportName: 'ConversationActionBar' },
    { file: './src/pages/inbox/components/AIReplyTriageCard.jsx', exportName: 'AIReplyTriageCard' },
    { file: './src/pages/inbox/components/AISummaryCard.jsx', exportName: 'AISummaryCard' },
    { file: './src/pages/inbox/components/MessageThreadView.jsx', exportName: 'MessageThreadView' },
    { file: './src/pages/inbox/components/ReplyComposer.jsx', exportName: 'ReplyComposer' }
  ];

  for (const comp of components) {
    const fullPath = path.resolve(comp.file);
    assert.ok(fs.existsSync(fullPath), `${comp.file} exists`);
    const code = fs.readFileSync(fullPath, 'utf-8');
    assert.ok(code.includes(`export default function ${comp.exportName}`), `${comp.file} has default export ${comp.exportName}`);
  }
});

test('ConversationContext provides state and action handlers including Milestone 3 AI actions', () => {
  const fullPath = path.resolve('./src/context/ConversationContext.jsx');
  assert.ok(fs.existsSync(fullPath), 'ConversationContext.jsx exists');
  const code = fs.readFileSync(fullPath, 'utf-8');
  assert.ok(code.includes('export function ConversationProvider'), 'ConversationProvider exported');
  assert.ok(code.includes('export function useConversations'), 'useConversations hook exported');
  assert.ok(code.includes('selectConversation'), 'selectConversation provided');
  assert.ok(code.includes('toggleRead'), 'toggleRead provided');
  assert.ok(code.includes('toggleImportant'), 'toggleImportant provided');
  assert.ok(code.includes('archiveConversation'), 'archiveConversation provided');
  assert.ok(code.includes('changeResponsibility'), 'changeResponsibility provided');
  assert.ok(code.includes('classifyConversation'), 'classifyConversation provided');
  assert.ok(code.includes('simulateIncomingMessage'), 'simulateIncomingMessage provided');
  assert.ok(code.includes('acceptSuggestion'), 'acceptSuggestion provided');
  assert.ok(code.includes('dismissSuggestion'), 'dismissSuggestion provided');
});

test('App.jsx binds all 9 email segment paths and AI Assistant route to interactive components', () => {
  const appCode = fs.readFileSync(path.resolve('./src/App.jsx'), 'utf-8');
  assert.ok(appCode.includes('ConversationProvider'), 'App wraps workspace in ConversationProvider');
  assert.ok(appCode.includes('<InboxPage defaultSegment="all" />'), 'inbox route mapped');
  assert.ok(appCode.includes('<InboxPage defaultSegment="action_required" />'), 'action-required route mapped');
  assert.ok(appCode.includes('<InboxPage defaultSegment="assistant_reply" />'), 'assistant-reply route mapped');
  assert.ok(appCode.includes('<InboxPage defaultSegment="client_reply" />'), 'client-reply route mapped');
  assert.ok(appCode.includes('<InboxPage defaultSegment="no_reply" />'), 'no-reply route mapped');
  assert.ok(appCode.includes('<InboxPage defaultSegment="waiting" />'), 'waiting route mapped');
  assert.ok(appCode.includes('<InboxPage defaultSegment="meetings" />'), 'meetings route mapped');
  assert.ok(appCode.includes('<InboxPage defaultSegment="important" />'), 'important route mapped');
  assert.ok(appCode.includes('<InboxPage defaultSegment="archive" />'), 'archive route mapped');
  assert.ok(appCode.includes('<AIAssistantPage />'), 'ai-assistant route mapped to AIAssistantPage');
});

// Milestone 3 Invariants
test('Milestone 3 AIAssistantPage exists and exports valid React component', () => {
  const fullPath = path.resolve('./src/pages/assistant/AIAssistantPage.jsx');
  assert.ok(fs.existsSync(fullPath), 'AIAssistantPage.jsx exists');
  const code = fs.readFileSync(fullPath, 'utf-8');
  assert.ok(code.includes('export default function AIAssistantPage'), 'AIAssistantPage has default export');
  assert.ok(code.includes('askCopilot'), 'AIAssistantPage connects to copilot API');
  assert.ok(code.includes('starterPrompts'), 'AIAssistantPage includes suggested prompts');
});

test('AIReplyTriageCard supports human override protection and simulated message re-evaluation', () => {
  const code = fs.readFileSync(path.resolve('./src/pages/inbox/components/AIReplyTriageCard.jsx'), 'utf-8');
  assert.ok(code.includes('Manual Override Active'), 'AIReplyTriageCard displays manual override state');
  assert.ok(code.includes('pendingSuggestion'), 'AIReplyTriageCard handles pending AI suggestion');
  assert.ok(code.includes('simulateIncomingMessage'), 'AIReplyTriageCard has incoming message simulation trigger');
  assert.ok(code.includes('acceptSuggestion'), 'AIReplyTriageCard has accept suggestion action');
  assert.ok(code.includes('confidencePercent'), 'AIReplyTriageCard displays confidence score');
});

test('ReplyComposer supports AI contextual reply drafting with selectable intents', () => {
  const code = fs.readFileSync(path.resolve('./src/pages/inbox/components/ReplyComposer.jsx'), 'utf-8');
  assert.ok(code.includes('Draft with AI'), 'ReplyComposer has AI drafting controls');
  assert.ok(code.includes('generateReply'), 'ReplyComposer triggers generateReply');
  assert.ok(code.includes('confirm'), 'ReplyComposer includes confirm intent');
  assert.ok(code.includes('request_info'), 'ReplyComposer includes request_info intent');
  assert.ok(code.includes('approve'), 'ReplyComposer includes approve intent');
  assert.ok(code.includes('reschedule'), 'ReplyComposer includes reschedule intent');
  assert.ok(code.includes('Human review required'), 'ReplyComposer displays human review notice');
});

// Milestone 4 Invariants
test('Milestone 4 ClientQueuePage exists and exports valid React component', () => {
  const fullPath = path.resolve('./src/pages/client/ClientQueuePage.jsx');
  assert.ok(fs.existsSync(fullPath), 'ClientQueuePage.jsx exists');
  const code = fs.readFileSync(fullPath, 'utf-8');
  assert.ok(code.includes('export default function ClientQueuePage'), 'ClientQueuePage has default export');
  assert.ok(code.includes('clientQueue'), 'ClientQueuePage calculates client attention queue');
  assert.ok(code.includes('markHandled'), 'ClientQueuePage wires markHandled action');
  assert.ok(code.includes('delegateToAssistant'), 'ClientQueuePage wires delegateToAssistant action');
});

test('Milestone 4 Client subcomponents exist and render required client-facing elements', () => {
  const components = [
    { file: './src/pages/client/components/ClientTopBar.jsx', exportName: 'ClientTopBar' },
    { file: './src/pages/client/components/ClientAttentionCard.jsx', exportName: 'ClientAttentionCard' },
    { file: './src/pages/client/components/ClientConversationView.jsx', exportName: 'ClientConversationView' },
    { file: './src/pages/client/components/ClientDelegateModal.jsx', exportName: 'ClientDelegateModal' }
  ];

  for (const comp of components) {
    const fullPath = path.resolve(comp.file);
    assert.ok(fs.existsSync(fullPath), `${comp.file} exists`);
    const code = fs.readFileSync(fullPath, 'utf-8');
    assert.ok(code.includes(`export default function ${comp.exportName}`), `${comp.file} has default export ${comp.exportName}`);
  }

  // Check action buttons in ClientConversationView
  const viewCode = fs.readFileSync(path.resolve('./src/pages/client/components/ClientConversationView.jsx'), 'utf-8');
  assert.ok(viewCode.includes('Mark as Handled'), 'ClientConversationView has Mark as Handled action');
  assert.ok(viewCode.includes('Ask Assistant to Take Over'), 'ClientConversationView has Ask Assistant to Take Over action');
  assert.ok(viewCode.includes('Why your input is required'), 'ClientConversationView highlights reason for client response');
});

test('App.jsx binds /client route for Marcus Vance executive workspace', () => {
  const appCode = fs.readFileSync(path.resolve('./src/App.jsx'), 'utf-8');
  assert.ok(appCode.includes('path="/client"'), '/client route registered in App.jsx');
  assert.ok(appCode.includes('<ClientQueuePage />'), 'ClientQueuePage mapped to /client');
});

test('ConversationContext provides Milestone 4 client actions: markHandled and delegateToAssistant', () => {
  const fullPath = path.resolve('./src/context/ConversationContext.jsx');
  const code = fs.readFileSync(fullPath, 'utf-8');
  assert.ok(code.includes('markHandled'), 'markHandled exposed in ConversationContext');
  assert.ok(code.includes('delegateToAssistant'), 'delegateToAssistant exposed in ConversationContext');
});

// UX Refinement & Public Homepage Invariants
test('Public HomePage exists and exports valid React landing page component', () => {
  const fullPath = path.resolve('./src/pages/public/HomePage.jsx');
  assert.ok(fs.existsSync(fullPath), 'HomePage.jsx exists');
  const code = fs.readFileSync(fullPath, 'utf-8');
  assert.ok(code.includes('export default function HomePage'), 'HomePage has default export');
  assert.ok(code.includes('Every conversation. The right person to respond.'), 'HomePage contains approved hero headline');
  assert.ok(code.includes('Explore demo'), 'HomePage contains Explore demo CTA');
  assert.ok(code.includes('Three steps to seamless correspondence'), 'HomePage contains how it works section');
  assert.ok(code.includes('For Personal Assistants'), 'HomePage contains assistant experience overview');
  assert.ok(code.includes('For Busy Clients'), 'HomePage contains client experience overview');
});

test('App.jsx mounts / route to public HomePage for unauthenticated visitors', () => {
  const appCode = fs.readFileSync(path.resolve('./src/App.jsx'), 'utf-8');
  assert.ok(appCode.includes('path="/"'), '/ path registered in App.jsx');
  assert.ok(appCode.includes('<HomePage />'), 'HomePage mapped to /');
});

test('InboxPage implements list-first interaction with focused single-conversation detail and Back to Inbox navigation', () => {
  const code = fs.readFileSync(path.resolve('./src/pages/inbox/InboxPage.jsx'), 'utf-8');
  assert.ok(code.includes('handleBackToInbox'), 'InboxPage provides handleBackToInbox handler');
  assert.ok(code.includes('handleSelectConversation'), 'InboxPage provides handleSelectConversation handler');
  assert.ok(code.includes('Escape'), 'InboxPage supports Escape key return navigation');

  const readerHeader = fs.readFileSync(path.resolve('./src/pages/inbox/components/ConversationReaderHeader.jsx'), 'utf-8');
  assert.ok(readerHeader.includes('Back to'), 'ConversationReaderHeader renders Back to button');
});

test('OverviewPage prioritizes "What needs attention today?" with central action queue', () => {
  const code = fs.readFileSync(path.resolve('./src/pages/assistant/OverviewPage.jsx'), 'utf-8');
  assert.ok(code.includes('What needs attention today?'), 'OverviewPage title matches design spec');
  assert.ok(code.includes("Today's Action Queue"), 'OverviewPage features Today Action Queue as central element');
  assert.ok(code.includes('1. Client Decisions'), 'OverviewPage prioritizes client attention');
  assert.ok(code.includes('2. Assistant Actions'), 'OverviewPage prioritizes assistant actions');
});

test('Responsibility filters return exact dataset matching visible counts (All: 17, Assistant: 7, Client: 5, No Reply: 4, Needs Review: 1)', async () => {
  const { api } = await import('../src/services/api.js');
  
  const allRes = await api.getConversations({ segment: 'all' });
  assert.equal(allRes.data.length, 17, `All segment should return 17 unarchived conversations, got ${allRes.data.length}`);
  assert.equal(allRes.counts.all, 17, 'Total unarchived count equals 17');
  assert.equal(allRes.counts.assistantReply, 7, 'Assistant count equals 7');
  assert.equal(allRes.counts.clientReply, 5, 'Client count equals 5');
  assert.equal(allRes.counts.noReply, 4, 'No reply count equals 4');
  assert.equal(allRes.counts.needsReview, 1, 'Needs review count equals 1');

  const asstRes = await api.getConversations({ segment: 'assistant_reply' });
  assert.equal(asstRes.data.length, 7, `Assistant segment should return 7 conversations, got ${asstRes.data.length}`);
  assert.ok(asstRes.data.every(c => c.responsibility === 'assistant'), 'All returned conversations belong to assistant');

  const clientRes = await api.getConversations({ segment: 'client_reply' });
  assert.equal(clientRes.data.length, 5, `Client segment should return 5 conversations, got ${clientRes.data.length}`);
  assert.ok(clientRes.data.every(c => c.responsibility === 'client'), 'All returned conversations belong to client');

  const noneRes = await api.getConversations({ segment: 'no_reply' });
  assert.equal(noneRes.data.length, 4, `No Reply segment should return 4 conversations, got ${noneRes.data.length}`);
  assert.ok(noneRes.data.every(c => c.responsibility === 'none'), 'All returned conversations have responsibility none');

  const reviewRes = await api.getConversations({ segment: 'needs_review' });
  assert.equal(reviewRes.data.length, 1, `Needs Review segment should return 1 conversation, got ${reviewRes.data.length}`);
  assert.ok(reviewRes.data.every(c => c.needsReview || c.responsibility === 'review'), 'Returned conversation requires review');
});

test('Search operates accurately within active responsibility filter without leaking unrelated threads', async () => {
  const { api } = await import('../src/services/api.js');

  // Search inside assistant_reply for Club One Air
  const asstSearch = await api.getConversations({ segment: 'assistant_reply', q: 'Club One Air' });
  assert.equal(asstSearch.data.length, 1, 'Should find 1 Club One Air thread in assistant_reply');
  assert.equal(asstSearch.data[0].id, 'conv_18');
  assert.equal(asstSearch.data[0].responsibility, 'assistant');

  // Search inside client_reply for Board
  const clientSearch = await api.getConversations({ segment: 'client_reply', q: 'Board' });
  assert.equal(clientSearch.data.length, 1, 'Should find 1 Board resolution thread in client_reply');
  assert.equal(clientSearch.data[0].id, 'conv_01');
  assert.equal(clientSearch.data[0].responsibility, 'client');

  // Search for non-existent term inside client_reply
  const noMatch = await api.getConversations({ segment: 'client_reply', q: 'NonExistentXYZ' });
  assert.equal(noMatch.data.length, 0, 'Should return empty array when no query matches');
});

test('ConversationListHeader implements client-side URL sync, animated pill layoutId, and live counts', () => {
  const code = fs.readFileSync(path.resolve('./src/pages/inbox/components/ConversationListHeader.jsx'), 'utf-8');
  assert.ok(code.includes('handleTabClick'), 'Header implements handleTabClick');
  assert.ok(code.includes('activeRespTabIndicator'), 'Header provides Framer Motion layoutId activeRespTabIndicator');
  assert.ok(code.includes('useNavigate'), 'Header uses useNavigate for client-side routing');
  assert.ok(code.includes('counts?.assistantReply'), 'Header binds to live assistant count');
  assert.ok(code.includes('counts?.clientReply'), 'Header binds to live client count');
});

test('Public HomePage implements interactive 3D hero visual with perspective, tilt, and layered cards', () => {
  const code = fs.readFileSync(path.resolve('./src/pages/public/HomePage.jsx'), 'utf-8');
  assert.ok(code.includes('perspective:'), 'HomePage sets CSS 3D perspective');
  assert.ok(code.includes('handleMouseMove'), 'HomePage handles mouse movement for 3D tilt');
  assert.ok(code.includes('rotateX') && code.includes('rotateY'), 'HomePage applies 3D rotation');
  assert.ok(code.includes('translateZ('), 'HomePage layers conversation cards with 3D depth (translateZ)');
  assert.ok(code.includes('Relay Autonomous Routing Engine'), 'HomePage displays autonomous routing engine banner');
  assert.ok(code.includes('whileInView'), 'HomePage implements scroll reveals for lower sections');
});

test('Brand logo across Sidebar, ClientTopBar, and AuthLayout is purely decorative, non-interactive, and non-selectable', () => {
  const sidebarCode = fs.readFileSync(path.resolve('./src/components/navigation/Sidebar.jsx'), 'utf-8');
  const clientTopBarCode = fs.readFileSync(path.resolve('./src/pages/client/components/ClientTopBar.jsx'), 'utf-8');
  const authLayoutCode = fs.readFileSync(path.resolve('./src/layouts/AuthLayout.jsx'), 'utf-8');
  const globalCss = fs.readFileSync(path.resolve('./src/styles/global.css'), 'utf-8');

  // Decorative & non-interactive checks
  assert.ok(sidebarCode.includes('relay-brand-container'), 'Sidebar uses relay-brand-container');
  assert.ok(sidebarCode.includes('tabIndex={-1}'), 'Sidebar brand container has tabIndex={-1}');
  assert.ok(sidebarCode.includes('role="presentation"'), 'Sidebar brand container has role="presentation"');
  assert.ok(sidebarCode.includes('relay-brand-mark'), 'Sidebar has relay-brand-mark');
  assert.ok(!sidebarCode.includes('<Link to="/" className="brand-link"'), 'Sidebar does not wrap brand in Link');

  assert.ok(clientTopBarCode.includes('relay-brand-container'), 'ClientTopBar uses relay-brand-container');
  assert.ok(clientTopBarCode.includes('tabIndex={-1}'), 'ClientTopBar brand container has tabIndex={-1}');
  assert.ok(clientTopBarCode.includes('relay-brand-mark'), 'ClientTopBar has relay-brand-mark');

  assert.ok(authLayoutCode.includes('relay-brand-container'), 'AuthLayout uses relay-brand-container');
  assert.ok(authLayoutCode.includes('tabIndex={-1}'), 'AuthLayout brand container has tabIndex={-1}');
  assert.ok(!authLayoutCode.includes('<Link to="/" className="brand-link"'), 'AuthLayout does not wrap brand in Link');

  // CSS guarantees
  assert.ok(globalCss.includes('.relay-brand-mark'), 'global.css defines .relay-brand-mark');
  assert.ok(globalCss.includes('user-select: none !important'), 'global.css prevents text selection on brand');
  assert.ok(globalCss.includes('pointer-events: none !important'), 'global.css disables pointer events on brand mark');
});

test('TopNav notification bell dot and Mark all read are bound to live conversation unread state', () => {
  const code = fs.readFileSync(path.resolve('./src/components/navigation/TopNav.jsx'), 'utf-8');
  assert.ok(code.includes('unreadNotificationsCount > 0'), 'Bell dot conditionally rendered when unreadNotificationsCount > 0');
  assert.ok(code.includes('markAllAsRead'), 'TopNav connects to markAllAsRead handler');
  assert.ok(code.includes('markAsRead'), 'TopNav connects to markAsRead handler');
  assert.ok(code.includes('useConversations'), 'TopNav integrates useConversations');
  assert.ok(code.includes('Mark all read'), 'TopNav provides Mark all read trigger');
});

test('ConversationContext provides explicit markAsRead and markAllAsRead handlers with optimistic updates', () => {
  const code = fs.readFileSync(path.resolve('./src/context/ConversationContext.jsx'), 'utf-8');
  assert.ok(code.includes('markAsRead = useCallback'), 'ConversationContext implements markAsRead');
  assert.ok(code.includes('markAllAsRead = useCallback'), 'ConversationContext implements markAllAsRead');
  assert.ok(code.includes('markAsRead,'), 'ConversationContext exports markAsRead');
  assert.ok(code.includes('markAllAsRead,'), 'ConversationContext exports markAllAsRead');
});

test('ConversationListItem and AIReplyTriageCard display Handled by Client status while preserving historical classification', () => {
  const itemCode = fs.readFileSync(path.resolve('./src/pages/inbox/components/ConversationListItem.jsx'), 'utf-8');
  assert.ok(itemCode.includes('Handled by Client'), 'ConversationListItem displays Handled by Client');
  assert.ok(itemCode.includes('<CheckCircle2'), 'ConversationListItem displays CheckCircle2 for completed');

  const cardCode = fs.readFileSync(path.resolve('./src/pages/inbox/components/AIReplyTriageCard.jsx'), 'utf-8');
  assert.ok(cardCode.includes('Action Completed by Arjun Mehta (Client)'), 'AIReplyTriageCard displays Action Completed by Arjun Mehta');
  assert.ok(cardCode.includes('Historical responsibility retained'), 'AIReplyTriageCard explains historical audit trail');
});

test('API service supports markAllRead and accurately persists unread status reset', async () => {
  const { api } = await import('../src/services/api.js');
  const res = await api.markAllRead();
  assert.equal(res.success, true, 'markAllRead returns success: true');
  assert.equal(res.counts.unread, 0, 'Unread count drops to 0 after markAllRead');

  const refreshed = await api.getConversations({ segment: 'all' });
  assert.ok(refreshed.data.every(c => c.isUnread === false), 'All conversations are marked isUnread: false');
});

test('API service markHandled completes conversation, sets handledBy client, and decrements clientQueue count', async () => {
  const { api } = await import('../src/services/api.js');
  const res = await api.markHandled('conv_01');
  assert.equal(res.success, true, 'markHandled returns success: true');
  assert.equal(res.data.actionStatus, 'completed', 'Action status is set to completed');
  assert.equal(res.data.handledBy, 'client', 'HandledBy is marked as client');
  assert.equal(res.data.responsibility, 'client', 'Original client responsibility classification is preserved');
  assert.ok(res.counts.clientQueue < 5, 'Client queue count decrements');
});

test('Navigation links and CTA polish invariants are verified', () => {
  const authLayoutCode = fs.readFileSync(path.resolve('./src/layouts/AuthLayout.jsx'), 'utf-8');
  assert.ok(authLayoutCode.includes('Back to Homepage'), 'AuthLayout contains Back to Homepage link');
  assert.ok(authLayoutCode.includes('ArrowLeft'), 'AuthLayout uses ArrowLeft icon for Back to Homepage');

  const sidebarCode = fs.readFileSync(path.resolve('./src/components/navigation/Sidebar.jsx'), 'utf-8');
  assert.ok(sidebarCode.includes("label: 'Website Home'"), 'Sidebar contains Website Home navigation link');
  assert.ok(sidebarCode.includes("path: '/'"), 'Sidebar Website Home routes to /');

  const clientTopBarCode = fs.readFileSync(path.resolve('./src/pages/client/components/ClientTopBar.jsx'), 'utf-8');
  assert.ok(clientTopBarCode.includes('Website Home'), 'ClientTopBar contains Website Home button');

  const homePageCode = fs.readFileSync(path.resolve('./src/pages/public/HomePage.jsx'), 'utf-8');
  assert.ok(homePageCode.includes('icon={ArrowRight}'), 'HomePage header CTA uses ArrowRight icon');
  // Check footer CTA does not use Sparkles icon
  const footerCtaSection = homePageCode.slice(homePageCode.indexOf('Experience Relay\'s dual-workspace architecture'));
  assert.ok(!footerCtaSection.includes('icon={Sparkles}'), 'Footer Explore Live Demo button does not have star/Sparkles icon');
});
