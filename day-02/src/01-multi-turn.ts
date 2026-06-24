import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// The conversation history — Claude has NO memory of its own.
// This array IS the memory, and WE maintain it.
const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "Hi! My name is Ani." },
];

async function chat() {
  // ---- First turn ----
  let res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages,
  });
  let reply = res.content[0].type === "text" ? res.content[0].text : "";
  console.log("Claude:", reply);

  // TODO 1: Save Claude's reply to history so it remembers next turn.
  //   messages.push({ role: "assistant", content: reply });

  // TODO 2: Add a new user message asking "What's my name?"
  //   messages.push({ role: "user", content: "..." });

  // TODO 3: Call the API again with the updated messages array,
  //   then print the reply. Does Claude remember the name "Ani"?

  // TRY THIS: comment out TODO 1 and run again — Claude forgets!
}

chat();
