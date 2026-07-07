import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// text_stats — you build this by COPYING 01-first-tool.ts and
// swapping the calculator for a text analyzer.
// Same round-trip, different tool.
// ============================================================

// ---- STEP 1: DESCRIBE the tool ----
const textStatsTool: Anthropic.Tool = {
  name: "text_stats",
  description:
    "Counts words, characters, and sentences in a piece of text. " +
    "Use this whenever someone asks how long a text is or how many " +
    "words/characters/sentences it has.",
  input_schema: {
    type: "object",
    properties: {
      text: { type: "string", description: "The text to analyze" },
    },
    required: ["text"],
  },
};

// ---- STEP 2: WRITE the real function ----
function getTextStats(input: any): string {
  const { text } = input;
  const words = text.split(" ").length; // rough word count
  const characters = text.length; // exact character count
  const sentences = text.split(".").length - 1; // rough sentence count
  return `${words} words, ${characters} characters, ${sentences} sentences`;
}

// ---- STEP 3 & 4: WIRE it up and SEND THE RESULT BACK ----
async function main() {
  const messages: Anthropic.MessageParam[] = [
    {
      role: "user",
      content:
        'How many words, characters, and sentences are in this text? ' +
        '"The fox ran. The dog slept. Then it rained all night long."',
    },
  ];

  // First call — give Claude the tool
  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    tools: [textStatsTool],
    messages,
  });

  // Claude ASKS to use the tool — our code runs it
  if (res.stop_reason === "tool_use") {
    const toolUse = res.content.find((c) => c.type === "tool_use");
    if (toolUse && toolUse.type === "tool_use") {
      console.log("Claude wants tool:", toolUse.name);
      console.log("With inputs:", toolUse.input);

      const result = getTextStats(toolUse.input);

      messages.push({ role: "assistant", content: res.content });
      messages.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: toolUse.id, // must match the tool_use id
            content: result,
          },
        ],
      });

      const final = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        tools: [textStatsTool],
        messages,
      });
      const text = final.content.find((c) => c.type === "text");
      console.log("\nFinal answer:", text && text.type === "text" ? text.text : "");
    }
  }
}

main();
