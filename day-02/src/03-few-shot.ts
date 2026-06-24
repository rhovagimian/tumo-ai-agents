import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Few-shot prompting: SHOW Claude examples of the format you want
// instead of writing long instructions.
async function main() {
  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 50,
    messages: [
      {
        role: "user",
        // TODO: Write a few-shot prompt. Give 2 examples of reviews
        //   labeled POSITIVE or NEGATIVE, then a third review with
        //   "Sentiment:" left blank for Claude to fill in.
        content: `Classify the sentiment as POSITIVE or NEGATIVE.

Review: "This movie was amazing!"
Sentiment: POSITIVE

Review: "____"
Sentiment: ____

Review: "Best pizza I've ever had!"
Sentiment:`,
      },
    ],
  });

  const reply = res.content[0].type === "text" ? res.content[0].text : "";
  console.log(reply.trim());
}

main();
