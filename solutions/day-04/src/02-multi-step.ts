import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { allTools, runTool } from "./tools";

const client = new Anthropic();

// Same agent loop as 01-agent-loop.ts, but with logging so you can
// WATCH the agent think: every tool it picks and every result it gets.
async function runAgent(userMessage: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];
  let loop = 0;

  while (true) {
    loop++;
    console.log(`\n--- Loop ${loop} ---`);

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
        const result = runTool(block.name, block.input);
        console.log(`  TOOL: ${block.name}(${JSON.stringify(block.input)})`);
        console.log(`  RESULT: ${result}`);
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }
    }
    messages.push({ role: "user", content: toolResults });
  }
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
