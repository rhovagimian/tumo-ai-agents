import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// DICE ROLLER — the instructor's example of "build your own tool".
// A great tool for Claude because it CAN'T do it alone: rolling
// dice needs real randomness, which only your code can provide.
// ============================================================

// ---- 1. Describe the tool ----
const diceTool: Anthropic.Tool = {
  name: "roll_dice",
  description:
    "Rolls dice and returns the results. Use this whenever the user " +
    "wants to roll one or more dice (e.g. '2d6', 'roll three 20-sided dice').",
  input_schema: {
    type: "object",
    properties: {
      count: { type: "number", description: "How many dice to roll" },
      sides: { type: "number", description: "Number of sides on each die" },
    },
    required: ["count", "sides"],
  },
};

// ---- 2. Write the real function ----
function rollDice(input: any): string {
  const { count, sides } = input;
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  return `Rolled: ${rolls.join(", ")}`;
}

// ---- 3. Wire it up (same round-trip as always) ----
async function main() {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: "Roll three 6-sided dice for me!" },
  ];

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: [diceTool],
    messages,
  });

  if (res.stop_reason === "tool_use") {
    const toolUse = res.content.find((c) => c.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      const result = rollDice(toolUse.input);
      console.log(result);

      messages.push({ role: "assistant", content: res.content });
      messages.push({
        role: "user",
        content: [{ type: "tool_result", tool_use_id: toolUse.id, content: result }],
      });

      const final = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        tools: [diceTool],
        messages,
      });
      const text = final.content.find((c) => c.type === "text");
      console.log("\nFinal answer:", text && text.type === "text" ? text.text : "");
    }
  }
}

main();
