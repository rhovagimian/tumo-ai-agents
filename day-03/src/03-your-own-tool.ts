import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// YOUR TURN! Invent your own tool.
// Ideas: dictionary, dice roller, unit converter, translator.
// ============================================================

// ---- 1. Describe YOUR tool ----
const myTool: Anthropic.Tool = {
  name: "TODO_name_your_tool",
  description: "TODO: describe WHEN Claude should use this tool",
  input_schema: {
    type: "object",
    properties: {
      // TODO: describe the inputs your tool needs
    },
    required: [],
  },
};

// ---- 2. Write the real function ----
function runMyTool(input: any): string {
  // TODO: make your tool actually do something and return a string
  return "TODO";
}

// ---- 3. Wire it up (mostly done — just runs your tool) ----
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
  }
}

// TODO: ask something that should trigger YOUR tool
ask("TODO: a question that uses your tool");
