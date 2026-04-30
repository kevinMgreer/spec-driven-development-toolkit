import * as vscode from "vscode";
import { runParticipant } from "./shared";

/**
 * Handler for the @spec-reviewer chat participant.
 *
 * Performs read-only compliance reviews:
 *   - Scenario coverage (test exists, tests behavior, would catch regression)
 *   - Business rule enforcement
 *   - Undocumented behavior audit
 *   - README drift
 *   - docs/project-profile.md drift
 *
 * Never modifies files — only produces a compliance report.
 */
export async function handleSpecReviewerRequest(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  return runParticipant("spec-reviewer", request, stream, token);
}
