import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { allTools, runTool } from "./tools";

const client = new Anthropic();

// Start from your working agent loop (01-agent-loop.ts), then add
// logging so you can WATCH the agent think.
async function runAgent(userMessage: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];
  let loop = 0;

  while (true) {
    loop++;
    console.log(`\n--- Loop ${loop} ---`);

    // TODO 1: Same loop as 01-agent-loop.ts.

    // TODO 2: When you run a tool, also log it so you can see the agent's
    //   reasoning, e.g.:
    //   console.log(`  TOOL: ${block.name}(${JSON.stringify(block.input)})`);
    //   console.log(`  RESULT: ${result}`);

    break; // <-- remove once your loop works
  }
  return "";
}

async function main() {
  // A task that needs TWO tools in a row — watch Claude plan the order.
  const answer = await runAgent(
    "What's the weather in Yerevan, and is that warmer than 25 degrees?"
  );
  console.log("\n=== FINAL ANSWER ===");
  console.log(answer);
}

main();
