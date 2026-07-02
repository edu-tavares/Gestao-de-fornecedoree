import type { AnalysisInput, AnalysisResult, DocumentAnalyzer } from "./types";

/**
 * Integração futura com IA real (ex: Claude com visão). Para implementar:
 * 1. Ler o arquivo em `input.filePath` (relativo a storage/uploads) e
 *    codificar em base64.
 * 2. Chamar a API da Anthropic (`messages.create`) com o documento como
 *    conteúdo de imagem/PDF e um prompt estruturado pedindo status
 *    (APPROVED/REJECTED/NEEDS_REVIEW), notas e confiança.
 * 3. Mapear a resposta para `AnalysisResult`.
 *
 * Até lá, ativar AI_PROVIDER=claude falha alto (em vez de se comportar
 * incorretamente) para deixar claro que a integração real ainda não existe.
 */
export class ClaudeAnalyzer implements DocumentAnalyzer {
  async analyzeDocument(_input: AnalysisInput): Promise<AnalysisResult> {
    throw new Error("ClaudeAnalyzer not implemented yet");
  }
}
