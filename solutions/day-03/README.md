# Day 3: Tools — Giving Your Agent Hands

## What We Learned
- A tool is a function in YOUR code that Claude can request
- Claude decides WHICH tool and WHAT inputs — your code runs it
- The flow: define → Claude asks → you run → send result back
- Built and wired up a custom tool

## Setup
```bash
cd day-03
npm install
cp .env.example .env   # then paste your key into .env
# (or export it directly: export ANTHROPIC_API_KEY="your-key-here")
```

## Scripts (in slide order)
| File | What it demonstrates | Run it |
|------|----------------------|--------|
| `src/01-first-tool.ts` | The calculator: one tool, one round-trip | `npm run first-tool` |
| `src/text-stats.ts` | Copy the calculator into a `text_stats` tool | `npx tsx src/text-stats.ts` |
| `src/02-multiple-tools.ts` | Calculator + weather: Claude picks by name | `npm run multiple` |
| `src/tool-selection.ts` | Descriptions decide the pick (vague vs. sharp) | `npx tsx src/tool-selection.ts` |
| `src/two-tools-at-once.ts` | Run several tool requests in one reply | `npx tsx src/two-tools-at-once.ts` |
| `src/chaining.ts` | One tool's output feeds the next (while loop) | `npx tsx src/chaining.ts` |
| `src/error-handling.ts` | A tool fails → `is_error` → Claude recovers | `npx tsx src/error-handling.ts` |
| `src/03-your-own-tool.ts` | Template to build your own tool | `npm run your-tool` |
| `src/dice.ts` | Instructor example for "build your own tool" | `npx tsx src/dice.ts` |

## Key Idea
**Claude does NOT run your tools.** It sends a message ASKING to use one.
Your code runs the real function and sends the result back. Claude is the
brain; your code is the hands.

## Tomorrow
We wrap this in a loop so Claude can use tools again and again — a real agent!
