import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// Goal: get JSON out of Claude that our code can use.
async function main() {
  const res = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    // TODO 1: Write a system prompt that tells Claude to respond with
    //   ONLY valid JSON (no extra text) in this shape:
    //   { "title": string, "date": string, "location": string }
    // system: "...",
    messages: [
      { role: "user", content: "Team dinner at Sevan Restaurant next Friday at 7pm" },
    ],
  });

  const text = res.content[0].type === "text" ? res.content[0].text : "";

  // TODO 2: Parse the JSON with JSON.parse(text) inside a try/catch,
  //   then print data.title, data.date, data.location.
  //   (try/catch matters — if Claude adds extra text, parsing fails)
}

main();
