import { ClaudeAnalyzer } from "./claude-analyzer";
import { MockAnalyzer } from "./mock-analyzer";
import type { DocumentAnalyzer } from "./types";

export function getAnalyzer(): DocumentAnalyzer {
  if (process.env.AI_PROVIDER === "claude") {
    return new ClaudeAnalyzer();
  }
  return new MockAnalyzer();
}

export type { AnalysisInput, AnalysisResult, DocumentAnalyzer } from "./types";
