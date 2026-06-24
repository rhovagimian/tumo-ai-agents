import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Getting structured JSON out of Claude so our CODE can use it.
// The trick is two parts:
//   1. A system prompt that specifies the EXACT json shape and says
//      "ONLY valid JSON, no extra text".
//   2. JSON.parse() to turn the text response into a real object.
async function main() {
  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    system:
      "You extract event details from text. Respond with ONLY valid " +
      "JSON, no extra text, no markdown. Use this exact shape: " +
      '{ "title": string, "date": string, "location": string }',
    messages: [
      {
        role: "user",
        content: "Team dinner at Sevan Restaurant next Friday at 7pm",
      },
    ],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";

  // Always wrap JSON.parse in try/catch — if Claude adds extra text,
  // parsing will fail and we don't want to crash.
  try {
    const data = JSON.parse(text);
    console.log("Title:   ", data.title);
    console.log("Date:    ", data.date);
    console.log("Location:", data.location);
  } catch (err) {
    console.error("Could not parse JSON. Claude returned:\n", text);
  }
}

main();

// TRY THIS: change the system prompt to extract a recipe instead:
// { "name": string, "ingredients": string[], "steps": string[] }
