import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline/promises";
import * as fs from "fs";
import { allTools, runTool } from "./tools";

// ============================================================
// THE COMPLETE AGENT — assemble everything from Week 1, then
// fork this for your Week 2 project.
//
// Pieces to wire together:
//   - tools (from tools.ts)        -> abilities
//   - the safe agent loop          -> engine
//   - a planning system prompt     -> brain's instructions
//   - simple file-based memory     -> remembers across runs
//   - an interactive chat loop     -> talk to it in the terminal
// ============================================================

const client = new Anthropic();
const MEMORY_FILE = "memory.json";

// ---- Customize your agent here! ----
// TODO 1: Write a system prompt that gives your agent a job + personality
//   and tells it to plan before acting.
const SYSTEM_PROMPT = `TODO: your agent's instructions`;

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
    // TODO 2: Build the safe agent loop here (from Day 4 + planning).
    //   - call client.messages.create with system: buildSystemPrompt(),
    //     tools: allTools, messages
    //   - push the assistant response
    //   - if stop_reason !== "tool_use", return the text
    //   - otherwise run each tool (wrapped in try/catch) and push results
    break; // <-- remove once your loop works
  }
  return "Stopped: hit the max turn limit.";
}

// ---- Interactive chat interface (done for you) ----
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const messages: Anthropic.MessageParam[] = [];

  console.log("Your agent is ready! (type 'exit' to quit)\n");

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
