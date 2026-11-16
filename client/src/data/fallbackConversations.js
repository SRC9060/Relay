const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();
const daysAgo = (d) => new Date(now - d * 86400 * 1000).toISOString();

export const fallbackConversations = [
  {
    id: 'conv_01',
    accountId: 'acc_gmail_01',
    subject: 'Board Resolution: Series B Shareholder Written Consent',
    preview: 'Marcus, please review and provide your formal approval on Section 4 before the end of the day.',
    sender: {
      name: 'David Sterling',
      email: 'd.sterling@sterling-ventures.com',
      role: 'Board Chairman',
      avatar: 'DS'
    },
    recipients: ['marcus.vance@vancetech.io'],
    cc: ['legal@vancetech.io', 'elena.rostova@relay-assistant.io'],
    responsibility: 'client',
    confidenceScore: 0.98,
    aiReasoning: 'Formal corporate governance action requiring statutory written consent and managing partner signature from Marcus Vance.',
    category: 'approvals',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: true,
    isArchived: false,
    lastMessageAt: hoursAgo(2),
    messages: [
      {
        id: 'msg_01_01',
        sender: { name: 'David Sterling', email: 'd.sterling@sterling-ventures.com' },
        timestamp: hoursAgo(5),
        body: `Marcus,\n\nFollowing our special board session yesterday, Latham & Watkins has finalized the Series B shareholder consent package.\n\nSection 4 outlines the pro-rata allocation rights and protective provisions requested by the lead syndicate. The legal team has signed off on the covenants.\n\nPlease review the attached execution agreement and provide your formal written signature by 5:00 PM EST so we can proceed with closing escrow.\n\nBest regards,\nDavid Sterling\nChairman of the Board | Sterling Ventures`
      },
      {
        id: 'msg_01_02',
        sender: { name: 'David Sterling', email: 'd.sterling@sterling-ventures.com' },
        timestamp: hoursAgo(2),
        body: `Marcus — quick reminder on this. Wire authorizations depend on the Section 4 signature page. Let me know once signed or if you want a 5-minute call.`
      }
    ]
  },
  {
    id: 'conv_02',
    accountId: 'acc_gmail_01',
    subject: 'London Technology Summit: Executive Suite & Transfers',
    preview: 'Hi Elena, could you confirm Mr. Vance’s preferred hotel arrival window for next Wednesday?',
    sender: {
      name: 'Clara Hayes',
      email: 'clara.hayes@summits-london.org',
      role: 'Venture Summit Coordinator',
      avatar: 'CH'
    },
    recipients: ['elena.rostova@relay-assistant.io', 'marcus.vance@vancetech.io'],
    cc: ['concierge@themayfair.com'],
    responsibility: 'assistant',
    confidenceScore: 0.95,
    aiReasoning: 'Operational travel logistics, executive chauffeur coordination, and hotel suite reservations fall squarely within executive assistant responsibilities.',
    category: 'scheduling',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: true,
    isArchived: false,
    lastMessageAt: hoursAgo(4),
    messages: [
      {
        id: 'msg_02_01',
        sender: { name: 'Clara Hayes', email: 'clara.hayes@summits-london.org' },
        timestamp: hoursAgo(4),
        body: `Dear Elena and Marcus,\n\nWe are thrilled to welcome Mr. Vance as a keynote speaker at the London Technology Summit next week at ExCeL London.\n\nWe have reserved a Deluxe Executive Suite at The Mayfair for the nights of November 18–20. Could you please confirm:\n1. His anticipated landing time at London City Airport (LCY) for the private car transfer.\n2. Any dietary requirements for the VIP Speaker Dinner on Wednesday evening.\n\nLooking forward to your details so we can lock in the chauffeur schedule.\n\nWarm regards,\nClara Hayes\nSpeaker Operations | London Tech Summit`
      }
    ],
    draft: {
      body: 'Hi Clara,\n\nMr. Vance is scheduled to touch down at LCY at 14:15 on Wednesday via private charter. Chauffeur pickup at Signature Flight Support terminal will be perfect.\n\nRegarding the VIP dinner: no dietary restrictions. Thank you for coordinating!\n\nBest,\nElena',
      updatedAt: minutesAgo(30)
    }
  },
  {
    id: 'conv_03',
    accountId: 'acc_outlook_01',
    subject: 'Q3 Advisory Retainer: Proposed Term Revisions',
    preview: 'Attached is the revised engagement agreement reflecting the discussed partner cap adjustments.',
    sender: {
      name: 'Julian Henderson',
      email: 'j.henderson@kpmg-advisory.co.uk',
      role: 'Partner, Tax & Corporate Structuring',
      avatar: 'JH'
    },
    recipients: ['m.vance@board-advisory.com'],
    cc: ['counsel@vancetech.io'],
    responsibility: 'client',
    confidenceScore: 0.94,
    aiReasoning: 'Legal retainer renegotiation involving financial commitments and partner liability caps requires direct client business approval.',
    category: 'approvals',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: false,
    isArchived: false,
    lastMessageAt: daysAgo(1),
    messages: [
      {
        id: 'msg_03_01',
        sender: { name: 'Julian Henderson', email: 'j.henderson@kpmg-advisory.co.uk' },
        timestamp: daysAgo(1),
        body: `Marcus,\n\nFollowing our call on Friday regarding the restructuring of your European holding entities, I have updated Section 7.2 of our advisory retainer.\n\nKey changes:\n- Monthly fixed retainer cap adjusted to £18,500 inclusive of cross-border transfer pricing analysis.\n- Partner hourly billing discounted by 18% across the London and Zurich teams.\n- Term duration aligned to December 31, 2027.\n\nPlease let me know if these terms meet your approval so we can countersign.\n\nJulian Henderson | Partner\nKPMG Advisory LLP`
      }
    ]
  },
  {
    id: 'conv_04',
    accountId: 'acc_gmail_01',
    subject: 'Confirmation: Executive Private Dining Room (8 Guests)',
    preview: 'We have reserved the Sommelier Room for Thursday evening. Kindly confirm final dietary restrictions.',
    sender: {
      name: 'The Connaught Hotel',
      email: 'reservations@the-connaught.co.uk',
      role: 'Private Dining Concierge',
      avatar: 'TC'
    },
    recipients: ['elena.rostova@relay-assistant.io'],
    cc: ['marcus.vance@vancetech.io'],
    responsibility: 'assistant',
    confidenceScore: 0.96,
    aiReasoning: 'Hospitality confirmation and dietary management for executive dinner suitable for assistant handling.',
    category: 'scheduling',
    actionStatus: 'action_required',
    isImportant: false,
    isUnread: false,
    isArchived: false,
    lastMessageAt: hoursAgo(6),
    messages: [
      {
        id: 'msg_04_01',
        sender: { name: 'The Connaught Hotel', email: 'reservations@the-connaught.co.uk' },
        timestamp: hoursAgo(6),
        body: `Dear Ms. Rostova,\n\nWe are delighted to confirm the reservation for Mr. Marcus Vance and his guests:\n\nDate: Thursday, November 19\nTime: 19:30 for 20:00 dinner\nRoom: The Sommelier Room (8 guests)\nMenu: Bespoke 5-course tasting menu with vintage pairings\n\nPlease confirm by tomorrow afternoon if any guests have food allergies or specific champagne preferences upon arrival.\n\nKindest regards,\nPrivate Dining Team | The Connaught, Mayfair`
      }
    ]
  },
  {
    id: 'conv_05',
    accountId: 'acc_gmail_01',
    subject: 'Stealth Spinout IP Licensing & Co-Investment Strategy',
    preview: 'Marcus, could we meet for a private 30-min briefing before the term sheet is submitted to the syndicate?',
    sender: {
      name: 'Dr. Aris Thorne',
      email: 'aris.thorne@biopulse-therapeutics.com',
      role: 'Chief Scientific Officer',
      avatar: 'AT'
    },
    recipients: ['marcus.vance@vancetech.io'],
    cc: [],
    responsibility: 'client',
    confidenceScore: 0.97,
    aiReasoning: 'Confidential commercial intellectual property negotiation and founding co-investment evaluation requiring principal discretion.',
    category: 'personal_decision',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: true,
    isArchived: false,
    lastMessageAt: hoursAgo(8),
    messages: [
      {
        id: 'msg_05_01',
        sender: { name: 'Dr. Aris Thorne', email: 'aris.thorne@biopulse-therapeutics.com' },
        timestamp: hoursAgo(8),
        body: `Marcus,\n\nOur spinout IP discussions with Cambridge Enterprise have reached an inflection point. The university agreed to drop the trailing royalty from 4% to 1.5% in exchange for a 2% non-dilutable equity block.\n\nBefore I present this to the co-investors, I need your strategic view on whether Vance Tech wants to anchor the £4.5M pre-seed round or syndicate it out.\n\nCan we grab 20 minutes one-on-one tomorrow?\n\nAris`
      }
    ]
  },
  {
    id: 'conv_06',
    accountId: 'acc_outlook_01',
    subject: 'Quarterly Portfolio Review & Fund III LP Advisory Meeting',
    preview: 'Julian proposing next Tuesday 2 PM or Thursday 10 AM for the quarterly LP briefing.',
    sender: {
      name: 'Julian Mercer',
      email: 'j.mercer@meridian-cap.com',
      role: 'Managing Partner, Meridian Capital',
      avatar: 'JM'
    },
    recipients: ['m.vance@board-advisory.com'],
    cc: ['elena.rostova@relay-assistant.io'],
    responsibility: 'assistant',
    confidenceScore: 0.93,
    aiReasoning: 'Calendar coordination and meeting availability polling across pre-proposed time slots handled by assistant.',
    category: 'meetings',
    actionStatus: 'action_required',
    isImportant: false,
    isUnread: false,
    isArchived: false,
    lastMessageAt: hoursAgo(10),
    messages: [
      {
        id: 'msg_06_01',
        sender: { name: 'Julian Mercer', email: 'j.mercer@meridian-cap.com' },
        timestamp: hoursAgo(10),
        body: `Marcus,\n\nWe are setting the schedule for the Q4 LP Advisory Committee meeting. We have 60 minutes of materials covering Fund III deployment and mark-to-market valuations.\n\nWould either of the following slots suit Elena and you:\n- Tuesday, Nov 24 @ 14:00 GMT (Zoom)\n- Thursday, Nov 26 @ 10:00 GMT (Meridian Mayfair Boardroom)\n\nLet Elena know to sync with my assistant Chloe.\n\nBest,\nJulian`
      }
    ]
  },
  {
    id: 'conv_07',
    accountId: 'acc_gmail_01',
    subject: 'Stripe Invoice #INV-2026-8841 Paid Successfully',
    preview: 'Your receipt for payment of $1,840.00 to Vance Tech Infrastructure is ready for download.',
    sender: {
      name: 'Stripe Billing',
      email: 'invoices@stripe.com',
      role: 'Payment Gateway',
      avatar: 'SB'
    },
    recipients: ['marcus.vance@vancetech.io'],
    cc: ['accounting@vancetech.io'],
    responsibility: 'none',
    confidenceScore: 0.99,
    aiReasoning: 'Automated financial receipt and notification. Ledger records updated automatically; no reply required.',
    category: 'notifications',
    actionStatus: 'none',
    isImportant: false,
    isUnread: false,
    isArchived: false,
    lastMessageAt: hoursAgo(14),
    messages: [
      {
        id: 'msg_07_01',
        sender: { name: 'Stripe Billing', email: 'invoices@stripe.com' },
        timestamp: hoursAgo(14),
        body: `Invoice INV-2026-8841\n\nAmount paid: $1,840.00 USD\nPayment method: Visa ending in 4092\nDate: November 15, 2026\n\nThis invoice has been reconciled with your accounting system via Relay webhook integration.`
      }
    ]
  },
  {
    id: 'conv_08',
    accountId: 'acc_gmail_01',
    subject: 'Executive Brief: Sovereign Wealth & Autonomous AI Infrastructure',
    preview: 'Weekly strategic analysis: How tier-one venture funds are structuring compute reserves for 2027.',
    sender: {
      name: 'The Information Brief',
      email: 'digest@theinformation.com',
      role: 'Industry Newsletter',
      avatar: 'IB'
    },
    recipients: ['marcus.vance@vancetech.io'],
    cc: [],
    responsibility: 'none',
    confidenceScore: 0.99,
    aiReasoning: 'Curated editorial newsletter without action items or inquiries.',
    category: 'newsletters',
    actionStatus: 'none',
    isImportant: false,
    isUnread: false,
    isArchived: false,
    lastMessageAt: hoursAgo(18),
    messages: [
      {
        id: 'msg_08_01',
        sender: { name: 'The Information Brief', email: 'digest@theinformation.com' },
        timestamp: hoursAgo(18),
        body: `Good morning,\n\nIn today's edition:\n1. Sovereign AI Funds commit $14B to private European data centres.\n2. Foundation models pivot to asynchronous agentic workflows.\n3. Market analysis of late-stage growth rounds in enterprise robotics.`
      }
    ]
  },
  {
    id: 'conv_09',
    accountId: 'acc_gmail_01',
    subject: 'Candidate Shortlist: Principal Systems Architect (3 Finalists)',
    preview: 'Rachel Adams attached dossiers for 3 shortlisted engineering leaders ready for interview loops.',
    sender: {
      name: 'Rachel Adams',
      email: 'rachel@apex-search.io',
      role: 'VP of Talent, Apex Executive Search',
      avatar: 'RA'
    },
    recipients: ['elena.rostova@relay-assistant.io', 'marcus.vance@vancetech.io'],
    cc: [],
    responsibility: 'assistant',
    confidenceScore: 0.91,
    aiReasoning: 'Candidate scheduling and recruitment coordination typically handled by executive assistant.',
    category: 'routine_admin',
    actionStatus: 'action_required',
    isImportant: false,
    isUnread: true,
    isArchived: false,
    lastMessageAt: daysAgo(1),
    messages: [
      {
        id: 'msg_09_01',
        sender: { name: 'Rachel Adams', email: 'rachel@apex-search.io' },
        timestamp: daysAgo(1),
        body: `Hi Elena & Marcus,\n\nWe have completed initial technical screens for the Principal Systems Architect role. Three candidates stood out:\n1. Dr. Soren Holm (ex-DeepMind, Distributed Systems lead)\n2. Mei-Ling Zhou (Staff Infra Architect, Stripe)\n3. Alistair Campbell (Principal Engineer, Cloudflare)\n\nAttached are candidate scorecards and salary expectations. Elena, could you coordinate 45-minute technical conversations for late next week?\n\nBest,\nRachel`
      }
    ]
  },
  {
    id: 'conv_10',
    accountId: 'acc_outlook_01',
    subject: 'Personal Invitation: Oxford Philanthropy Round Table & Chancellor Dinner',
    preview: 'Lord Sebastian Vane requesting Marcus’s presence as keynote guest for the climate endowment gala.',
    sender: {
      name: 'Lord Sebastian Vane',
      email: 's.vane@chancellor-oxford.ac.uk',
      role: 'Private Office of the Chancellor',
      avatar: 'SV'
    },
    recipients: ['m.vance@board-advisory.com'],
    cc: [],
    responsibility: 'client',
    confidenceScore: 0.95,
    aiReasoning: 'High-level personal relationship and philanthropic commitment requiring Marcus Vance’s personal consideration.',
    category: 'personal_decision',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: true,
    isArchived: false,
    lastMessageAt: daysAgo(1),
    messages: [
      {
        id: 'msg_10_01',
        sender: { name: 'Lord Sebastian Vane', email: 's.vane@chancellor-oxford.ac.uk' },
        timestamp: daysAgo(1),
        body: `My dear Marcus,\n\nI do hope this finds you in good health.\n\nThe Chancellor and I would be deeply honoured if you would agree to join us at Christ Church for our annual Philanthropic Leadership Dinner on Saturday, December 12th.\n\nGiven your groundbreaking work with Vance Tech and your recent foundation pledges in computational biology, we would be delighted if you could deliver a 15-minute toast to our incoming fellows.\n\nPlease let me know if we may anticipate the pleasure of your company.\n\nYours warmly,\nSebastian`
      }
    ]
  },
  {
    id: 'conv_11',
    accountId: 'acc_gmail_01',
    subject: 'AWS Maintenance: Scheduled Aurora PostgreSQL Patching (eu-west-1)',
    preview: 'Maintenance window scheduled for Sunday, November 22 between 02:00 and 04:00 UTC.',
    sender: {
      name: 'Amazon Web Services',
      email: 'no-reply-aws@amazon.com',
      role: 'Cloud Provider',
      avatar: 'AW'
    },
    recipients: ['marcus.vance@vancetech.io'],
    cc: ['devops@vancetech.io'],
    responsibility: 'none',
    confidenceScore: 0.99,
    aiReasoning: 'Routine automated cloud infrastructure notification. Operations team notified automatically; no reply needed.',
    category: 'notifications',
    actionStatus: 'none',
    isImportant: false,
    isUnread: false,
    isArchived: false,
    lastMessageAt: daysAgo(2),
    messages: [
      {
        id: 'msg_11_01',
        sender: { name: 'Amazon Web Services', email: 'no-reply-aws@amazon.com' },
        timestamp: daysAgo(2),
        body: `Hello AWS Customer,\n\nYour Amazon Aurora PostgreSQL DB clusters in region eu-west-1 are scheduled for zero-downtime minor version maintenance on Sunday, November 22, 2026.\n\nNo action is required on your part unless you wish to modify the scheduled maintenance window.`
      }
    ]
  },
  {
    id: 'conv_12',
    accountId: 'acc_outlook_01',
    subject: 'Updated Custody Statement & Annual Audit Sign-Off',
    preview: 'Sophie Martin requesting signed declaration for family office custodial account balance.',
    sender: {
      name: 'Sophie Martin',
      email: 's.martin@lombard-odier.ch',
      role: 'Senior Private Banker, Geneva',
      avatar: 'SM'
    },
    recipients: ['m.vance@board-advisory.com'],
    cc: ['elena.rostova@relay-assistant.io'],
    responsibility: 'client',
    confidenceScore: 0.98,
    aiReasoning: 'Statutory banking declaration and custodial audit sign-off legally mandate beneficial owner signature.',
    category: 'approvals',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: false,
    isArchived: false,
    lastMessageAt: daysAgo(2),
    messages: [
      {
        id: 'msg_12_01',
        sender: { name: 'Sophie Martin', email: 's.martin@lombard-odier.ch' },
        timestamp: daysAgo(2),
        body: `Dear Mr. Vance,\n\nIn preparation for the annual statutory audit of the Vance Family Trust portfolio, our compliance department requires your countersignature on the attached Form B (Beneficial Ownership Declaration) and Custody Reconciliation Certificate as of October 31, 2026.\n\nKindly execute the digital DocuSign envelope or return signed pages at your earliest convenience.\n\nBest regards,\nSophie Martin | Executive Director\nBanque Lombard Odier & Cie SA`
      }
    ]
  },
  {
    id: 'conv_13',
    accountId: 'acc_gmail_01',
    subject: 'Office Lease Extension: Mayfair Headquarters Terms',
    preview: 'Amara detailing 3-year vs 5-year break clauses: "Should Elena finalize or do you want to review?"',
    sender: {
      name: 'Amara Okafor',
      email: 'amara.okafor@vancetech.io',
      role: 'Operations Director, Vance Tech',
      avatar: 'AO'
    },
    recipients: ['marcus.vance@vancetech.io'],
    cc: ['elena.rostova@relay-assistant.io'],
    responsibility: 'review',
    confidenceScore: 0.62,
    aiReasoning: 'Low confidence (62%): The email requests strategic commercial lease approval from Marcus but also mentions Elena handling administrative execution. Needs human review to assign.',
    category: 'low_confidence',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: true,
    isArchived: false,
    lastMessageAt: daysAgo(2),
    messages: [
      {
        id: 'msg_13_01',
        sender: { name: 'Amara Okafor', email: 'amara.okafor@vancetech.io' },
        timestamp: daysAgo(3),
        body: `Marcus & Elena,\n\nThe landlord for 14 Berkeley Square sent over the revised lease extension heads of terms.\n\nOption A gives us a 3-year term with a 10% rent bump, while Option B locks in 5 years with fixed rates and a 2-month rent-free period.\n\nShould Elena finalize the paperwork under Option B, or do you want to review the break clauses first?`
      },
      {
        id: 'msg_13_02',
        sender: { name: 'Elena Rostova', email: 'elena.rostova@relay-assistant.io' },
        timestamp: daysAgo(2),
        body: `Amara, I reviewed the drafts and flagged the dilapidations clause on page 8. Waiting for Marcus to confirm whether he prefers 3-year flexibility or the 5-year discount.`
      }
    ]
  },
  {
    id: 'conv_14',
    accountId: 'acc_gmail_01',
    subject: 'Re: Joint AI Diagnostics Whitepaper Submission',
    preview: 'Henrik acknowledged feedback on Section 3 and promised revised mortality figures by Friday.',
    sender: {
      name: 'Dr. Henrik Lindqvist',
      email: 'henrik.lindqvist@ki.se',
      role: 'Karolinska Institute, Stockholm',
      avatar: 'HL'
    },
    recipients: ['elena.rostova@relay-assistant.io', 'marcus.vance@vancetech.io'],
    cc: [],
    responsibility: 'assistant',
    confidenceScore: 0.94,
    aiReasoning: 'Pending external follow-up: Assistant submitted comments, awaiting co-author revision promised by Friday.',
    category: 'follow_up',
    actionStatus: 'waiting',
    isImportant: false,
    isUnread: false,
    isArchived: false,
    lastMessageAt: daysAgo(3),
    messages: [
      {
        id: 'msg_14_01',
        sender: { name: 'Elena Rostova', email: 'elena.rostova@relay-assistant.io' },
        timestamp: daysAgo(4),
        body: `Dear Dr. Lindqvist,\n\nMr. Vance reviewed the manuscript and suggested refining the patient privacy safeguards in Section 3.2. Please let us know when the updated charts are ready.`
      },
      {
        id: 'msg_14_02',
        sender: { name: 'Dr. Henrik Lindqvist', email: 'henrik.lindqvist@ki.se' },
        timestamp: daysAgo(3),
        body: `Hi Elena,\n\nThank you for Marcus's sharp feedback. We are re-running the validation cohort with the privacy-preserving differential noise parameter.\n\nI will send the revised figures and supplementary tables by Friday 17:00 CET.\n\nKind regards,\nHenrik`
      }
    ]
  },
  {
    id: 'conv_15',
    accountId: 'acc_gmail_01',
    subject: 'Executive Club Tier Status Upgrade: Gold Guest List',
    preview: 'Congratulations Mr. Vance, your Executive Club tier points qualify you for Gold Guest List privileges.',
    sender: {
      name: 'British Airways Club',
      email: 'executiveclub@ba.com',
      role: 'Airline Loyalty Service',
      avatar: 'BA'
    },
    recipients: ['marcus.vance@vancetech.io'],
    cc: [],
    responsibility: 'none',
    confidenceScore: 0.99,
    aiReasoning: 'Transactional loyalty tier announcement. No response or action required.',
    category: 'notifications',
    actionStatus: 'none',
    isImportant: false,
    isUnread: false,
    isArchived: false,
    lastMessageAt: daysAgo(4),
    messages: [
      {
        id: 'msg_15_01',
        sender: { name: 'British Airways Club', email: 'executiveclub@ba.com' },
        timestamp: daysAgo(4),
        body: `Dear Mr. Vance,\n\nWe are delighted to confirm that your 5,000 Tier Points in the current membership year have unlocked Gold Guest List status.\n\nEnjoy dedicated team support, Concorde Room access in London Heathrow Terminal 5, and partner lounge privileges worldwide.`
      }
    ]
  },
  {
    id: 'conv_16',
    accountId: 'acc_gmail_01',
    subject: 'Completed: October Executive Expense Reconciliation & Wire Approvals',
    preview: 'Sarah Jenkins confirmed wire reconciliation complete and receipts archived.',
    sender: {
      name: 'Sarah Jenkins',
      email: 's.jenkins@vancetech.io',
      role: 'Financial Controller, Vance Tech',
      avatar: 'SJ'
    },
    recipients: ['elena.rostova@relay-assistant.io'],
    cc: ['marcus.vance@vancetech.io'],
    responsibility: 'assistant',
    confidenceScore: 0.96,
    aiReasoning: 'Completed administrative workflow: Expense report receipts filed and audit sign-off finalized.',
    category: 'completed',
    actionStatus: 'completed',
    isImportant: false,
    isUnread: false,
    isArchived: false,
    lastMessageAt: daysAgo(5),
    messages: [
      {
        id: 'msg_16_01',
        sender: { name: 'Sarah Jenkins', email: 's.jenkins@vancetech.io' },
        timestamp: daysAgo(6),
        body: `Hi Elena,\n\nAll October receipts for Marcus's San Francisco roadshow have been matched to credit card statements. Wire release of $14,200 has been executed.`
      },
      {
        id: 'msg_16_02',
        sender: { name: 'Elena Rostova', email: 'elena.rostova@relay-assistant.io' },
        timestamp: daysAgo(5),
        body: `Thank you Sarah! Marked as resolved on my end.`
      }
    ]
  },
  {
    id: 'conv_17',
    accountId: 'acc_outlook_01',
    subject: 'Private Viewing & Salon Preview: Geneva Watch Exhibition',
    preview: 'Victor Moreau invitation to private salon preview previously declined by client.',
    sender: {
      name: 'Victor Moreau',
      email: 'victor@moreau-horlogerie.ch',
      role: 'Salon Director, Geneva',
      avatar: 'VM'
    },
    recipients: ['m.vance@board-advisory.com'],
    cc: [],
    responsibility: 'client',
    confidenceScore: 0.95,
    aiReasoning: 'Archived thread: Personal luxury preview invitation previously declined by Marcus Vance.',
    category: 'personal_decision',
    actionStatus: 'completed',
    isImportant: false,
    isUnread: false,
    isArchived: true,
    lastMessageAt: daysAgo(8),
    messages: [
      {
        id: 'msg_17_01',
        sender: { name: 'Victor Moreau', email: 'victor@moreau-horlogerie.ch' },
        timestamp: daysAgo(9),
        body: `Cher Monsieur Vance,\n\nWe cordially invite you to a private retrospective salon in Geneva this December.`
      },
      {
        id: 'msg_17_02',
        sender: { name: 'Marcus Vance', email: 'm.vance@board-advisory.com' },
        timestamp: daysAgo(8),
        body: `Victor, thank you for thinking of me. Unfortunately my schedule in December is fully booked with board obligations. Wishing you a successful exhibition.`
      }
    ]
  },
  {
    id: 'conv_18',
    accountId: 'acc_gmail_01',
    subject: 'Charter Flight Quotation: Zurich (ZRH) to London (LCY)',
    preview: 'Lufthansa Executive charter dispatch sending Phenom 300 quote with 24-hr hold.',
    sender: {
      name: 'Lufthansa Private Jet',
      email: 'charter-desk@lufthansa-private.com',
      role: 'Aviation Dispatch',
      avatar: 'LP'
    },
    recipients: ['elena.rostova@relay-assistant.io'],
    cc: ['marcus.vance@vancetech.io'],
    responsibility: 'assistant',
    confidenceScore: 0.92,
    aiReasoning: 'Private aviation charter pricing comparison and slot hold requiring assistant confirmation.',
    category: 'scheduling',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: true,
    isArchived: false,
    lastMessageAt: hoursAgo(1),
    messages: [
      {
        id: 'msg_18_01',
        sender: { name: 'Lufthansa Private Jet', email: 'charter-desk@lufthansa-private.com' },
        timestamp: hoursAgo(1),
        body: `Dear Ms. Rostova,\n\nPer your request earlier today, we have secured a 24-hour option on the Embraer Phenom 300 (tail D-CSMC):\n\nRouting: Zurich Airport (ZRH) -> London City (LCY)\nDate: Wednesday, November 18\nDeparture: 13:00 local (flexible +/- 1h)\nFlight Time: 1h 35m\nTotal all-inclusive charter fee: €12,450 EUR\n\nPlease confirm by tomorrow 12:00 CET to release passenger manifest to UK Border Force.\n\nBest regards,\nCharter Operations | Lufthansa Private Desk`
      }
    ]
  }
];
