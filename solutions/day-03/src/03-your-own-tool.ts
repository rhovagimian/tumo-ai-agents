import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// YOUR TURN! Build your own tool by filling in the blanks.
// Ideas: dictionary, dice roller, unit converter, translator.
// ============================================================

// ---- 1. Describe YOUR tool ----
const myTool: Anthropic.Tool = {
  name: "dice_roller", // <-- name your tool
  description:
    "Rolls dice. Use this when the user wants to roll one or more dice.", // <-- describe WHEN to use it
  input_schema: {
    type: "object",
    properties: {
      // <-- describe the inputs your tool needs
      count: { type: "number", description: "How many dice to roll" },
      sides: { type: "number", description: "Number of sides per die" },
    },
    required: ["count", "sides"],
  },
};

// ---- 2. Write the real function ----
function runMyTool(input: any): string {
  // <-- make your tool actually do something
  const { count, sides } = input;
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  const total = rolls.reduce((sum, r) => sum + r, 0);
  return `Rolled: ${rolls.join(", ")} (total: ${total})`;
}

// ---- 3. Wire it up (this part stays the same) ----
async function ask(question: string) {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: question }];

  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: [myTool],
    messages,
  });

  if (res.stop_reason === "tool_use") {
    const toolUse = res.content.find((c) => c.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      const result = runMyTool(toolUse.input);

      messages.push({ role: "assistant", content: res.content });
      messages.push({
        role: "user",
        content: [{ type: "tool_result", tool_use_id: toolUse.id, content: result }],
      });

      const final = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        tools: [myTool],
        messages,
      });
      const text = final.content.find((c) => c.type === "text");
      console.log(text && text.type === "text" ? text.text : "");
    }
  } else {
    const text = res.content.find((c) => c.type === "text");
    console.log(text && text.type === "text" ? text.text : "");
  }
}

// Ask something that should trigger YOUR tool
ask("Roll 2 six-sided dice for me!");
