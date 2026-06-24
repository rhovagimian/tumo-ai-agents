# Day 2: Talking to an LLM Programmatically

> **This is starter code.** Fill in the `TODO` comments as we build together in class.
> Stuck or catching up? The finished version is in [`solutions/day-02`](../solutions/day-02/).


## What We Learned
- Conversations are a growing `messages` array that YOU maintain
- Built an interactive chat loop in the terminal
- Prompt engineering: be specific, show examples, set the format
- Getting structured JSON out of Claude and parsing it

## Setup
```bash
cd day-02
npm install
export ANTHROPIC_API_KEY="your-key-here"
```

## Scripts
| File | What it does | Run it |
|------|-------------|--------|
| `src/01-multi-turn.ts` | Multi-turn conversation with memory | `npm run multi-turn` |
| `src/02-chat-loop.ts` | Interactive terminal chatbot | `npm run chat` |
| `src/03-few-shot.ts` | Few-shot prompting | `npm run few-shot` |
| `src/04-structured-output.ts` | Get JSON back from Claude | `npm run structured` |

## Key Idea
Claude has **no memory** between API calls. The `messages` array IS the memory —
and your program is what keeps it alive by appending each new message.

## Tomorrow
We give Claude **tools** — the ability to actually DO things.
