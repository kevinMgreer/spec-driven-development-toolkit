import * as vscode from "vscode";
import { runParticipant } from "./shared";

/**
 * Handler for the @full-autonomous-cycle chat participant.
 *
 * Runs the complete ATDD cycle autonomously with ONE human gate (spec approval).
 * After spec approval: implements, runs quality gates, creates PR, requests Copilot review,
 * and addresses review comments — all without further user intervention.
 */
export async function handleFullAutonomousCycleRequest(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  return runParticipant("full-autonomous-cycle", request, stream, token);
}
