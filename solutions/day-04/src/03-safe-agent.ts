import Anthropic from "@anthropic-ai/sdk";
import { allTools, runTool } from "./tools";

const client = new Anthropic();

// The agent loop with two guardrails that turn a fragile demo into
// something you can trust:
//   1. a max-turns limit so it can never loop forever
//   2. a try/catch so a broken tool can't crash the whole agent
async function runAgent(userMessage: string, maxTurns = 10): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];
  let turns = 0;

  while (turns < maxTurns) {
    turns++;

    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
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
          // Send the error back to Claude instead of crashing — it can
          // often recover and try a different approach.
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

async function main() {
  const answer = await runAgent("What is 25 * 4, and what's the weather in London?");
  console.log(answer);
}

main();
