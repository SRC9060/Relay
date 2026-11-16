# Relay — AI-Powered Personal Assistant Email Workspace

Relay is a high-conviction, dual-experience email workspace engineered specifically for **Executive Assistants** (Ananya Sharma) and their **Clients / Managing Partners** (Arjun Mehta).

Rather than reproducing generic email dashboards or copying legacy clients, Relay is designed around a singular, high-leverage principle: **AI-Powered Reply Responsibility**. Every incoming conversation is classified into clear, actionable responsibility queues:
- **Assistant to Reply**: Routine coordination, appointment scheduling, flight/hotel logistics, and administrative follow-ups.
- **Client to Reply**: High-stakes approvals, personal opinions, statutory signatures, and sensitive negotiations.
- **No Reply Needed**: Informational notices, automated receipts, newsletters, and resolved threads.
- **Needs Review**: A review state triggered when AI confidence falls below configurable thresholds (< 0.75), preventing silent misclassification.

Both the full-featured **Assistant Workspace** and the simplified **Client Queue** operate on the same shared conversation data.

---

## 1. Visual Identity & Design System: Warm Swiss Minimalism

Relay implements an original **Warm Swiss Minimalism** aesthetic inspired by Josef Müller-Brockmann and Dieter Rams:
- **Selective Bento Grid Layouts** for rapid executive situational awareness.
- **Restrained Color Palette**:
  - Background: `#F6F5F0` (Warm eggshell paper)
  - Surface: `#FFFFFF` (Crisp cards & panes)
  - Primary / Forest Accent: `#354B3F`
  - Body Text / Charcoal: `#292D29`
  - Subtle Sage Surface: `#E9EDE6`
  - Muted Sage Accent: `#A8B39F`
  - Border Subtle: `#E5E3DC`
- **Functional Responsibility Colors**:
  - Assistant to Reply: Forest Green (`#354B3F`)
  - Client to Reply: Muted Amber (`#B57948`)
  - No Reply Needed: Neutral Grey (`#666A66`)
  - Needs Review: Muted Terracotta (`#B84A2A`)
- **Typography**:
  - Headings: `Manrope` (Geometric, confident, modern)
  - Interface & Body: `Inter` (Neutral, highly legible, dense tabular numbers)
- **Geometry**: Subtle 1px borders (`rgba(41, 43, 41, 0.09)`) rather than heavy drop-shadows; standard 10–14px corner radii; intentional whitespace.

---

## 2. Technology Stack

### Frontend
- **React 18** & **Vite**: Rapid hot module replacement and lightweight production bundle.
- **React Router 6**: Public landing page (`/`), client-side routing with nested layouts, workspace docking, and role-based views.
- **Custom CSS Design Tokens**: Pure CSS custom properties (`tokens.css`), eliminating UI library bloat while delivering authentic Swiss design.
- **Framer Motion**: Hardware-accelerated micro-interactions (150–200ms modals, filter switches, and list-to-detail transitions).
- **Lucide React**: Clean, minimalist outline iconography.

### Backend
- **Node.js 20+** & **Express.js**: RESTful service for session management, account synchronization, AI classification, summarization, reply drafting, and copilot query answering.
- **MongoDB Atlas & Mongoose 8**: Cloud-hosted persistence with structured Mongoose schemas (`User`, `Account`, `Conversation`), idempotent seeding (`$setOnInsert`), and connection lifecycle management.
- **Google Gemini API**: Server-side LLM integration (`gemini-3.8-flash` / `gemini-3.5-flash-lite`) with structured JSON schema outputs and multi-tier model failover.
- **High-Fidelity Deterministic Fallback**: Production-resilient fallback engine that operates seamlessly when external APIs are unreachable, ensuring deterministic evaluation and 100% demo uptime.
- **Resilient Fallback Storage**: Graceful in-memory fallback allowing isolated local test execution when offline.

---

## 3. Project Structure

```text
relay/
│
├── client/                              # Frontend Application (React + Vite)
│   ├── public/
│   │   └── relay-icon.svg               # Brand icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                  # Reusable Swiss design components (Badge, Button, Card, Input, Modal)
│   │   │   └── navigation/              # Simplified Sidebar (Primary & Workspace tools) & TopNav
│   │   ├── context/
│   │   │   ├── AuthContext.jsx          # Session state, demo roles, credentials
│   │   │   ├── AccountContext.jsx       # Connected mailboxes & sync triggers
│   │   │   └── ConversationContext.jsx  # Unified conversation state, filters, drafts, AI actions
│   │   ├── layouts/
│   │   │   ├── AppLayout.jsx            # Full-width edge-to-edge docking for email workspace
│   │   │   └── AuthLayout.jsx           # Warm minimal layout for login/onboarding
│   │   ├── pages/
│   │   │   ├── public/                  # Dedicated public marketing homepage at /
│   │   │   │   └── HomePage.jsx         # Hero, product preview, how it works, persona cards, demo modal
│   │   │   ├── auth/                    # Login, Signup, Onboarding screens
│   │   │   ├── assistant/               # Redesigned Overview Dashboard & AIAssistantPage (Copilot)
│   │   │   ├── client/                  # Dedicated Executive Workspace (/client) for Arjun Mehta
│   │   │   │   ├── components/          # AttentionQueueItem, DecisionDetailView, DelegationModal
│   │   │   │   └── ClientQueuePage.jsx  # Distraction-free executive decision desk
│   │   │   ├── inbox/                   # List-first Inbox Workspace & Focused Detail Reader
│   │   │   │   ├── components/          # List header with filter tabs, item card, reader header, action bar, triage card, summary card, thread view, reply composer
│   │   │   │   └── InboxPage.jsx        # List-first interaction with smooth back navigation (Esc)
│   │   │   └── settings/                # Connected Accounts management
│   │   ├── services/
│   │   │   └── api.js                   # Client REST service with offline localStorage fallback
│   │   ├── styles/
│   │   │   ├── tokens.css               # CSS Variables (palette, radii, typography)
│   │   │   └── global.css               # Resets, workspace mode, responsive styles
│   │   ├── App.jsx                      # Application router mapping /, 13 app segments, and /client
│   │   └── main.jsx                     # React DOM entry point
│   └── test/
│       └── invariants.test.js           # 25 automated UI invariant, routing, and component tests
│
├── server/                              # Backend API (Node.js + Express + Mongoose)
│   ├── config/
│   │   └── db.js                        # MongoDB Atlas connection manager & health checks
│   ├── models/                          # Mongoose ODM schemas
│   │   ├── User.model.js                # Users & demo persona credentials
│   │   ├── Account.model.js             # Connected email mailboxes & sync timestamps
│   │   └── Conversation.model.js        # Core conversation schema & nested messages
│   ├── controllers/                     # Route handlers (auth, accounts, conversations)
│   ├── routes/                          # REST route definitions (/api/conversations/*)
│   ├── services/
│   │   ├── gemini.service.js            # Official Google Gemini API client with fallback
│   │   ├── classification.service.js    # AI responsibility triage & structured extraction
│   │   ├── summary.service.js           # LLM-powered conversation summaries
│   │   ├── reply.service.js             # Contextual executive reply generator
│   │   ├── copilot.service.js           # Data-grounded mailbox Copilot
│   │   ├── seed.service.js              # Idempotent database seeder ($setOnInsert)
│   │   └── storage.service.js           # MongoDB persistence service with resilient fallback
│   ├── data/
│   │   └── seedData.js                  # 18 rich executive conversation seeds
│   ├── test/
│   │   └── api.test.js                  # 33 automated REST API, mock, AI & persistence tests
│   ├── app.js                           # Express application configuration
│   └── server.js                        # Server entry point
│
├── .gravitas/                           # Gravitas Engineering Reliability ledger & contracts
├── .env.example                         # Environment configuration template
├── package.json                         # Monorepo orchestration scripts
└── README.md                            # Project documentation & interview guide
```

---

## 4. How the AI Intelligence System Works (Milestone 3)

### A. Information Sent to the Model
When classifying a thread, generating a summary, or preparing a reply, the backend provides the complete conversational context:
1. **Thread Headers**: Subject, primary counterparty (name, email, role), recipients list, and CC list.
2. **Complete Chronological Message History**: Full message bodies and timestamps for all turns in the conversation.
3. **Operational Context**: Current stated action status and delegated assistant/client authority boundaries.

### B. Gemini API Integration & Configuration
- Set `GEMINI_API_KEY` in `server/.env` (or root `.env`) to enable live LLM requests.
- Configurable model via `GEMINI_MODEL` (defaults to `gemini-3.8-flash`).
- Uses official Google Gemini REST generation endpoints with `responseMimeType: "application/json"`.
- Requests include a strict 15-second timeout via `AbortController`.
- **Zero API Keys in Frontend**: API keys remain strictly server-side.

### C. Graceful Deterministic Demonstration Fallback
If `GEMINI_API_KEY` is not provided, or if the API returns a rate limit / network error:
- The backend activates the **Deterministic Executive Fallback Engine**.
- Evaluates full thread keywords, legal authority indicators, scheduling semantics, and ambiguity markers.
- Responses transparently indicate `aiSource: "deterministic-fallback"`, keeping the demonstration 100% reliable during interviews without external dependency failures.

### D. Needs Review Protocol
- `Needs Review` is **not a 4th responsibility enum**; it is an independent review state (`needsReview: boolean`).
- Whenever the AI confidence score is below **0.75**, the thread is flagged with `needsReview: true`.
- The UI highlights the thread with an amber banner explaining why uncertainty exists (e.g. ambiguous delegation, mixed operational scheduling with high-stakes financial commitments) and invites assistant review.

### E. Human Override Protection
1. When an assistant manually changes responsibility in the action bar or triage card:
   - The decision is saved with `isManualOverride = true` and `manualDecision`.
   - The review state is resolved (`needsReview = false`).
2. **Preservation on Incoming Messages**:
   - When new messages arrive (via the demo interaction "Simulate reply"), the AI re-evaluates the entire thread.
   - If a manual override is active, the system **never silently overwrites** the human decision.
   - Instead, the AI's new assessment is stored separately as a `pendingSuggestion`.
   - A dedicated banner prompts the assistant: *"AI Re-evaluation: New message suggests assigning to Client to Reply. Manual override currently active."*
   - The assistant can either click **[Accept Suggestion]** or **[Keep Manual Override]**.

### F. AI-Powered Conversation Summaries
- Evaluates the thread and generates a structured summary card right inside the reader:
  - **Core Overview**: 2–3 sentence executive synopsis.
  - **Latest Developments**: What occurred in the most recent messages.
  - **Key Decisions**: Formal commitments or agreements reached.
  - **Pending Questions**: Questions requiring counterparty or client response.
  - **Deadlines & Constraints**: Explicit time constraints extracted from text.
  - **Recommended Action**: Clear immediate next step.

### G. AI Reply Generator
- Supports 4 distinct executive reply intents:
  - **Confirm**: Polite confirmation and scheduling acknowledgement.
  - **Request Details**: Professional request for missing deliverables or timelines.
  - **Approve**: Formal executive approval on behalf of client.
  - **Reschedule**: Proposes alternative calendar slots.
- Loads directly into the draft composer with a human review notice: *"AI Draft Generated: Human review required before simulated send."*
- Allows immediate editing, saving, or simulated sending (never auto-dispatched).

### H. Relay Executive Copilot (`/app/ai-assistant`)
An interactive email copilot grounded in actual mailbox data. Supports:
- *"Show me emails that need my attention"* → returns action-required / assistant threads.
- *"What am I waiting for a response on?"* → returns threads awaiting counterparty replies.
- *"Which emails require the client's attention?"* → returns high-priority client approval threads.
- *"Show scheduled meetings and calendar dates"* → returns scheduling threads with dates.
- Interactive cards allow the assistant to click any referenced thread and jump directly into the reading workspace.

---

## 5. Setup & Execution

### Prerequisites
- Node.js v20+
- npm v10+

### Installation
```bash
npm --prefix client install
npm --prefix server install
npm install
```

### Running in Development
```bash
# Terminal 1: Backend Server (port 5000)
npm run server:start

# Terminal 2: Frontend Client (port 3000)
npm run client:dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuring MongoDB Atlas & Gemini API
To run with live MongoDB Atlas persistence and live Gemini inference:
1. Configure `server/.env`:
```env
MONGODB_URI=mongodb+srv://relay_app_user:<db_password>@cluster0.xzqxzjs.mongodb.net/relay?retryWrites=true&w=majority&appName=Cluster0
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
```
2. Restart the backend server. The database seeder will automatically initialize records using idempotent `$setOnInsert` operations without duplicating on restart.
*(If MONGODB_URI is omitted, Relay runs on resilient local fallback storage; if GEMINI_API_KEY is omitted, Relay runs on the deterministic executive AI fallback).*

### Running Automated Test Suites
```bash
# Run server test suite (33 tests covering REST, AI classification, overrides, summaries, copilot, client queue, persistence & idempotent seeding)
npm --prefix server test

# Run client invariant test suite (25 tests covering landing page, simplified sidebar, responsibility filter tabs, list-first inbox, AI triage, 3D interactions, and client actions)
npm --prefix client test

# Run client production build
npm --prefix client run build
```

---

## 6. Pre-Submission UX Refinement & Visual Redesign

To ensure the prototype immediately stands out as an intentional, production-grade application rather than a generic AI interface, a comprehensive Unslop visual pass and UX restructuring was applied:

### A. Dedicated Public Marketing Homepage (`/`)
- Unauthenticated visitors land directly on a public homepage rather than being bounced to a login form.
- **Header**: Relay mark, product anchors (*Product*, *How it works*, *For Assistants & Clients*), and direct demo entry buttons.
- **Hero & Approved Copy**: *"Every conversation. The right person to respond."* with concise value proposition and primary CTAs.
- **Realistic Relay Preview Mockup**: Displays authentic executive threads across all three core categories (*Board Resolution: Series B Written Consent* — Client to Reply; *Bengaluru Tech Summit: Suite & Transfers* — Assistant to Reply; *The Ken Executive Brief* — No Reply Needed) with AI reasoning and routing cards.
- **Dual Persona Guide**: Explains the distinct high-leverage workflows for Executive Assistants and Clients.
- **One-Click Demo Launcher Modal**: Instantaneous authentication as Ananya Sharma (Assistant) or Arjun Mehta (Client).

### B. Simplified Information Architecture
- The sidebar was streamlined from a cluttered list into two focused groupings:
  - **Primary**: Overview (`/app/overview`), Inbox (`/app/inbox`), Needs Attention (`/app/action-required`), Waiting (`/app/waiting`), Meetings (`/app/meetings`), Important (`/app/important`).
  - **Workspace Tools**: AI Assistant (`/app/ai-assistant`), Archived (`/app/archive`), Connected Accounts (`/app/accounts`), Settings (`/app/settings`), Website Home (`/`).
- Responsibility classifications are elevated into intuitive filter tabs within the Inbox list header (`All`, `Assistant to Reply`, `Client to Reply`, `No Reply Needed`, `Needs Review`), keeping the sidebar clean while preserving deep-linking capabilities.

### C. List-First Inbox Workflow
- Eliminates the visual overwhelm of three narrow columns squashed side-by-side.
- **Desktop & Mobile**: Spacious, full-width conversation list first.
- Selecting any conversation smoothly transitions into a dedicated, focused single-conversation detail view.
- Prominent `← Back to Inbox` navigation bar with keyboard shortcut hint (`Esc` returns directly to the list).
- Detail view retains full message history, AI summary, AI responsibility triage card, action bar, and AI reply composer.

### D. Redesigned Assistant Dashboard ("What needs attention today?")
- Replaces generic stat counters with a prioritized, calm executive layout:
  1. **Client Decisions**: High-stakes approvals awaiting Arjun.
  2. **Assistant Actions**: Drafting, travel, and logistics tasks for Ananya.
  3. **Waiting for Reply**: Outgoing emails awaiting counterparty response.
  4. **Upcoming Meetings**: Time-sensitive executive engagements.
- **Today's Action Queue**: Prioritized list of unhandled conversations with semantic left-border color coding.
- **Client Queue Rail**: Direct glance at Arjun Mehta's pending items with one-click navigation to Arjun's decision desk.

---

## 7. Client Experience & Shared Workflows (Milestone 4)

### A. Minimalist Executive Workspace (`/client`)
- Dedicated, distraction-free environment tailored for Arjun Mehta (`role: 'client'`).
- Displays a warm personal greeting, outstanding attention count, and only conversations where `responsibility === 'client'` and `actionStatus !== 'completed' && actionStatus !== 'resolved'`.
- Cards clearly display counterparty details, subject, timestamps, short AI summary, and the explicit `clientAttentionReason` callout (e.g. statutory written consent, advisory term sign-off).
- Full original message history reader with sender details, recipients, and chronological dialogue.

### B. Two Prominent Executive Actions
1. **Mark as Handled**:
   - Primary action button.
   - Sets `actionStatus = 'completed'`, preserves `responsibility = 'client'`, and sets `handledBy = 'client'`.
   - Removes conversation from Arjun's attention queue and updates Ananya's dashboard with completed status.
2. **Ask Assistant to Take Over**:
   - Secondary action button with delegation popover/modal.
   - Allows optional custom directives (e.g. "Ananya, please draft standard counter-terms...").
   - Sets `responsibility = 'assistant'`, `isManualOverride = true`, `delegatedBy = 'client'`, `actionStatus = 'action_required'`, and confidence to 1.0.
   - Immediately transfers the conversation to Ananya's priority action queue and decrements Arjun's pending count.

### C. Shared Data Architecture & Role Switching
- Both workspaces operate on unified conversation records in `ConversationContext` and backend storage.
- TopNav integrates a "Client View" button navigating directly to `/client`.
- Profile menu enables instantaneous switching between Ananya Sharma (Assistant) and Arjun Mehta (Client).

---

## 8. Technical Interview Architecture Checklist

| Design Decision | Explanation for Technical Interview |
|---|---|
| **Why is Needs Review not a 4th responsibility?** | Mixing triage classification (`assistant`, `client`, `none`) with review status creates semantic ambiguity. An email is inherently something the client or assistant should handle; low confidence merely means the AI is unsure of which one. Keeping `needsReview: boolean` allows the model to propose its best guess while flagging that human verification is needed. |
| **How are human overrides protected from being overwritten by new messages?** | In `server/services/storage.service.js`, manual changes flag `isManualOverride: true`. When new messages enter the conversation (via webhook or incoming message simulation), the AI classification is re-run. If `isManualOverride` is true, the current responsibility remains locked, and the new AI assessment is queued as `pendingSuggestion` with clear Accept / Dismiss options for the user. |
| **How does client delegation update the assistant workspace?** | In `storage.service.js`, `delegateToAssistant(id, notes)` modifies the single authoritative record (`responsibility = 'assistant'`, `isManualOverride = true`, `delegatedBy = 'client'`). Because `getCounts()` dynamically computes segment totals from this shared dataset, Ananya's `assistantReply` and `actionRequired` counts increment synchronously. |
| **How does the Copilot avoid hallucinations?** | The Copilot (`copilot.service.js`) queries the underlying `storage.service.js` database first. For list queries, it filters actual conversations using status flags and attaches those exact records. For summary queries, it feeds only the selected conversation's messages to the model. |
| **Why provide a deterministic fallback alongside Gemini?** | External LLM APIs can hit rate limits, network interruptions, or quota limits during evaluation demonstrations. The deterministic engine guarantees that the prototype works reliably out-of-the-box, providing a 100% dependable review experience. |

---

## 9. Milestone Roadmap

- [x] **Milestone 1**: Project foundation, Warm Swiss design system, authentication screens, simulated email onboarding, and assistant application shell.
- [x] **Milestone 2**: Three-pane conversation triage workspace, 18 seeded realistic conversations, search, and segmentation filters.
- [x] **Milestone 3**: Server-side Gemini API integration, structured responsibility classification, Needs Review state, human override protection, incoming message simulation, conversation summaries, entity extraction, AI reply drafting, and interactive Mailbox Copilot.
- [x] **Milestone 4**: Dedicated executive client workspace (`/client`), minimalist attention queue, Mark as Handled action, Ask Assistant to Take Over delegation modal, shared data synchronization, and responsive layouts.
- [x] **Pre-Submission UX Refinement**: Public marketing homepage (`/`) with realistic Relay preview, simplified information architecture in Sidebar, "List first, focused conversation detail second" inbox workflow, and redesigned dashboard centered on "What needs attention today?".
- [x] **Critical Bug Fixes & Premium UI/UX Polish**:
  - **Responsibility Filtering Engine**: Fixed bidirectional effect loop between URL search parameters and context state in `InboxPage.jsx`; synced `ConversationListHeader.jsx` tab buttons with `navigate('/app/inbox?segment=' + tabId, { replace: true })`; expanded `api.js` to handle `needs_review` fallback and compute live counts without page reloads.
  - **Interactive 3D Hero Stage**: Implemented CSS 3D perspective (`1200px`) and Framer Motion mouse-tracking dynamic tilt (`rotateX`, `rotateY`) on `/`, featuring floating telemetry bridge and layered priority cards (Governance, Logistics, Informational).
  - **Framer Motion Active Tab Pill**: Added shared layout animation (`layoutId="activeRespTabIndicator"`) for smooth sliding transitions between responsibility filter categories.
  - **Color Palette Refinement**: Upgraded tokens to refined Warm Swiss standards (`#F6F5F0` background, `#354B3F` forest accent, `#292D29` charcoal, `#E9EDE6` pale sage, `#A8B39F` muted sage, `#B57948` amber, `#E5E3DC` subtle borders).
  - **Full Automated Verification**: 29/29 server API tests passing, 25/25 client invariant tests passing, clean Vite production build.
- [ ] **Milestone 5**: Final IMAP/SMTP live mail synchronization.
