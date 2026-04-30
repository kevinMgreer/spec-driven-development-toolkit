import * as vscode from "vscode";
import { buildWorkspaceTools } from "../tools/workspaceTools";
import { buildTerminalTool } from "../tools/terminalTool";
import { runToolLoop } from "../lm/toolLoop";
import { buildSystemPrompt } from "../prompts/systemPrompts";
import type { WorkspaceTool } from "../tools/types";

/** Preferred model family, in priority order */
const MODEL_SELECTORS: vscode.LanguageModelChatSelector[] = [
  { vendor: "copilot", family: "gpt-4.1" },
  { vendor: "copilot", family: "gpt-4o" },
  { vendor: "copilot", family: "claude-sonnet-4-5" },
  { vendor: "copilot", family: "claude-3.5-sonnet" },
];

/**
 * Resolve a language model from the available Copilot models.
 * Tries selectors in priority order and falls back to any available model.
 */
export async function resolveModel(): Promise<
  vscode.LanguageModelChat | undefined
> {
  for (const selector of MODEL_SELECTORS) {
    const models = await vscode.lm.selectChatModels(selector);
    if (models.length > 0) {
      return models[0];
    }
  }
  // Fall back to any available model
  const allModels = await vscode.lm.selectChatModels({});
  return allModels.length > 0 ? allModels[0] : undefined;
}

/**
 * Get the workspace root path, or undefined if no folder is open.
 */
export function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

/**
 * Build the full set of workspace tools for a given root.
 */
export function buildAllTools(workspaceRoot: string): WorkspaceTool[] {
  return [
    ...buildWorkspaceTools(workspaceRoot),
    buildTerminalTool(workspaceRoot),
  ];
}

/**
 * Core handler shared by all participants.
 * Resolves the model, builds tools, constructs messages, runs the tool loop.
 */
export async function runParticipant(
  participant:
    | "atdd-cycle"
    | "full-autonomous-cycle"
    | "spec-writer"
    | "spec-reviewer",
  request: vscode.ChatRequest,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    stream.markdown(
      "**No workspace folder is open.**\n\n" +
        "Please open your project folder in VS Code first, then try again.\n" +
        "`File → Open Folder...`",
    );
    return {};
  }

  const model = await resolveModel();
  if (!model) {
    stream.markdown(
      "**No Copilot language model is available.**\n\n" +
        "Please ensure:\n" +
        "1. The [GitHub Copilot Chat](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat) extension is installed\n" +
        "2. You are signed in to GitHub Copilot\n" +
        "3. Your Copilot subscription is active",
    );
    return {};
  }

  const systemPrompt = buildSystemPrompt(participant, request.command);
  const userMessage =
    request.prompt.trim() || getDefaultMessage(participant, request.command);
  const tools = buildAllTools(workspaceRoot);

  const messages: vscode.LanguageModelChatMessage[] = [
    vscode.LanguageModelChatMessage.User(systemPrompt),
    vscode.LanguageModelChatMessage.User(userMessage),
  ];

  await runToolLoop(model, messages, tools, stream, token);

  return {};
}

function getDefaultMessage(
  participant: string,
  command: string | undefined,
): string {
  if (command) {
    const defaults: Record<string, string> = {
      analyze: "Analyze this project and write docs/project-profile.md.",
      spec: "Please describe the feature you want to spec out.",
      tests:
        "Generate failing acceptance test stubs for the current feature spec.",
      implement:
        "Implement the production code to make the failing tests pass.",
      gates: "Run all available quality gates.",
      refactor: "Safely refactor the implementation with all tests green.",
      verify:
        "Run the Spec & Doc Sync hard gate — verify coverage and repair any drift.",
      pr: "Create a pull request for the completed feature.",
      review: "Address the open PR review comments.",
    };
    return defaults[command] ?? `Run the ${command} phase of the ATDD cycle.`;
  }

  const defaults: Record<string, string> = {
    "atdd-cycle":
      "Start the ATDD cycle. Please describe the feature or requirement to implement.",
    "full-autonomous-cycle":
      "Start the full autonomous ATDD cycle. Please describe the feature or requirement to implement.",
    "spec-writer":
      "Please describe the feature or paste the requirements you want specced out.",
    "spec-reviewer":
      "Review the spec and implementation for the current feature.",
  };
  return defaults[participant] ?? "Please describe what you need.";
}
