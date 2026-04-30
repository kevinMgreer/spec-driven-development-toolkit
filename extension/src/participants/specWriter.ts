import * as vscode from "vscode";
import { runParticipant } from "./shared";

/**
 * Handler for the @spec-writer chat participant.
 *
 * Produces:
 *   1. specs/features/<name>.feature  — Gherkin feature file
 *   2. specs/technical/<name>-spec.md — paired technical spec
 *
 * Never writes implementation code or test code.
 * Always awaits explicit user approval before reporting done.
 */
export async function handleSpecWriterRequest(
  request: vscode.ChatRequest,
  _context: vscode.ChatContext,
  stream: vscode.ChatResponseStream,
  token: vscode.CancellationToken,
): Promise<vscode.ChatResult> {
  return runParticipant("spec-writer", request, stream, token);
}
