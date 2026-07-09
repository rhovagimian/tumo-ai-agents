# Day 5: Memory, Context & Planning

> **This is starter code.** Fill in the `TODO` comments as we build together in class.
> Stuck or catching up? The finished version is in [`solutions/day-05`](../solutions/day-05/).


## What We Learned
- Short-term memory (the `messages` array) vs long-term memory (a file)
- Context windows: Claude can read a lot, but not infinitely
- Planning: tell Claude to think before it acts (just a system prompt!)
- Assembled the **complete agent template** — your Week 2 starting point

## Setup
```bash
cd day-05
npm install
cp .env.example .env   # then paste your key into .env
# (or export it directly: export ANTHROPIC_API_KEY="your-key-here")
```

## Scripts
| File | What it does | Run it |
|------|-------------|--------|
| `src/tools.ts` | Shared tools + dispatcher | — |
| `src/commands.ts` | Slash commands for the chat loop | — |
| `src/01-memory.ts` | File-based long-term memory | `npm run memory` |
| `src/02-planning.ts` | A planning system prompt | `npm run planning` |
| `src/agent.ts` | **The complete agent — fork this for Week 2!** | `npm run agent` |

## The Agent Recipe
Every agent = four ingredients:
1. **Tools** — functions Claude can request
2. **Loop** — call, run tools, repeat
3. **Prompt** — plan + personality + rules
4. **Memory** — remember what matters

## Chatting With It
`npm run agent` opens a chat loop — your own little Claude Code. You type at the
`>` prompt, and the agent shows its work as it goes: `⏺` marks something the
agent did (a thought, or a tool call), and `⎿` shows what came back.

```
> My name is Ani, what's the weather in Yerevan?

⏺ I'll save your name, then check the weather.

⏺ remember({"fact":"The user is named Ani."})
  ⎿  Saved to memory: The user is named Ani.

⏺ get_weather({"city":"Yerevan"})
  ⎿  28°C, sunny

⏺ Nice to meet you, Ani! It's 28°C and sunny in Yerevan.
```

The conversation stays in memory across turns; the `remember` tool writes facts
to `memory.json` so they survive a restart.

| Command | What it does |
|---------|-------------|
| `/help` | List the commands |
| `/model [name]` | Switch model, or show the current one. Try `opus`, `sonnet`, `haiku`, or any full `claude-…` id |
| `/models` | List the models you can switch to (`*` marks the current one) |
| `/memory` | Show what's in long-term memory |
| `/clear` | Forget this conversation (long-term memory survives) |
| `/exit` | Quit — so do `exit` and `quit` |

## Stretch: Make It Stream
Right now the agent thinks in silence, then dumps its whole answer at once.
Make the text type out live instead:
- swap `client.messages.create(...)` for `client.messages.stream(...)`
- `stream.on("text", (delta) => process.stdout.write(delta))`
- read the finished turn from `const res = await stream.finalMessage()`, then
  run tools exactly as before
- stop printing the text blocks — they already streamed

Answer: [`solutions/day-05/src/agent-streaming.ts`](../solutions/day-05/src/agent-streaming.ts)

## Make It Your Own (Week 2)
1. Edit `SYSTEM_PROMPT` in `agent.ts` to give your agent a job + personality
2. Add your own tools in `tools.ts` (function + definition + dispatcher case)
3. Add your own slash command in `commands.ts`
4. Run `npm run agent` and chat with your creation!
