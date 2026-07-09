import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline/promises";
import { allTools, runTool, loadMemory } from "./tools";
import { dim, bold, DOT, ELBOW, getModel, handleCommand, printBanner } from "./commands";

// ============================================================
// THE COMPLETE AGENT — a chat loop, like Claude Code.
//
//   tools (from tools.ts)      -> abilities
//   commands (commands.ts)     -> /model, /memory, /clear, ...
//   messages[]                 -> working memory (this conversation)
//   memory.json                -> long-term memory (across runs)
//   the agent loop             -> think, act, observe, repeat
//
// TO MAKE IT YOUR OWN:
//   1. Edit SYSTEM_PROMPT to give your agent a job + personality.
//   2. Add tools in tools.ts (function + definition + dispatcher case).
//   3. Run: npm run agent
// ============================================================

const client = new Anthropic();

// ---- Customize your agent here! ----
// TODO 1: Write a system prompt that gives your agent a job + personality.
//   Tell it to: plan briefly, use tools one step at a time, call the
//   `remember` tool when the user shares something worth keeping (name,
//   preferences, goals), then answer clearly.
const SYSTEM_PROMPT = `TODO: your agent's instructions`;

// Long-term memory is folded into the prompt on every call.
function buildSystemPrompt(): string {
  const facts = loadMemory();
  if (facts.length === 0) return SYSTEM_PROMPT;
  return SYSTEM_PROMPT + "\n\nThings you remember: " + facts.join(" ");
}

// ---- The agent loop (with guardrails) ----
// STRETCH: stream Claude's text so it types out live. Swap
// client.messages.create(...) for client.messages.stream(...), pipe
// stream.on("text", ...) to stdout, and read the finished turn from
// await stream.finalMessage().
// Answer: solutions/day-05/src/agent-streaming.ts
async function runAgent(
  messages: Anthropic.MessageParam[],
  maxTurns = 10,
): Promise<string> {
  let turns = 0;
  while (turns < maxTurns) {
    turns++;
    // TODO 2: Build the safe agent loop here (from Day 4 + planning).
    //   - call client.messages.create with model: getModel(),
    //     system: buildSystemPrompt(), tools: allTools, messages
    //   - push the assistant response
    //   - if stop_reason !== "tool_use", return the text
    //   - otherwise print Claude's plan as `⏺ <text>`, run each tool (wrapped
    //     in try/catch) printing `⏺ name(input)` with the result dimmed
    //     underneath as `  ⎿  result`, and push the results
    break; // <-- remove once your loop works
  }
  return "Stopped: hit the max turn limit.";
}

// ---- Interactive chat interface (done for you) ----
async function main() {
  printBanner();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const messages: Anthropic.MessageParam[] = []; // working memory, kept across turns

  while (true) {
    const input = (await rl.question(bold("> "))).trim();
    if (!input) continue;

    const lower = input.toLowerCase();
    if (lower === "exit" || lower === "quit" || lower === "/exit") break;

    if (input.startsWith("/")) {
      handleCommand(input, messages);
      console.log();
      continue;
    }

    messages.push({ role: "user", content: input });
    const answer = await runAgent(messages);
    console.log(`\n${DOT} ${answer}\n`);
  }

  rl.close();
}

main();
