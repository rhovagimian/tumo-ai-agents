import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

async function main() {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    // TODO 1: Add a system prompt to give Claude a personality.
    //   Add a line like:  system: "You are a ...",
    //   Try: a friendly Armenian tutor who greets in Armenian first.

    messages: [
      { role: "user", content: "What's the best food in Armenia?" },
    ],
  });

  // TODO 2: Print the reply (response.content[0].text)

  // TODO 3: Run it, then change the system prompt to a totally
  //   different character (a pirate? a robot?) and run again.
}

main();
