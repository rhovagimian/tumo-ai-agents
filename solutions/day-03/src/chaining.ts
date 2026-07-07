import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// CHAINING — sometimes Claude needs the OUTPUT of one tool as the
// INPUT to the next. Here it must first look up WHERE someone lives,
// THEN get the weather for that city.
//
// The trick: a small WHILE loop. Keep running whatever tools Claude
// asks for and sending the results back, until it stops asking.
// ============================================================

// ---- Tool 1: Look up where a person lives (mock) ----
const userLocationTool: Anthropic.Tool = {
  name: "get_user_location",
  description: "Finds which city a person lives in, by their name.",
  input_schema: {
    type: "object",
    properties: { name: { type: "string" } },
    required: ["name"],
  },
};
function getUserLocation(input: any): string {
  const data: Record<string, string> = { Ani: "Yerevan", Davit: "London" };
  return data[input.name] || "Unknown";
}

// ---- Tool 2: Weather for a city (mock) ----
const weatherTool: Anthropic.Tool = {
  name: "get_weather",
  description: "The current weather for a city.",
  input_schema: {
    type: "object",
    properties: { city: { type: "string" } },
    required: ["city"],
  },
};
function getWeather(input: any): string {
  const data: Record<string, string> = { Yerevan: "28°C, sunny", London: "14°C, rainy" };
  return data[input.city] || "20°C, clear";
}

const tools = [userLocationTool, weatherTool];

async function main() {
  const messages: Anthropic.MessageParam[] = [
    // Claude must chain: get_user_location(Ani) -> "Yerevan" -> get_weather(Yerevan)
    { role: "user", content: "What's the weather where Ani lives?" },
  ];

  // Keep looping as long as Claude keeps asking for tools.
  while (true) {
    const res = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      tools,
      messages,
    });

    // No tool requested? Claude is done — print the final answer and stop.
    if (res.stop_reason !== "tool_use") {
      const text = res.content.find((c) => c.type === "text");
      console.log("\nFinal answer:", text && text.type === "text" ? text.text : "");
      break;
    }

    // Run every tool Claude asked for this round.
    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const toolUse of res.content) {
      if (toolUse.type !== "tool_use") continue;
      let result: string;
      if (toolUse.name === "get_user_location") result = getUserLocation(toolUse.input);
      else if (toolUse.name === "get_weather") result = getWeather(toolUse.input);
      else result = "Unknown tool";

      console.log(`Step: ${toolUse.name}(${JSON.stringify(toolUse.input)}) -> ${result}`);
      toolResults.push({ type: "tool_result", tool_use_id: toolUse.id, content: result });
    }

    // Feed the results back and loop again.
    messages.push({ role: "assistant", content: res.content });
    messages.push({ role: "user", content: toolResults });
  }
}

main();
