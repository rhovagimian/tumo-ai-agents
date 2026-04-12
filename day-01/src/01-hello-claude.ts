import Anthropic from "@anthropic-ai/sdk";

// Create a client — it automatically reads
// ANTHROPIC_API_KEY from your environment
const client = new Anthropic();

async function main() {
  // Send a message to Claude
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content:
          "Hello! I'm a student at TUMO. What is an AI agent in 2 sentences?",
      },
    ],
  });

  // The response contains an array of content blocks
  // For a simple text response, we grab the first one
  const textBlock = response.content[0];
  if (textBlock.type === "text") {
    console.log(textBlock.text);
  }
}

main();
