import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

// ============================================================
// STEP 1: DESCRIBE the tool to Claude (the "definition").
// ============================================================
const calculatorTool: Anthropic.Tool = {
  name: "calculator",
  // TODO 1: Write a clear description of WHEN Claude should use this.
  description: "TODO: describe the calculator tool",
  input_schema: {
    type: "object",
    properties: {
      // TODO 2: Describe the inputs: a (number), b (number),
      //   and operation (string, one of add/subtract/multiply/divide).
    },
    required: [], // TODO 3: list the required inputs
  },
};

// ============================================================
// STEP 2: WRITE the real function that actually runs.
// The definition above is what Claude SEES.
// This function is what your CODE runs.
// ============================================================
function runCalculator(input: any): number {
  const { a, b, operation } = input;
  // TODO 4: return the right result for each operation
  //   (add, subtract, multiply, divide)
  return 0;
}

// ============================================================
// STEP 3 & 4: WIRE it together and SEND THE RESULT BACK.
// ============================================================
async function main() {
  const messages: Anthropic.MessageParam[] = [
    { role: "user", content: "What is 1847 * 293?" },
  ];

  // TODO 5: Call the API with tools: [calculatorTool].

  // TODO 6: If res.stop_reason === "tool_use", find the tool_use block,
  //   run runCalculator on its input, then push BOTH the assistant
  //   message AND a tool_result back into messages.

  // TODO 7: Call the API again so Claude can give a natural-language
  //   answer using the result, and print it.
}

main();
