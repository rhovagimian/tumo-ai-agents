import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// STEP 1: DESCRIBE the tool to Claude (the "definition").
// This is what Claude reads to decide when and how to use it.
// ============================================================
const calculatorTool: Anthropic.Tool = {
  name: "calculator",
  description:
    "Performs basic arithmetic. Use this whenever you need an exact " +
    "math answer, since language models are unreliable at mental math.",
  input_schema: {
    type: "object",
    properties: {
      a: { type: "number", description: "First number" },
      b: { type: "number", description: "Second number" },
      operation: {
        type: "string",
        enum: ["add", "subtract", "multiply", "divide"],
      },
    },
    required: ["a", "b", "operation"],
  },
};

// ============================================================
// STEP 2: WRITE the real function that actually runs.
// The definition above is what Claude SEES.
// This function is what your CODE runs. Keep them in sync!
// ============================================================
function runCalculator(input: any): number {
  const { a, b, operation } = input;
  switch (operation) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return a / b;
    default:
      throw new Error("Unknown operation: " + operation);
  }
}

// ============================================================
// STEP 3 & 4: WIRE it together and SEND THE RESULT BACK.
// ============================================================
async function main() {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: "What is 1847 * 293?" },
  ];

  // First call — give Claude the tool
  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: [calculatorTool],
    messages,
  });

  // Claude responds by ASKING to use the tool (it does not run it!)
  if (res.stop_reason === "tool_use") {
    const toolUse = res.content.find((c) => c.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      console.log("Claude wants tool:", toolUse.name);
      console.log("With inputs:", toolUse.input);

      // OUR code runs the real function
      const result = runCalculator(toolUse.input);

      // Add Claude's request to history
      messages.push({ role: "assistant", content: res.content });
      // Add the result back as a special tool_result message
      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: String(result),
          },
        ],
      });

      // Call again so Claude can turn the result into a natural answer
      const final = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        tools: [calculatorTool],
        messages,
      });
      const text = final.content.find((c) => c.type === "text");
      console.log("\nFinal answer:", text && text.type === "text" ? text.text : "");
    }
  }
}

main();
