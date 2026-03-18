import type { QueryRankingInput, RankedChunk } from "./types.js";

export const cosineSimilarity = (
  _left: readonly number[],
  _right: readonly number[]
): number => {
  throw new Error("Not implemented yet.");
};

export const rankChunks = (_input: QueryRankingInput): readonly RankedChunk[] => {
  throw new Error("Not implemented yet.");
};
