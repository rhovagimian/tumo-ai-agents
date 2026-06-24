# Day 1: What Are AI Agents?

## What We Learned

- The difference between a chatbot and an AI agent
- The Agent Loop: **Perceive → Think → Act → Observe**
- How to set up a TypeScript project with the Claude SDK
- How to make your first API call to Claude
- How system prompts shape Claude's behavior

## Setup

```bash
cd day-01
npm install
export ANTHROPIC_API_KEY="your-key-here"
```

## Scripts

| File | What it does | Run it |
|------|-------------|--------|
| `src/01-hello-claude.ts` | Your first API call to Claude | `npx tsx src/01-hello-claude.ts` |
| `src/02-system-prompt.ts` | Using system prompts to change Claude's personality | `npx tsx src/02-system-prompt.ts` |

## Key Concepts

### The Agent Loop

Every AI agent follows this cycle:

1. **Perceive** — Receive input or observe the current state
2. **Think** — The LLM decides what to do next
3. **Act** — Use a tool or take an action
4. **Observe** — See the result and feed it back in

This loop repeats until the task is complete.

### API Call Structure

```typescript
const response = await client.messages.create({
  model: "claude-sonnet-4-6",  // which model to use
  max_tokens: 1024,                    // max response length
  system: "optional system prompt",    // sets personality/behavior
  messages: [                          // the conversation
    { role: "user", content: "your message" }
  ]
});

console.log(response.content[0].text); // Claude's reply
```

## Tomorrow

We'll learn about multi-turn conversations, prompt engineering, and getting Claude to output structured JSON data.
