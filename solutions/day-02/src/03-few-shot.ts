import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Few-shot prompting: instead of writing long instructions, we SHOW
// Claude a couple of examples of the exact format we want. Claude
// matches the pattern for the new input.
async function main() {
  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        content: `Classify the sentiment as POSITIVE or NEGATIVE.

Review: "This movie was amazing!"
Sentiment: POSITIVE

Review: "Total waste of time."
Sentiment: NEGATIVE

Review: "Best pizza I've ever had!"
Sentiment:`,
      },
    ],
  });

  const reply = res.content[0].type === "text" ? res.content[0].text : "";
  console.log(reply.trim()); // POSITIVE
}

main();

// TRY THIS: add a third category, NEUTRAL, with an example, then
// test a review like "It was okay, nothing special."
