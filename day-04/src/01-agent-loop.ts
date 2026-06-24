import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { allTools, runTool } from "./tools";

const client = new Anthropic();

// ============================================================
// THE AGENT LOOP
// Keep calling Claude, running any tools it asks for and feeding
// results back, until Claude stops asking for tools. That's an agent.
// ============================================================
async function runAgent(userMessage: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  while (true) {
    // TODO 1: Call the API with tools: allTools and the messages array.
    //   Then push the assistant response: messages.push({ role: "assistant", content: res.content })

    // TODO 2: If res.stop_reason !== "tool_use", Claude is DONE.
    //   Find the text block and return its text.

    // TODO 3: Otherwise Claude wants tools. For each content block where
    //   block.type === "tool_use", run runTool(block.name, block.input)
    //   and collect a tool_result { type, tool_use_id, content }.

    // TODO 4: Push all the tool results as one user message, then let
    //   the while loop go around again.

    break; // <-- remove this once your loop is working
  }
  return "";
}

async function main() {
  const answer = await runAgent("What is 1847 * 293?");
  console.log(answer);
}

main();
