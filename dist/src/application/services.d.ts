import type { EmbeddingGenerator, PdfTextExtractor } from "../domain/ports.js";
import type { IndexCommandInput, IndexedPageChunk, QueryCommandInput, RankedChunk } from "../domain/types.js";
interface ApplicationDependencies {
    readonly pdfTextExtractor: PdfTextExtractor;
    readonly embeddingGenerator: EmbeddingGenerator;
}
export interface IndexPdfResult {
    readonly filename: string;
    readonly pageCount: number;
    readonly indexedChunks: readonly IndexedPageChunk[];
}
export interface QueryPdfResult {
    readonly filename: string;
    readonly question: string;
    readonly results: readonly RankedChunk[];
}
export declare const indexPdf: (input: IndexCommandInput, dependencies: ApplicationDependencies) => Promise<IndexPdfResult>;
export declare const queryPdf: (input: QueryCommandInput, dependencies: ApplicationDependencies) => Promise<QueryPdfResult>;
export {};
