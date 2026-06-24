import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline/promises";
import * as fs from "fs";
import { allTools, runTool } from "./tools";

// ============================================================
// THE COMPLETE AGENT — your Week 2 starting point.
//
// This brings together everything from Week 1:
//   - tools (from tools.ts)        -> the agent's abilities
//   - the safe agent loop          -> the engine
//   - a planning system prompt     -> the brain's instructions
//   - simple file-based memory     -> remembers across runs
//   - an interactive chat loop     -> talk to it in the terminal
//
// TO MAKE IT YOUR OWN:
//   1. Edit SYSTEM_PROMPT to give your agent a job + personality.
//   2. Add your own tools in tools.ts (function + definition + dispatcher case).
//   3. Run: npm run agent
// ============================================================

const client = new Anthropic();
const MEMORY_FILE = "memory.json";

// ---- Customize your agent here! ----
const SYSTEM_PROMPT = `You are a helpful assistant agent with access to tools.

How to work:
1. Briefly plan your approach before acting.
2. Use tools one step at a time when they help.
3. When the task is done, give a clear, friendly answer.`;

// ---- Memory helpers ----
function loadMemory(): string[] {
  if (!fs.existsSync(MEMORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf-8"));
}

function buildSystemPrompt(): string {
  const facts = loadMemory();
  if (facts.length === 0) return SYSTEM_PROMPT;
  return SYSTEM_PROMPT + "\n\nThings you remember: " + facts.join(" ");
}

// ---- The agent loop (with guardrails) ----
async function runAgent(
  messages: Anthropic.MessageParam[],
  maxTurns = 10
): Promise<string> {
  let turns = 0;
  while (turns < maxTurns) {
    turns++;
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: buildSystemPrompt(),
      tools: allTools,
      messages,
    });
    messages.push({ role: "assistant", content: res.content });

    if (res.stop_reason !== "tool_use") {
      const text = res.content.find((c) => c.type === "text");
      return text && text.type === "text" ? text.text : "";
    }

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of res.content) {
      if (block.type === "tool_use") {
        let result: string;
        try {
          result = runTool(block.name, block.input);
        } catch (e: any) {
          result = "Tool error: " + e.message;
        }
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }
    }
    messages.push({ role: "user", content: toolResults });
  }
  return "Stopped: hit the max turn limit.";
}

// ---- Interactive chat interface ----
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const messages: Anthropic.MessageParam[] = [];

  console.log("🤖 Your agent is ready! (type 'exit' to quit)\n");

  while (true) {
    const input = await rl.question("You: ");
    if (input.trim().toLowerCase() === "exit") break;

    messages.push({ role: "user", content: input });
    const answer = await runAgent(messages);
    console.log("Agent: " + answer + "\n");
  }

  rl.close();
}

main();
