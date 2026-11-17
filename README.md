# Relay — AI Email Management Dashboard

Relay helps personal assistants and clients organise email conversations, understand who needs to respond, and keep important decisions moving.

**Core idea:** Client decides. Assistant executes.

## Live Demo

[Open Relay](https://relay-virid-one.vercel.app/)

## Features

- **Two workspaces:** Assistant dashboard and Client Decision Desk
- **Smart classification:** Assistant to Reply, Client to Reply, No Reply Needed, and Needs Review
- **AI summaries:** Key updates, decisions, deadlines, and next steps
- **AI reply drafts:** Context-aware drafts that users can review and edit
- **AI Executive Copilot:** Ask questions about emails, pending replies, and client decisions
- **Workflow tools:** Search, filters, notifications, and mailbox controls

## Tech Stack

**MERN:** MongoDB Atlas, Express.js, React, and Node.js  
**AI:** Google Gemini API

## Run Locally

**Requirements:** Node.js 20+ and npm

```bash
npm --prefix client install
npm --prefix server install
npm install
```

Start the backend and frontend in separate terminals:

```bash
npm run server:start
npm run client:dev
```

Add your environment variables in the server configuration as needed. See `.env.example` for the available settings.

---

Built as an AI-powered email-management project.
