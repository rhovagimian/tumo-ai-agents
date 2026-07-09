import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline/promises";
import { allTools, runTool, loadMemory } from "./tools";
import { dim, bold, DOT, ELBOW, getModel, handleCommand, printBanner } from "./commands";

// ============================================================
// STRETCH ANSWER — the same agent, but Claude's text streams in
// token by token instead of appearing all at once.
//
// Changes from agent.ts:
//   1. client.messages.stream(...) instead of .create(...)
//   2. stream.on("text", ...) writes each delta straight to stdout
//   3. await stream.finalMessage() gives the assembled turn for tools
//   4. runAgent returns void, not the final answer — the answer already
//      streamed to the screen, so there's nothing left for main() to print
// ============================================================

const client = new Anthropic();

// ---- Customize your agent here! ----
const SYSTEM_PROMPT = `You are a helpful assistant agent with access to tools.

How to work:
1. Briefly plan your approach before acting.
2. Use tools one step at a time when they help.
3. When the user shares something worth keeping (their name, preferences,
   goals), call the remember tool.
4. When the task is done, give a clear, friendly answer.`;

// Long-term memory is folded into the prompt on every call.
function buildSystemPrompt(): string {
  const facts = loadMemory();
  if (facts.length === 0) return SYSTEM_PROMPT;
  return SYSTEM_PROMPT + "\n\nThings you remember: " + facts.join(" ");
}

// ---- The agent loop, streaming ----
async function runAgent(
  messages: Anthropic.MessageParam[],
  maxTurns = 10
): Promise<void> {
  let turns = 0;
  while (turns < maxTurns) {
    turns++;
    const stream = client.messages.stream({
      model: getModel(),
      max_tokens: 1024,
      system: buildSystemPrompt(),
      tools: allTools,
      messages,
    });

    // types out live as Claude generates it
    let started = false;
    stream.on("text", (delta) => {
      if (!started) {
        process.stdout.write(`\n${DOT} `);
        started = true;
      }
      process.stdout.write(delta);
    });

    const res = await stream.finalMessage();
    if (started) process.stdout.write("\n");
    messages.push({ role: "assistant", content: res.content });

    if (res.stop_reason !== "tool_use") return;

    // Run every tool Claude asked for, show the call, send results back
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type !== "tool_use") continue;
      let result: string;
      try {
        result = runTool(block.name, block.input);
      } catch (e: any) {
        result = "Tool error: " + e.message;
      }
      const args = JSON.stringify(block.input);
      console.log(`\n${DOT} ${bold(block.name)}(${dim(args)})`);
      console.log(dim(`  ${ELBOW}  ${result}`));
      toolResults.push({
        type: "tool_result",
        tool_use_id: block.id,
        content: result,
      });
    }
    messages.push({ role: "user", content: toolResults });
  }
  console.log(dim("  stopped: hit the max turn limit."));
}

// ---- The chat loop ----
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
    await runAgent(messages);
    console.log();
  }

  rl.close();
}

main();
