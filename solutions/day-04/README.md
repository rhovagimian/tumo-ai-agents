# Day 4: The Agent Loop in Code

## What We Learned
- An agent is a loop: call Claude, run tools, repeat until done
- `stop_reason` tells us when to keep going vs finish
- A dispatcher routes tool names to functions
- Real agents need guardrails: max turns + try/catch

## Setup
```bash
cd day-04
npm install
export ANTHROPIC_API_KEY="your-key-here"
```

## Scripts
| File | What it does | Run it |
|------|-------------|--------|
| `src/tools.ts` | Shared tools + dispatcher (imported by the others) | — |
| `src/01-agent-loop.ts` | The core agent loop | `npm run agent` |
| `src/02-multi-step.ts` | Agent loop with logging — watch it think | `npm run multi-step` |
| `src/03-safe-agent.ts` | Loop with max-turns + try/catch guardrails | `npm run safe` |

## Key Idea
```
while (true):
  call Claude
  if Claude is done -> return answer
  else -> run the tools it asked for, send results back, loop
```
That's an agent. Everything else is detail.

## Tomorrow
Memory, context, and planning — the final polish before Week 2.
