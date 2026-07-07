import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// TWO TOOLS AT ONCE — like 02-multiple-tools.ts, but Claude can
// ask for SEVERAL tools in a single reply. We find EVERY tool_use
// block, run each one, and send back one tool_result per request.
// ============================================================

// ---- Tool 1: Calculator ----
const calculatorTool: Anthropic.Tool = {
  name: "calculator",
  description: "Performs basic arithmetic for exact math answers.",
  input_schema: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" },
      operation: { type: "string", enum: ["add", "subtract", "multiply", "divide"] },
    },
    required: ["a", "b", "operation"],
  },
};
function runCalculator(input: any): number {
  const { a, b, operation } = input;
  if (operation === "add") return a + b;
  if (operation === "subtract") return a - b;
  if (operation === "multiply") return a * b;
  return a / b;
}

// ---- Tool 2: Weather (mock data) ----
const weatherTool: Anthropic.Tool = {
  name: "get_weather",
  description: "The current weather for a city.",
  input_schema: {
    type: "object",
    properties: { city: { type: "string" } },
    required: ["city"],
  },
};
function getWeather(input: any): string {
  const data: Record<string, string> = { Yerevan: "28°C, sunny", London: "14°C, rainy" };
  return data[input.city] || "20°C, clear";
}

async function main() {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: "What's the weather in Yerevan, and what is 15 times 24?" },
  ];

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: [calculatorTool, weatherTool],
    messages,
  });

  if (res.stop_reason === "tool_use") {
    // Claude may have asked for MORE THAN ONE tool — grab them all.
    const toolUses = res.content.filter((b) => b.type === "tool_use");
    console.log(`Claude asked for ${toolUses.length} tools at once.`);

    // Run each tool and collect one tool_result per request.
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const toolUse of toolUses) {
      if (toolUse.type !== "tool_use") continue;
      let result: string;
      if (toolUse.name === "calculator") result = String(runCalculator(toolUse.input));
      else if (toolUse.name === "get_weather") result = getWeather(toolUse.input);
      else result = "Unknown tool";

      console.log(`  ${toolUse.name} -> ${result}`);
      toolResults.push({
        type: "tool_result",
        tool_use_id: toolUse.id, // each result carries its OWN id
        content: result,
      });
    }

    // Send ALL the results back in ONE message.
    messages.push({ role: "assistant", content: res.content });
    messages.push({ role: "user", content: toolResults });

    const final = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      tools: [calculatorTool, weatherTool],
      messages,
    });
    const text = final.content.find((c) => c.type === "text");
    console.log("\nFinal answer:", text && text.type === "text" ? text.text : "");
  }
}

main();
