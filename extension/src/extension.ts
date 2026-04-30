import * as vscode from "vscode";
import { handleAtddCycleRequest } from "./participants/atddCycle";
import { handleFullAutonomousCycleRequest } from "./participants/fullAutonomousCycle";
import { handleSpecWriterRequest } from "./participants/specWriter";
import { handleSpecReviewerRequest } from "./participants/specReviewer";

export function activate(context: vscode.ExtensionContext): void {
  // @atdd-cycle — supervised full cycle with 9 slash commands
  const atddCycle = vscode.chat.createChatParticipant(
    "atdd.cycle",
    handleAtddCycleRequest,
  );
  atddCycle.iconPath = new vscode.ThemeIcon("beaker");

  // @full-autonomous-cycle — hands-off cycle, one human gate
  const fullCycle = vscode.chat.createChatParticipant(
    "atdd.fullCycle",
    handleFullAutonomousCycleRequest,
  );
  fullCycle.iconPath = new vscode.ThemeIcon("rocket");

  // @spec-writer — spec creation specialist
  const specWriter = vscode.chat.createChatParticipant(
    "atdd.specWriter",
    handleSpecWriterRequest,
  );
  specWriter.iconPath = new vscode.ThemeIcon("edit");

  // @spec-reviewer — read-only compliance reviewer
  const specReviewer = vscode.chat.createChatParticipant(
    "atdd.specReviewer",
    handleSpecReviewerRequest,
  );
  specReviewer.iconPath = new vscode.ThemeIcon("eye");

  context.subscriptions.push(atddCycle, fullCycle, specWriter, specReviewer);
}

export function deactivate(): void {
  // Nothing to clean up — disposables are handled via context.subscriptions
}
