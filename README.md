# 🤖 Build Your Own AI Agent — TUMO Workshop

**TUMO Center for Creative Technologies • Summer 2026**

A 2-week workshop where students build AI agents from scratch using TypeScript, Node.js, and the Claude API.

## Workshop Structure

| Day | Topic | Folder |
|-----|-------|--------|
| 1 | What Are AI Agents? | `day-01/` |
| 2 | Talking to an LLM Programmatically | `day-02/` |
| 3 | Tools: Giving Your Agent Hands | `day-03/` |
| 4 | The Agent Loop in Code | `day-04/` |
| 5 | Memory, Context & Planning | `day-05/` |
| 6–9 | Build Your Own Agent | (use `day-05/` as your starting point) |
| 10 | Demo Day! | |

## Prerequisites

- TUMO Programming Level 2 (required), Level 3 (preferred)
- Node.js 18+ installed
- A code editor (VS Code recommended)

## Quick Start

```bash
# Clone this repo
git clone https://github.com/rhovagimian/tumo-ai-agents.git
cd tumo-ai-agents

# Go to the day you need
cd day-01

# Install dependencies
npm install

# Set your API key
export ANTHROPIC_API_KEY="your-key-here"

# Run any script
npx tsx src/01-hello-claude.ts
```

## API Key

Your workshop leader will provide API keys for the class. **Never commit your API key to Git!**

## Missed a Day?

Each day's folder is self-contained with its own `package.json`. You can jump into any day and `npm install` to get started. Each folder builds on the previous day's concepts, so read the day's README to catch up.

## Workshop Leader

**Raffi Hovagimian** — Software Engineer at Meta
