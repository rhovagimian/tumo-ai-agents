import "dotenv/config";
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

    // TODO 1: Add the user's message to the history.
    //   messages.push({ role: "user", content: userInput });

    // TODO 2: Call the API with the messages array.
    //   const res = await client.messages.create({ ... });

    // TODO 3: Get the reply text and print it as "Claude: ...".

    // TODO 4: Add Claude's reply to the history so the next turn
    //   has the full context.
  }

  rl.close();
}

main();
