import type { QueryRankingInput, RankedChunk } from "./types.js";
export declare const cosineSimilarity: (_left: readonly number[], _right: readonly number[]) => number;
export declare const rankChunks: (_input: QueryRankingInput) => readonly RankedChunk[];
