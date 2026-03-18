export type EmbeddingVector = readonly number[];
export interface PdfPageText {
    readonly pageNumber: number;
    readonly text: string;
}
export interface PageChunk {
    readonly filename: string;
    readonly page: number;
    readonly text: string;
}
export interface IndexedPageChunk extends PageChunk {
    readonly vector: EmbeddingVector;
}
export interface RankedChunk {
    readonly filename: string;
    readonly page: number;
    readonly score: number;
}
export interface IndexCommandInput {
    readonly filePath: string;
}
export interface QueryCommandInput {
    readonly filePath: string;
    readonly question: string;
    readonly top: number;
}
export interface QueryRankingInput {
    readonly questionVector: EmbeddingVector;
    readonly indexedChunks: readonly IndexedPageChunk[];
    readonly top: number;
}
