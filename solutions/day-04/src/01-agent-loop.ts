import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { allTools, runTool } from "./tools";

const client = new Anthropic();

// ============================================================
// THE AGENT LOOP
// Keep calling Claude, running any tools it asks for and feeding
// the results back, until Claude stops asking for tools and gives
// a final answer. That's it. That's an agent.
// ============================================================
async function runAgent(userMessage: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];

  while (true) {
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      tools: allTools,
      messages,
    });
    messages.push({ role: "assistant", content: res.content });

    // Claude is done — return the final text
    if (res.stop_reason !== "tool_use") {
      const text = res.content.find((c) => c.type === "text");
      return text && text.type === "text" ? text.text : "";
    }

    // Claude wants tools — run each one and collect the results
    const toolResults: Anthropic.ToolResultBlockParam[] = res.content
      .filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use")
      .map((b) => ({
        type: "tool_result",
        tool_use_id: b.id,
        content: runTool(b.name, b.input),
      }));

    messages.push({ role: "user", content: toolResults });
  }
}

async function main() {
  const answer = await runAgent("What is 1847 * 293?");
  console.log(answer);
}

main();
