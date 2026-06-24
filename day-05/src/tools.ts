import Anthropic from "@anthropic-ai/sdk";

// ============================================================
// Shared tools for our agent. Each tool is two things:
//   1. a DEFINITION (what Claude sees)
//   2. a FUNCTION (what our code runs)
// The dispatcher at the bottom connects names to functions.
// ============================================================

export const calculatorTool: Anthropic.Tool = {
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

function runCalculator(input: any): string {
  const { a, b, operation } = input;
  if (operation === "add") return String(a + b);
  if (operation === "subtract") return String(a - b);
  if (operation === "multiply") return String(a * b);
  return String(a / b);
}

export const weatherTool: Anthropic.Tool = {
  name: "get_weather",
  description: "Get the current weather for a city.",
  input_schema: {
    type: "object",
    properties: { city: { type: "string" } },
    required: ["city"],
  },
};

function getWeather(input: any): string {
  const fakeData: Record<string, string> = {
    Yerevan: "28°C, sunny",
    London: "14°C, rainy",
    Tokyo: "22°C, cloudy",
  };
  return fakeData[input.city] || "20°C, clear";
}

export const dictionaryTool: Anthropic.Tool = {
  name: "dictionary",
  description: "Look up the definition of an English word.",
  input_schema: {
    type: "object",
    properties: { word: { type: "string" } },
    required: ["word"],
  },
};

function lookupWord(input: any): string {
  const defs: Record<string, string> = {
    agent: "a program that perceives, decides, and acts to reach a goal",
    tool: "a function an AI can call to take an action",
    loop: "a sequence of steps that repeats",
  };
  return defs[String(input.word).toLowerCase()] || "No definition found.";
}

// All tool definitions Claude can see
export const allTools: Anthropic.Tool[] = [
  calculatorTool,
  weatherTool,
  dictionaryTool,
];

// The dispatcher: maps a tool name to the real function that runs it.
// To add a tool: write its function, add it to allTools, add a case here.
export function runTool(name: string, input: any): string {
  switch (name) {
    case "calculator":
      return runCalculator(input);
    case "get_weather":
      return getWeather(input);
    case "dictionary":
      return lookupWord(input);
    default:
      return "Error: unknown tool " + name;
  }
}
