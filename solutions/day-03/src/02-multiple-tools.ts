import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

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

// ---- Tool 2: Weather (mock data for the workshop) ----
const weatherTool: Anthropic.Tool = {
  name: "get_weather",
  description: "Get the current weather for a city.",
  input_schema: {
    type: "object",
    properties: { city: { type: "string" } },
    required: ["city"],
  },
};

function getWeather(input: any): string {
  // In a real app you'd call a weather API here with fetch().
  const fakeData: Record<string, string> = {
    Yerevan: "28°C, sunny",
    London: "14°C, rainy",
    Tokyo: "22°C, cloudy",
  };
  return fakeData[input.city] || "20°C, clear";
}

// ---- Give Claude BOTH tools and let it pick ----
async function ask(question: string) {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: question }];

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: [calculatorTool, weatherTool],
    messages,
  });

  if (res.stop_reason === "tool_use") {
    const toolUse = res.content.find((c) => c.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      // Claude chose a tool — run the matching function
      let result: string;
      if (toolUse.name === "calculator") result = String(runCalculator(toolUse.input));
      else if (toolUse.name === "get_weather") result = getWeather(toolUse.input);
      else result = "Unknown tool";

      console.log(`Q: ${question}`);
      console.log(`   Claude picked: ${toolUse.name} -> ${result}\n`);
    }
  } else {
    const text = res.content.find((c) => c.type === "text");
    console.log(`Q: ${question}`);
    console.log(`   (no tool) -> ${text && text.type === "text" ? text.text : ""}\n`);
  }
}

async function main() {
  await ask("What is 5 times 9?");
  await ask("What's the weather in Yerevan?");
  await ask("Tell me a fun fact about cats.");
}

main();
