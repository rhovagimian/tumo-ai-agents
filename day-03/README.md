# Day 3: Tools — Giving Your Agent Hands

> **This is starter code.** Fill in the `TODO` comments as we build together in class.
> Stuck or catching up? The finished version is in [`solutions/day-03`](../solutions/day-03/).


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

## Scripts
| File | What it does | Run it |
|------|-------------|--------|
| `src/01-first-tool.ts` | Full calculator tool flow | `npm run first-tool` |
| `src/02-multiple-tools.ts` | Claude picks between two tools | `npm run multiple` |
| `src/03-your-own-tool.ts` | Template to build your own tool | `npm run your-tool` |

## Instructor demos (finished, in [`solutions/day-03`](../solutions/day-03/src/))
These back the in-class activities, in slide order:
| File | What it demonstrates |
|------|----------------------|
| `01-first-tool.ts` | The calculator: one tool, one round-trip |
| `text-stats.ts` | Copy the calculator into a `text_stats` tool |
| `02-multiple-tools.ts` | Calculator + weather: Claude picks by name |
| `tool-selection.ts` | Descriptions decide the pick (vague vs. sharp) |
| `two-tools-at-once.ts` | Run several tool requests in one reply |
| `chaining.ts` | One tool's output feeds the next (while loop) |
| `error-handling.ts` | A tool fails → `is_error` → Claude recovers |
| `03-your-own-tool.ts` | Template to build your own tool |
| `dice.ts` | Instructor example for "build your own tool" |

## Key Idea
**Claude does NOT run your tools.** It sends a message ASKING to use one.
Your code runs the real function and sends the result back. Claude is the
brain; your code is the hands.

## Tomorrow
We wrap this in a loop so Claude can use tools again and again — a real agent!
