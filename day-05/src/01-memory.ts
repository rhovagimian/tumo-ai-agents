import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";

const client = new Anthropic();
const MEMORY_FILE = "memory.json";

// Simple file-based long-term memory: save facts to a file, load them
// back next run, so the agent "remembers" across restarts.

function remember(fact: string): void {
  const memory = loadMemory();
  // TODO 1: push the new fact and write the array back to MEMORY_FILE
  //   with fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2))
}

function loadMemory(): string[] {
  // TODO 2: if MEMORY_FILE doesn't exist (fs.existsSync) return []
  //   otherwise read + JSON.parse it and return the array
  return [];
}

async function main() {
  if (loadMemory().length === 0) {
    remember("The student's name is Ani.");
    remember("Ani is studying for a chemistry exam.");
  }

  // TODO 3: build a system prompt that injects the remembered facts,
  //   e.g. "You are a tutor. Things you remember: " + facts.join(" ")

  // TODO 4: call the API with that system prompt and a "Hi, can you
  //   help me study?" message, then print the reply. Claude should
  //   greet Ani by name. Delete memory.json to start fresh.
}

main();
