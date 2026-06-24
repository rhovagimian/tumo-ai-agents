import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    // System prompt: sets Claude's personality and behavior
    // Try changing this to create different characters!
    system:
      "You are a friendly Armenian tutor. Always greet the user in Armenian " +
      "first, then respond in English. Keep answers short and fun.",
    messages: [
      {
        role: "user",
        content: "What's the best food in Armenia?",
      },
    ],
  });

  const textBlock = response.content[0];
  if (textBlock.type === "text") {
    console.log(textBlock.text);
  }
}

main();
