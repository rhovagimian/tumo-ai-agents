import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// ERROR HANDLING — tools live in the real world, so they fail.
// Wrap the tool run in try/catch. On failure, send the error back
// as a tool_result with is_error: true, and Claude will RECOVER
// in words instead of crashing.
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

// ---- Tool 2: Weather — THROWS for unknown cities so we can see recovery ----
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
  const weather = data[input.city];
  if (!weather) {
    // Real tools fail like this all the time (bad input, network down, etc.)
    throw new Error(`No weather station found for "${input.city}".`);
  }
  return weather;
}

async function main() {
  const messages: Anthropic.MessageParam[] = [
    // Atlantis isn't in our mock data, so getWeather will THROW.
    { role: "user", content: "What's the weather in Atlantis?" },
  ];

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: [calculatorTool, weatherTool],
    messages,
  });

  if (res.stop_reason === "tool_use") {
    const toolUse = res.content.find((c) => c.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      // Build the tool_result — normally a success, but maybe an error.
      let toolResult: Anthropic.ToolResultBlockParam;
      try {
        const result =
          toolUse.name === "calculator" ? String(runCalculator(toolUse.input)) : getWeather(toolUse.input);
        toolResult = { type: "tool_result", tool_use_id: toolUse.id, content: result };
      } catch (err: any) {
        // Something broke — tell Claude in a human-readable way.
        console.log("Tool failed:", err.message);
        toolResult = {
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: `Error: ${err.message}`,
          is_error: true, // <-- flags this result as a failure
        };
      }

      messages.push({ role: "assistant", content: res.content });
      messages.push({ role: "user", content: [toolResult] });

      // Claude reads the error and recovers with a helpful sentence.
      const final = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        tools: [calculatorTool, weatherTool],
        messages,
      });
      const text = final.content.find((c) => c.type === "text");
      console.log("\nClaude recovers:", text && text.type === "text" ? text.text : "");
    }
  }
}

main();
