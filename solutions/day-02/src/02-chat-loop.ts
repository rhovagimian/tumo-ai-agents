import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline/promises";

const client = new Anthropic();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// The whole conversation lives here and grows with every message.
const messages: Anthropic.MessageParam[] = [];

async function main() {
  console.log("Chat with Claude! (type 'exit' to quit)\n");

  while (true) {
    const userInput = await rl.question("You: ");
    if (userInput.trim().toLowerCase() === "exit") break;

    // Add what the user said to the history
    messages.push({ role: "user", content: userInput });

    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages,
    });

    const reply = res.content[0].type === "text" ? res.content[0].text : "";
    console.log("Claude: " + reply + "\n");

    // Add Claude's reply to the history so the next turn has context
    messages.push({ role: "assistant", content: reply });
  }

  rl.close();
}

main();

// TRY THIS: add a system prompt to give your bot a personality.
// Add `system: "You are a pirate who loves to code."` inside
// client.messages.create({ ... }).
