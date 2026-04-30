import * as vscode from "vscode";
import type { WorkspaceTool } from "../tools/types";

/** Maximum tool-calling iterations before giving up (prevents infinite loops) */
const MAX_ITERATIONS = 100;

/**
 * Run an agentic LM tool-calling loop until the model stops issuing tool calls
 * or the cancellation token fires.
 *
 * The loop:
 *  1. Sends the current message history to the LM (with tools enabled)
 *  2. Streams text parts to the chat response stream
 *  3. Collects tool-call parts
 *  4. Executes each tool call sequentially
 *  5. Appends the assistant turn + tool results to the message history
 *  6. Repeats until the model emits no tool calls
 *
 * @param model     A resolved LanguageModelChat (from vscode.lm.selectChatModels)
 * @param messages  Starting message history (system prompt as first User message, then user request)
 * @param tools     Workspace tool definitions with their execute() implementations
 * @param stream    The chat response stream to write text and progress updates to
 * @param token     Cancellation token from the chat request
 */
export async function runToolLoop(
  model: vscode.LanguageModelChat,
  messages: vscode.LanguageModelChatMessage[],
  tools: WorkspaceTool[],
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<void> {
  const toolDefs: vscode.LanguageModelChatTool[] = tools.map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.schema,
  }));

  const toolMap = new Map<string, WorkspaceTool>(tools.map((t) => [t.name, t]));

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    if (token.isCancellationRequested) {
      break;
    }

    let response: vscode.LanguageModelChatResponse;
    try {
      response = await model.sendRequest(
        messages,
        {
          tools: toolDefs,
          toolMode: vscode.LanguageModelChatToolMode.Auto,
        },
        token,
      );
    } catch (err) {
      if (err instanceof vscode.CancellationError) {
        break;
      }
      const msg = err instanceof Error ? err.message : String(err);
      stream.markdown(
        `\n\n> **Error communicating with the language model:** ${msg}\n`,
      );
      break;
    }

    // Collect text and tool-call parts from the response stream
    const assistantContent: (
      | vscode.LanguageModelTextPart
      | vscode.LanguageModelToolCallPart
    )[] = [];
    const toolCalls: vscode.LanguageModelToolCallPart[] = [];

    for await (const part of response.stream) {
      if (token.isCancellationRequested) {
        break;
      }
      if (part instanceof vscode.LanguageModelTextPart) {
        stream.markdown(part.value);
        assistantContent.push(part);
      } else if (part instanceof vscode.LanguageModelToolCallPart) {
        assistantContent.push(part);
        toolCalls.push(part);
      }
    }

    // No tool calls → the model is done
    if (toolCalls.length === 0) {
      break;
    }

    // Record the assistant's turn (text + tool calls) in the history
    messages.push(vscode.LanguageModelChatMessage.Assistant(assistantContent));

    // Execute each tool call and collect results
    const toolResultParts: vscode.LanguageModelToolResultPart[] = [];

    for (const toolCall of toolCalls) {
      if (token.isCancellationRequested) {
        break;
      }

      // Show progress in the chat UI
      stream.progress(`${toolCall.name}(${formatInput(toolCall.input)})`);

      const tool = toolMap.get(toolCall.name);
      let resultText: string;

      if (!tool) {
        resultText = `Error: Unknown tool "${toolCall.name}". Available tools: ${[...toolMap.keys()].join(", ")}`;
      } else {
        try {
          resultText = await tool.execute(toolCall.input);
        } catch (err) {
          resultText = `Error executing tool "${toolCall.name}": ${err instanceof Error ? err.message : String(err)}`;
        }
      }

      toolResultParts.push(
        new vscode.LanguageModelToolResultPart(toolCall.callId, [
          new vscode.LanguageModelTextPart(resultText),
        ]),
      );
    }

    // Add tool results as a User message so the model can continue
    messages.push(vscode.LanguageModelChatMessage.User(toolResultParts));
  }
}

/** Format tool input for the progress indicator (kept short for the UI) */
function formatInput(input: unknown): string {
  const json = JSON.stringify(input ?? {});
  return json.length > 80 ? json.slice(0, 80) + "…" : json;
}
