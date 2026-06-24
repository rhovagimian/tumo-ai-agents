import Anthropic from "@anthropic-ai/sdk";

// Create a client — it automatically reads ANTHROPIC_API_KEY from your environment
const client = new Anthropic();

async function main() {
  // TODO 1: Call the API with client.messages.create({ ... })
  //   - model: "claude-sonnet-4-6"
  //   - max_tokens: 1024
  //   - messages: an array with one { role: "user", content: "..." } message
  //   Ask Claude: "What is an AI agent in 2 sentences?"
  //
  // const response = await client.messages.create({ ... });

  // TODO 2: Print Claude's reply.
  //   The text is at response.content[0].text
  //   (check response.content[0].type === "text" first)
  //
  // console.log(...);
}

main();
