import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// TOOL SELECTION — the DESCRIPTION is how Claude decides which
// tool to use. Two tools with the SAME job need SHARP, DISTINCT
// descriptions, or Claude picks the wrong one.
//
// This file ships with BOTH versions so you can see the contrast.
// Flip the USE_VAGUE_DESCRIPTIONS switch and re-run to break it.
// ============================================================
const USE_VAGUE_DESCRIPTIONS = false; // <-- set to true to watch Claude get confused

// ---- Version A: VAGUE / OVERLAPPING (bad — Claude picks inconsistently) ----
const vagueWeather: Anthropic.Tool = {
  name: "get_weather",
  description: "Gets weather.", // too vague — could mean anything
  input_schema: {
    type: "object",
    properties: { city: { type: "string" } },
    required: ["city"],
  },
};
const vagueForecast: Anthropic.Tool = {
  name: "get_forecast",
  description: "Gets weather info.", // basically the same sentence!
  input_schema: {
    type: "object",
    properties: { city: { type: "string" } },
    required: ["city"],
  },
};

// ---- Version B: SHARP / DISTINCT (good — Claude picks correctly) ----
const sharpWeather: Anthropic.Tool = {
  name: "get_weather",
  description:
    "The CURRENT weather right now, at this moment, for one city " +
    "(temperature and conditions today).",
  input_schema: {
    type: "object",
    properties: { city: { type: "string" } },
    required: ["city"],
  },
};
const sharpForecast: Anthropic.Tool = {
  name: "get_forecast",
  description:
    "The multi-day FORECAST over the next several days for one city " +
    "(what the weather WILL be, not what it is right now).",
  input_schema: {
    type: "object",
    properties: { city: { type: "string" } },
    required: ["city"],
  },
};

// Pick which pair of descriptions to hand Claude
const weatherTool = USE_VAGUE_DESCRIPTIONS ? vagueWeather : sharpWeather;
const forecastTool = USE_VAGUE_DESCRIPTIONS ? vagueForecast : sharpForecast;

// ---- The real functions (mock data) ----
function getWeather(input: any): string {
  const data: Record<string, string> = {
    Yerevan: "28°C, sunny",
    London: "14°C, rainy",
  };
  return data[input.city] || "20°C, clear";
}
function getForecast(input: any): string {
  const data: Record<string, string> = {
    Yerevan: "Sunny all week, highs around 30°C",
    London: "Rain Mon–Wed, clearing by the weekend",
  };
  return data[input.city] || "Mild and mixed over the next few days";
}

async function ask(question: string) {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: question }];

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: [weatherTool, forecastTool],
    messages,
  });

  if (res.stop_reason === "tool_use") {
    const toolUse = res.content.find((c) => c.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      const result =
        toolUse.name === "get_weather" ? getWeather(toolUse.input) : getForecast(toolUse.input);
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
  console.log(USE_VAGUE_DESCRIPTIONS ? "--- VAGUE descriptions ---\n" : "--- SHARP descriptions ---\n");
  // "right now" should trigger get_weather; "this week" should trigger get_forecast.
  await ask("What's the weather in Yerevan right now?");
  await ask("What will the weather in London be like this week?");
}

main();
