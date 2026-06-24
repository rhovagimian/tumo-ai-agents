import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ---- Tool 1: Calculator (already done for you) ----
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

// ---- Tool 2: Weather ----
// TODO 1: Define a weatherTool with name "get_weather", a good
//   description, and an input_schema needing a "city" string.

// TODO 2: Write getWeather(input) that returns mock weather for a city.
//   (e.g. a lookup object with a couple of cities, default "20°C, clear")

async function ask(question: string) {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: question }];

  // TODO 3: Call the API passing BOTH tools: [calculatorTool, weatherTool].

  // TODO 4: Check which tool Claude picked (toolUse.name) and run the
  //   matching function, then print the question and the result.
}

async function main() {
  await ask("What is 5 times 9?");
  await ask("What's the weather in Yerevan?");
}

main();
