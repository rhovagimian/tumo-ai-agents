import Anthropic from "@anthropic-ai/sdk";
import { allTools, runTool } from "./tools";

const client = new Anthropic();

// The SAME agent loop you built in Day 4. The only new thing is a
// smarter system prompt that tells Claude to PLAN before it acts.

// TODO 1: Write a planning system prompt. Tell Claude to:
//   1) briefly outline its plan, 2) use tools one step at a time,
//   3) decide the next step after each result, 4) give a clear answer.
const SYSTEM = `TODO: your planning system prompt`;

async function runAgent(userMessage: string, maxTurns = 10): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: userMessage },
  ];
  let turns = 0;

  while (turns < maxTurns) {
    turns++;
    // TODO 2: same safe agent loop as Day 4, but pass system: SYSTEM
    //   in the client.messages.create call.
    break; // <-- remove once your loop works
  }
  return "Stopped: hit the max turn limit.";
}

async function main() {
  const answer = await runAgent(
    "I have a math test (12*8 questions) and need the total, plus tell me " +
      "the weather in Yerevan so I know if I can study outside."
  );
  console.log(answer);
}

main();
