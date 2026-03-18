export type { EmbeddingVector, IndexCommandInput, IndexedPageChunk, PageChunk, PdfPageText, QueryCommandInput, QueryRankingInput, RankedChunk } from "./types.js";
export type { EmbeddingGenerator, PdfTextExtractor } from "./ports.js";
export { CliError, cliErrorCodes, mapErrorToCliFailure } from "./errors.js";
export { cosineSimilarity, rankChunks } from "./ranking.js";
