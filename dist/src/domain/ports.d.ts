import type { EmbeddingVector, PdfPageText } from "./types.js";
export interface PdfTextExtractor {
    extractPages(filePath: string): Promise<readonly PdfPageText[]>;
}
export interface EmbeddingGenerator {
    embedText(text: string): Promise<EmbeddingVector>;
    embedTexts(texts: readonly string[]): Promise<readonly EmbeddingVector[]>;
}
