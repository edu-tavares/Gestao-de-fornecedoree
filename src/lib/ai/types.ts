import type { AiAnalysisStatus, DocumentType } from "@/generated/prisma/enums";

export interface AnalysisInput {
  filePath: string;
  documentType: DocumentType;
  mimeType: string;
  fileSizeBytes: number;
}

export interface AnalysisResult {
  status: AiAnalysisStatus;
  notes: string;
  confidence: number;
}

export interface DocumentAnalyzer {
  analyzeDocument(input: AnalysisInput): Promise<AnalysisResult>;
}
