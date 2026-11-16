const now = Date.now();
const minutesAgo = (m) => new Date(now - m * 60 * 1000).toISOString();
const hoursAgo = (h) => new Date(now - h * 3600 * 1000).toISOString();
const daysAgo = (d) => new Date(now - d * 86400 * 1000).toISOString();

export const fallbackConversations = [
  {
    id: 'conv_01',
    accountId: 'acc_gmail_01',
    subject: 'Board Resolution: Series B Shareholder Written Consent',
    preview: 'Arjun, please review and provide your formal approval on Section 4 before the end of the day.',
    sender: {
      name: 'Vikram Singhania',
      email: 'vikram.singhania@singhania-ventures.in',
      role: 'Board Chairman',
      avatar: 'VS'
    },
    recipients: ['arjun.mehta@mehtaventures.in'],
    cc: ['legal@mehtaventures.in', 'ananya.sharma@relay-assistant.in'],
    responsibility: 'client',
    confidenceScore: 0.98,
    aiReasoning: 'Formal corporate governance action requiring statutory written consent and managing partner signature from Arjun Mehta.',
    category: 'approvals',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: true,
    isArchived: false,
    lastMessageAt: hoursAgo(2),
    messages: [
      {
        id: 'msg_01_01',
        sender: { name: 'Vikram Singhania', email: 'vikram.singhania@singhania-ventures.in' },
        timestamp: hoursAgo(5),
        body: `Arjun,\n\nFollowing our special board session yesterday, Shardul Amarchand Mangaldas has finalized the Series B shareholder consent package.\n\nSection 4 outlines the pro-rata allocation rights and protective provisions requested by the lead syndicate. The legal team has signed off on the covenants.\n\nPlease review the attached execution agreement and provide your formal written signature by 5:00 PM IST so we can proceed with closing escrow.\n\nBest regards,\nVikram Singhania\nChairman of the Board | Singhania Ventures`
      },
      {
        id: 'msg_01_02',
        sender: { name: 'Vikram Singhania', email: 'vikram.singhania@singhania-ventures.in' },
        timestamp: hoursAgo(2),
        body: `Arjun — quick reminder on this. Wire authorizations depend on the Section 4 signature page. Let me know once signed or if you want a 5-minute call.`
      }
    ]
  },
  {
    id: 'conv_02',
    accountId: 'acc_gmail_01',
    subject: 'Bengaluru Tech Summit: Executive Suite & Airport Transfers',
    preview: 'Hi Ananya, could you confirm Mr. Mehta’s preferred hotel arrival window for next Wednesday?',
    sender: {
      name: 'Pooja Kulkarni',
      email: 'pooja.kulkarni@techsummit-blr.in',
      role: 'Venture Summit Coordinator',
      avatar: 'PK'
    },
    recipients: ['ananya.sharma@relay-assistant.in', 'arjun.mehta@mehtaventures.in'],
    cc: ['concierge@theleela-palace.in'],
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
        sender: { name: 'Pooja Kulkarni', email: 'pooja.kulkarni@techsummit-blr.in' },
        timestamp: hoursAgo(4),
        body: `Dear Ananya and Arjun,\n\nWe are thrilled to welcome Mr. Mehta as a keynote speaker at the Bengaluru Tech Summit next week at Bangalore International Exhibition Centre (BIEC).\n\nWe have reserved a Deluxe Executive Suite at The Leela Palace Bengaluru for the nights of November 18–20. Could you please confirm:\n1. His anticipated landing time at Kempegowda International Airport (BLR T2) for the private chauffeur transfer.\n2. Any dietary requirements for the VIP Speaker Dinner on Wednesday evening.\n\nLooking forward to your details so we can lock in the chauffeur schedule.\n\nWarm regards,\nPooja Kulkarni\nSpeaker Operations | Bengaluru Tech Summit`
      }
    ],
    draft: {
      body: 'Hi Pooja,\n\nMr. Mehta is scheduled to touch down at BLR at 14:15 on Wednesday via private charter. Chauffeur pickup at the General Aviation terminal will be perfect.\n\nRegarding the VIP dinner: pure vegetarian, no restrictions. Thank you for coordinating!\n\nBest,\nAnanya',
      updatedAt: minutesAgo(30)
    }
  },
  {
    id: 'conv_03',
    accountId: 'acc_outlook_01',
    subject: 'Q3 Advisory Retainer: Proposed Term Revisions',
    preview: 'Attached is the revised engagement agreement reflecting the discussed partner cap adjustments.',
    sender: {
      name: 'Rajesh Iyer',
      email: 'r.iyer@cam-advisory.in',
      role: 'Partner, Tax & Corporate Structuring',
      avatar: 'RI'
    },
    recipients: ['arjun.mehta@board-advisory.in'],
    cc: ['counsel@mehtaventures.in'],
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
        sender: { name: 'Rajesh Iyer', email: 'r.iyer@cam-advisory.in' },
        timestamp: daysAgo(1),
        body: `Arjun,\n\nFollowing our call on Friday regarding the restructuring of your domestic holding entities, I have updated Section 7.2 of our advisory retainer.\n\nKey changes:\n- Monthly fixed retainer cap adjusted to ₹18,50,000 inclusive of cross-border transfer pricing analysis.\n- Partner hourly billing discounted by 18% across the Mumbai and New Delhi teams.\n- Term duration aligned to December 31, 2027.\n\nPlease let me know if these terms meet your approval so we can countersign.\n\nRajesh Iyer | Partner\nCyril Amarchand Mangaldas`
      }
    ]
  },
  {
    id: 'conv_04',
    accountId: 'acc_gmail_01',
    subject: 'Confirmation: Executive Private Dining Room (8 Guests)',
    preview: 'We have reserved the Sea Lounge Private Suite for Thursday evening. Kindly confirm final dietary restrictions.',
    sender: {
      name: 'The Taj Mahal Palace, Mumbai',
      email: 'reservations@tajhotels-mumbai.in',
      role: 'Private Dining Concierge',
      avatar: 'TM'
    },
    recipients: ['ananya.sharma@relay-assistant.in'],
    cc: ['arjun.mehta@mehtaventures.in'],
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
        sender: { name: 'The Taj Mahal Palace, Mumbai', email: 'reservations@tajhotels-mumbai.in' },
        timestamp: hoursAgo(6),
        body: `Dear Ms. Sharma,\n\nWe are delighted to confirm the reservation for Mr. Arjun Mehta and his guests:\n\nDate: Thursday, November 19\nTime: 19:30 for 20:00 dinner\nRoom: The Sea Lounge Private Suite (8 guests)\nMenu: Bespoke 5-course coastal tasting menu with cellar pairings\n\nPlease confirm by tomorrow afternoon if any guests have food allergies or specific beverage preferences upon arrival.\n\nKindest regards,\nPrivate Dining Team | The Taj Mahal Palace, Colaba, Mumbai`
      }
    ]
  },
  {
    id: 'conv_05',
    accountId: 'acc_gmail_01',
    subject: 'Stealth Spinout IP Licensing & Co-Investment Strategy',
    preview: 'Arjun, could we meet for a private 30-min briefing before the term sheet is submitted to the syndicate?',
    sender: {
      name: 'Dr. Arvind Rao',
      email: 'arvind.rao@biopulse-therapeutics.in',
      role: 'Chief Scientific Officer',
      avatar: 'AR'
    },
    recipients: ['arjun.mehta@mehtaventures.in'],
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
        sender: { name: 'Dr. Arvind Rao', email: 'arvind.rao@biopulse-therapeutics.in' },
        timestamp: hoursAgo(8),
        body: `Arjun,\n\nOur spinout IP discussions with IIT Bombay Research Park have reached an inflection point. The institute agreed to drop the trailing royalty from 4% to 1.5% in exchange for a 2% non-dilutable equity block.\n\nBefore I present this to the co-investors, I need your strategic view on whether Mehta Ventures wants to anchor the ₹45 Crore pre-seed round or syndicate it out.\n\nCan we grab 20 minutes one-on-one tomorrow?\n\nArvind`
      }
    ]
  },
  {
    id: 'conv_06',
    accountId: 'acc_outlook_01',
    subject: 'Quarterly Portfolio Review & Fund III LP Advisory Meeting',
    preview: 'Karan proposing next Tuesday 2 PM or Thursday 10 AM for the quarterly LP briefing.',
    sender: {
      name: 'Karan Merchant',
      email: 'k.merchant@malabar-cap.in',
      role: 'Managing Partner, Malabar Capital',
      avatar: 'KM'
    },
    recipients: ['arjun.mehta@board-advisory.in'],
    cc: ['ananya.sharma@relay-assistant.in'],
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
        sender: { name: 'Karan Merchant', email: 'k.merchant@malabar-cap.in' },
        timestamp: hoursAgo(10),
        body: `Arjun,\n\nWe are setting the schedule for the Q4 LP Advisory Committee meeting. We have 60 minutes of materials covering Fund III deployment and mark-to-market valuations.\n\nWould either of the following slots suit Ananya and you:\n- Tuesday, Nov 24 @ 14:00 IST (Google Meet)\n- Thursday, Nov 26 @ 10:00 IST (BKC Boardroom, Mumbai)\n\nLet Ananya know to sync with my executive assistant Divya.\n\nBest,\nKaran`
      }
    ]
  },
  {
    id: 'conv_07',
    accountId: 'acc_gmail_01',
    subject: 'Razorpay Invoice #INV-2026-8841 Paid Successfully',
    preview: 'Your receipt for payment of ₹1,84,000.00 to Mehta Ventures Cloud Services is ready for download.',
    sender: {
      name: 'Razorpay Billing',
      email: 'invoices@razorpay.com',
      role: 'Payment Gateway',
      avatar: 'RB'
    },
    recipients: ['arjun.mehta@mehtaventures.in'],
    cc: ['accounts@mehtaventures.in'],
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
        sender: { name: 'Razorpay Billing', email: 'invoices@razorpay.com' },
        timestamp: hoursAgo(14),
        body: `Invoice INV-2026-8841\n\nAmount paid: ₹1,84,000.00 INR\nPayment method: HDFC Corporate NetBanking (ref #9042)\nDate: November 15, 2026\n\nThis invoice has been reconciled with your accounting system via Relay webhook integration.`
      }
    ]
  },
  {
    id: 'conv_08',
    accountId: 'acc_gmail_01',
    subject: 'Executive Brief: India DeepTech & Autonomous AI Infrastructure',
    preview: 'Weekly strategic analysis: How tier-one venture funds are navigating the ₹10,000 Crore IndiaAI Mission.',
    sender: {
      name: 'The Ken Executive Brief',
      email: 'briefs@theken-dispatch.in',
      role: 'Industry Newsletter',
      avatar: 'KB'
    },
    recipients: ['arjun.mehta@mehtaventures.in'],
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
        sender: { name: 'The Ken Executive Brief', email: 'briefs@theken-dispatch.in' },
        timestamp: hoursAgo(18),
        body: `Good morning,\n\nIn today's edition:\n1. IndiaAI Mission commits ₹10,000 Crore compute procurement for sovereign AI clusters.\n2. Autonomous agentic systems emerge across enterprise fintech and legal tech.\n3. Analysis of late-stage deeptech funding rounds in Bengaluru and Hyderabad.`
      }
    ]
  },
  {
    id: 'conv_09',
    accountId: 'acc_gmail_01',
    subject: 'Candidate Shortlist: Principal Systems Architect (3 Finalists)',
    preview: 'Ritu Nair attached dossiers for 3 shortlisted engineering leaders ready for interview loops.',
    sender: {
      name: 'Ritu Nair',
      email: 'ritu.nair@nativesearch.in',
      role: 'VP of Talent, Native Search India',
      avatar: 'RN'
    },
    recipients: ['ananya.sharma@relay-assistant.in', 'arjun.mehta@mehtaventures.in'],
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
        sender: { name: 'Ritu Nair', email: 'ritu.nair@nativesearch.in' },
        timestamp: daysAgo(1),
        body: `Hi Ananya & Arjun,\n\nWe have completed initial technical screens for the Principal Systems Architect role. Three candidates stood out:\n1. Dr. Siddharth Varma (ex-Google Research, Distributed Systems lead)\n2. Neha Kulkarni (Staff Infra Architect, Razorpay)\n3. Aditya Menon (Principal Systems Engineer, BrowserStack)\n\nAttached are candidate scorecards and salary expectations. Ananya, could you coordinate 45-minute technical conversations for late next week?\n\nBest,\nRitu`
      }
    ]
  },
  {
    id: 'conv_10',
    accountId: 'acc_outlook_01',
    subject: 'Personal Invitation: IIT Bombay Foundation Leadership Dinner & Keynote',
    preview: 'Prof. Devendra Shastri requesting Arjun’s presence as distinguished alumnus and keynote guest.',
    sender: {
      name: 'Prof. Devendra Shastri',
      email: 'd.shastri@alumni-iitb.ac.in',
      role: 'Dean of Alumni & International Relations, IIT Bombay',
      avatar: 'DS'
    },
    recipients: ['arjun.mehta@board-advisory.in'],
    cc: [],
    responsibility: 'client',
    confidenceScore: 0.95,
    aiReasoning: 'High-level personal relationship and institutional philanthropic commitment requiring Arjun Mehta’s personal consideration.',
    category: 'personal_decision',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: true,
    isArchived: false,
    lastMessageAt: daysAgo(1),
    messages: [
      {
        id: 'msg_10_01',
        sender: { name: 'Prof. Devendra Shastri', email: 'd.shastri@alumni-iitb.ac.in' },
        timestamp: daysAgo(1),
        body: `My dear Arjun,\n\nI hope this finds you in excellent spirits.\n\nThe Director and I would be deeply honoured if you would agree to join us at the Powai campus for our annual Foundation Leadership Dinner on Saturday, December 12th.\n\nGiven your visionary leadership at Mehta Ventures and your recent endowment support for the Centre for AI Research, we would be delighted if you could deliver a 15-minute keynote address to our graduating scholars.\n\nPlease let me know if we may look forward to hosting you.\n\nWarm regards,\nProf. Devendra Shastri`
      }
    ]
  },
  {
    id: 'conv_11',
    accountId: 'acc_gmail_01',
    subject: 'AWS Maintenance: Scheduled Aurora PostgreSQL Patching (ap-south-1 Mumbai)',
    preview: 'Maintenance window scheduled for Sunday, November 22 between 02:00 and 04:00 IST.',
    sender: {
      name: 'Amazon Web Services',
      email: 'no-reply-aws@amazon.com',
      role: 'Cloud Provider',
      avatar: 'AW'
    },
    recipients: ['arjun.mehta@mehtaventures.in'],
    cc: ['devops@mehtaventures.in'],
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
        body: `Hello AWS Customer,\n\nYour Amazon Aurora PostgreSQL DB clusters in region ap-south-1 (Mumbai) are scheduled for zero-downtime minor version maintenance on Sunday, November 22, 2026.\n\nNo action is required on your part unless you wish to modify the scheduled maintenance window.`
      }
    ]
  },
  {
    id: 'conv_12',
    accountId: 'acc_outlook_01',
    subject: 'Updated Custody Statement & Annual Audit Sign-Off',
    preview: 'Sunita Deshmukh requesting signed declaration for family trust custodial account balance.',
    sender: {
      name: 'Sunita Deshmukh',
      email: 'sunita.deshmukh@kotakprivate.in',
      role: 'Executive Director, Kotak Private Bank, Nariman Point',
      avatar: 'SD'
    },
    recipients: ['arjun.mehta@board-advisory.in'],
    cc: ['ananya.sharma@relay-assistant.in'],
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
        sender: { name: 'Sunita Deshmukh', email: 'sunita.deshmukh@kotakprivate.in' },
        timestamp: daysAgo(2),
        body: `Dear Mr. Mehta,\n\nIn preparation for the annual statutory audit of the Mehta Family Trust portfolio, our compliance department requires your countersignature on the attached Form B (Beneficial Ownership Declaration) and Custody Reconciliation Certificate as of October 31, 2026.\n\nKindly execute via Aadhaar eSign or return physically signed pages at your earliest convenience.\n\nBest regards,\nSunita Deshmukh | Executive Director\nKotak Mahindra Private Bank, Nariman Point, Mumbai`
      }
    ]
  },
  {
    id: 'conv_13',
    accountId: 'acc_gmail_01',
    subject: 'Office Lease Extension: BKC Headquarters Terms',
    preview: 'Tanvi detailing 3-year vs 5-year break clauses: "Should Ananya finalize or do you want to review?"',
    sender: {
      name: 'Tanvi Parekh',
      email: 'tanvi.parekh@mehtaventures.in',
      role: 'Operations Director, Mehta Ventures',
      avatar: 'TP'
    },
    recipients: ['arjun.mehta@mehtaventures.in'],
    cc: ['ananya.sharma@relay-assistant.in'],
    responsibility: 'review',
    confidenceScore: 0.62,
    aiReasoning: 'Low confidence (62%): The email requests strategic commercial lease approval from Arjun but also mentions Ananya handling administrative execution. Needs human review to assign.',
    category: 'low_confidence',
    actionStatus: 'action_required',
    isImportant: true,
    isUnread: true,
    isArchived: false,
    lastMessageAt: daysAgo(2),
    messages: [
      {
        id: 'msg_13_01',
        sender: { name: 'Tanvi Parekh', email: 'tanvi.parekh@mehtaventures.in' },
        timestamp: daysAgo(3),
        body: `Arjun & Ananya,\n\nThe landlord for Maker Maxity, Bandra Kurla Complex (BKC) sent over the revised lease extension terms.\n\nOption A gives us a 3-year term with a 10% rent bump, while Option B locks in 5 years with fixed escalation and a 3-month fit-out credit period.\n\nShould Ananya finalize the paperwork under Option B, or do you want to review the commercial lock-in terms first?`
      },
      {
        id: 'msg_13_02',
        sender: { name: 'Ananya Sharma', email: 'ananya.sharma@relay-assistant.in' },
        timestamp: daysAgo(2),
        body: `Tanvi, I reviewed the drafts and flagged the lock-in clause on page 8. Waiting for Arjun to confirm whether he prefers 3-year flexibility or the 5-year discount.`
      }
    ]
  },
  {
    id: 'conv_14',
    accountId: 'acc_gmail_01',
    subject: 'Re: Joint AI Diagnostics Whitepaper Submission',
    preview: 'Dr. Harish acknowledged feedback on Section 3 and promised revised Indian ICMR cohort figures by Friday.',
    sender: {
      name: 'Dr. Harish Venkatraman',
      email: 'harish.v@aiims.edu.in',
      role: 'AIIMS New Delhi / IISc Bengaluru',
      avatar: 'HV'
    },
    recipients: ['ananya.sharma@relay-assistant.in', 'arjun.mehta@mehtaventures.in'],
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
        sender: { name: 'Ananya Sharma', email: 'ananya.sharma@relay-assistant.in' },
        timestamp: daysAgo(4),
        body: `Dear Dr. Venkatraman,\n\nMr. Mehta reviewed the manuscript and suggested refining the patient privacy safeguards and Indian clinical data norms in Section 3.2. Please let us know when the updated charts are ready.`
      },
      {
        id: 'msg_14_02',
        sender: { name: 'Dr. Harish Venkatraman', email: 'harish.v@aiims.edu.in' },
        timestamp: daysAgo(3),
        body: `Hi Ananya,\n\nThank you for Arjun's sharp feedback. We are re-running the validation cohort with the ICMR clinical trial dataset.\n\nI will send the revised figures and supplementary tables by Friday 17:00 IST.\n\nKind regards,\nDr. Harish Venkatraman`
      }
    ]
  },
  {
    id: 'conv_15',
    accountId: 'acc_gmail_01',
    subject: 'Club Vistara Tier Status Upgrade: Platinum Elite',
    preview: 'Congratulations Mr. Mehta, your Club Vistara tier points qualify you for Platinum Elite privileges.',
    sender: {
      name: 'Club Vistara Priority',
      email: 'priority@airvistara.com',
      role: 'Airline Loyalty Service',
      avatar: 'CV'
    },
    recipients: ['arjun.mehta@mehtaventures.in'],
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
        sender: { name: 'Club Vistara Priority', email: 'priority@airvistara.com' },
        timestamp: daysAgo(4),
        body: `Dear Mr. Mehta,\n\nWe are delighted to confirm that your flight activity in the current membership year has unlocked Club Vistara Platinum Elite status.\n\nEnjoy dedicated relationship desk support, complimentary upgrade vouchers, Maharaja Lounge access at Mumbai T2 and Delhi T3, and partner privileges across the Singapore Airlines network.`
      }
    ]
  },
  {
    id: 'conv_16',
    accountId: 'acc_gmail_01',
    subject: 'Completed: October Executive Expense Reconciliation & Bank Approvals',
    preview: 'Sneha Joshi confirmed RTGS reconciliation complete and receipts archived.',
    sender: {
      name: 'Sneha Joshi',
      email: 'sneha.joshi@mehtaventures.in',
      role: 'Financial Controller, Mehta Ventures',
      avatar: 'SJ'
    },
    recipients: ['ananya.sharma@relay-assistant.in'],
    cc: ['arjun.mehta@mehtaventures.in'],
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
        sender: { name: 'Sneha Joshi', email: 'sneha.joshi@mehtaventures.in' },
        timestamp: daysAgo(6),
        body: `Hi Ananya,\n\nAll October receipts for Arjun's Bengaluru and New Delhi investor roadshows have been matched to corporate card statements. RTGS release of ₹14,20,000 has been executed.`
      },
      {
        id: 'msg_16_02',
        sender: { name: 'Ananya Sharma', email: 'ananya.sharma@relay-assistant.in' },
        timestamp: daysAgo(5),
        body: `Thank you Sneha! Marked as resolved on my end.`
      }
    ]
  },
  {
    id: 'conv_17',
    accountId: 'acc_outlook_01',
    subject: 'Private Viewing & Heritage Preview: Mumbai Art Gallery Gala',
    preview: 'Meera Sen invitation to private heritage preview previously declined by client.',
    sender: {
      name: 'Meera Sen',
      email: 'meera.sen@jehangir-art.in',
      role: 'Gallery Director, Kala Ghoda, Mumbai',
      avatar: 'MS'
    },
    recipients: ['arjun.mehta@board-advisory.in'],
    cc: [],
    responsibility: 'client',
    confidenceScore: 0.95,
    aiReasoning: 'Archived thread: Personal luxury preview invitation previously declined by Arjun Mehta.',
    category: 'personal_decision',
    actionStatus: 'completed',
    isImportant: false,
    isUnread: false,
    isArchived: true,
    lastMessageAt: daysAgo(8),
    messages: [
      {
        id: 'msg_17_01',
        sender: { name: 'Meera Sen', email: 'meera.sen@jehangir-art.in' },
        timestamp: daysAgo(9),
        body: `Dear Mr. Mehta,\n\nWe cordially invite you to an exclusive private retrospective viewing at the Jehangir Art Gallery in Kala Ghoda this December.`
      },
      {
        id: 'msg_17_02',
        sender: { name: 'Arjun Mehta', email: 'arjun.mehta@board-advisory.in' },
        timestamp: daysAgo(8),
        body: `Meera, thank you for thinking of me. Unfortunately my schedule in December is fully booked with board obligations. Wishing you a wonderful exhibition.`
      }
    ]
  },
  {
    id: 'conv_18',
    accountId: 'acc_gmail_01',
    subject: 'Charter Flight Quotation: Mumbai (BOM) to New Delhi (DEL)',
    preview: 'Club One Air Executive charter dispatch sending Falcon 2000 quote with 24-hr hold.',
    sender: {
      name: 'Club One Air Executive Charter',
      email: 'charter-desk@cluboneair.in',
      role: 'Aviation Dispatch',
      avatar: 'CA'
    },
    recipients: ['ananya.sharma@relay-assistant.in'],
    cc: ['arjun.mehta@mehtaventures.in'],
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
        sender: { name: 'Club One Air Executive Charter', email: 'charter-desk@cluboneair.in' },
        timestamp: hoursAgo(1),
        body: `Dear Ms. Sharma,\n\nPer your request earlier today, we have secured a 24-hour option on the Dassault Falcon 2000 (tail VT-COA):\n\nRouting: Chhatrapati Shivaji Maharaj International Airport (BOM GA Terminal) -> Indira Gandhi International Airport (DEL T3 VIP)\nDate: Wednesday, November 18\nDeparture: 13:00 IST (flexible +/- 1h)\nFlight Time: 1h 55m\nTotal all-inclusive charter fee: ₹12,45,000 INR\n\nPlease confirm by tomorrow 12:00 IST to finalize slot clearances with DGCA and AAI.\n\nBest regards,\nCharter Operations | Club One Air Executive Desk`
      }
    ]
  }
];
