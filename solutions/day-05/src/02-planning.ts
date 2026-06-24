import Anthropic from "@anthropic-ai/sdk";
import { allTools, runTool } from "./tools";

const client = new Anthropic();

// The SAME agent loop you already know. The only new thing is a
// smarter system prompt that tells Claude to PLAN before it acts.
// Notice: the code didn't change — only the prompt. That's the
// power of prompt engineering.
const SYSTEM = `You are a helpful task agent with tools.

IMPORTANT — how to work:
1. First, briefly outline your plan in 1-2 sentences.
2. Then use your tools one step at a time.
3. After each tool result, decide the next step.
4. When the task is fully done, give a clear final answer.

Always think about WHICH tool fits before calling it.`;

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
      system: SYSTEM,
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

async function main() {
  const answer = await runAgent(
    "I have a math test (12*8 questions) and need the total, plus tell me " +
      "the weather in Yerevan so I know if I can study outside."
  );
  console.log(answer);
}

main();
