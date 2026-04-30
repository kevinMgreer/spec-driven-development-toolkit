import * as vscode from "vscode";
import { runParticipant } from "./shared";

/**
 * Handler for the @atdd-cycle chat participant.
 *
 * Runs the complete supervised ATDD cycle:
 *   Analyze → Spec [HUMAN GATE] → Tests → Implement → Quality Gates → Refactor → Verify → PR
 *
 * Slash commands:
 *   /analyze  → Phase 0: project analysis
 *   /spec     → Phase 1: write spec (awaits approval)
 *   /tests    → Phase 2: generate failing stubs
 *   /implement→ Phase 3: implement to green
 *   /gates    → Phase 4: quality gates
 *   /refactor → Phase 5: safe refactor
 *   /verify   → Phase 6: spec & doc sync
 *   /pr       → Phase 7: create PR
 *   /review   → Address PR review comments
 */
export async function handleAtddCycleRequest(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  return runParticipant("atdd-cycle", request, stream, token);
}
