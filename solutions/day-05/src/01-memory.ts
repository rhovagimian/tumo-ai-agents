import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";

const client = new Anthropic();
const MEMORY_FILE = "memory.json";

// ---- Simple file-based long-term memory ----
// Facts get saved to memory.json and loaded back on the next run,
// so the agent "remembers" you even after the program restarts.

function remember(fact: string): void {
  const memory = loadMemory();
  memory.push(fact);
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

function loadMemory(): string[] {
  if (!fs.existsSync(MEMORY_FILE)) return [];
  return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf-8"));
}

async function main() {
  // Pretend we learned these facts in past sessions
  if (loadMemory().length === 0) {
    remember("The student's name is Ani.");
    remember("Ani is studying for a chemistry exam.");
    remember("Ani likes short, encouraging answers.");
  }

  // Inject everything we remember into the system prompt
  const facts = loadMemory();
  const system =
    "You are a friendly tutor. Things you remember about the student: " +
    facts.join(" ");

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system,
    messages: [{ role: "user", content: "Hi! Can you help me study?" }],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";
  console.log(text);
  // Claude greets Ani by name and references chemistry — because it
  // "remembered" across runs. Delete memory.json to start fresh.
}

main();
