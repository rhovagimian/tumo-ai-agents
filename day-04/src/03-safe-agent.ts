import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { allTools, runTool } from "./tools";

const client = new Anthropic();

// Take your agent loop and add two guardrails:
//   1. a max-turns limit so it can never loop forever
//   2. a try/catch so a broken tool can't crash the whole agent
async function runAgent(userMessage: string, maxTurns = 10): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];
  let turns = 0;

  // TODO 1: Change the loop condition to: while (turns < maxTurns)
  //   and increment turns at the top of each loop.
  while (true) {
    // TODO 2: Same loop body as before, BUT wrap the runTool call in
    //   a try/catch. On error, set result to "Tool error: " + e.message
    //   so the agent can recover instead of crashing.

    break; // <-- remove once your loop works
  }

  // TODO 3: If the loop ends because we hit maxTurns, return a message
  //   like "Stopped: hit the max turn limit."
  return "";
}

async function main() {
  const answer = await runAgent("What is 25 * 4, and what's the weather in London?");
  console.log(answer);
}

main();
