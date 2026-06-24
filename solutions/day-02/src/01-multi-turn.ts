import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// The conversation history — a growing list of messages.
// Claude has NO memory of its own. This array IS the memory,
// and WE are the ones who maintain it.
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

  // Save Claude's reply to the history so it remembers it next turn
  messages.push({ role: "assistant", content: reply });

  // ---- Second turn ----
  // Because the history includes "My name is Ani", Claude can answer this.
  messages.push({ role: "user", content: "What's my name?" });
  res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages,
  });
  reply = res.content[0].type === "text" ? res.content[0].text : "";
  console.log("Claude:", reply); // "Your name is Ani!"
}

chat();

// TRY THIS: comment out the line that pushes Claude's first reply
// (messages.push({ role: "assistant", ... })) and run again.
// Claude will no longer remember your name — proving the memory
// is just us keeping the list, not magic.
