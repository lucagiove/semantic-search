import type { QueryRankingInput, RankedChunk } from "./types.js";
export declare const cosineSimilarity: (left: readonly number[], right: readonly number[]) => number;
export declare const rankChunks: (input: QueryRankingInput) => readonly RankedChunk[];
