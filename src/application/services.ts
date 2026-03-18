import { basename } from "node:path";

import { createPageChunks } from "../domain/chunks.js";
import { CliError } from "../domain/errors.js";
import type { EmbeddingGenerator, PdfTextExtractor } from "../domain/ports.js";
import { rankChunks } from "../domain/ranking.js";
import type {
  IndexCommandInput,
  IndexedPageChunk,
  QueryCommandInput,
  RankedChunk
} from "../domain/types.js";

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

export const indexPdf = async (
  input: IndexCommandInput,
  dependencies: ApplicationDependencies
): Promise<IndexPdfResult> => {
  const filePath = validateFilePath(input.filePath);
  const pages = await dependencies.pdfTextExtractor.extractPages(filePath);
  const chunks = createPageChunks(filePath, pages);

  if (chunks.length === 0) {
    return {
      filename: basename(filePath),
      pageCount: 0,
      indexedChunks: []
    };
  }

  const vectors = await dependencies.embeddingGenerator.embedTexts(
    chunks.map((chunk) => chunk.text)
  );

  if (vectors.length !== chunks.length) {
    throw new CliError(
      "EMBEDDING_FAILED",
      "Embedding generator returned an unexpected number of vectors."
    );
  }

  return {
    filename: basename(filePath),
    pageCount: chunks.length,
    indexedChunks: chunks.map((chunk, index) => ({
      ...chunk,
      vector: vectors[index] ?? raiseMissingVectorError()
    }))
  };
};

export const queryPdf = async (
  input: QueryCommandInput,
  dependencies: ApplicationDependencies
): Promise<QueryPdfResult> => {
  const question = validateQuestion(input.question);
  const top = validateTop(input.top);
  const indexed = await indexPdf({ filePath: input.filePath }, dependencies);
  const questionVector = await dependencies.embeddingGenerator.embedText(question);

  return {
    filename: indexed.filename,
    question,
    results: rankChunks({
      questionVector,
      indexedChunks: indexed.indexedChunks,
      top
    })
  };
};

const validateFilePath = (filePath: string): string => {
  const trimmedPath = filePath.trim();

  if (trimmedPath.length === 0) {
    throw new CliError("FILE_NOT_FOUND", "A PDF file path is required.");
  }

  return trimmedPath;
};

const validateQuestion = (question: string): string => {
  const trimmedQuestion = question.trim();

  if (trimmedQuestion.length === 0) {
    throw new CliError("EMPTY_QUESTION", "The --question value must not be empty.");
  }

  return trimmedQuestion;
};

const validateTop = (top: number): number => {
  if (!Number.isInteger(top) || top <= 0) {
    throw new CliError("INVALID_TOP_VALUE", "The --top value must be a positive integer.");
  }

  return top;
};

const raiseMissingVectorError = (): never => {
  throw new CliError(
    "EMBEDDING_FAILED",
    "Embedding generator returned an unexpected number of vectors."
  );
};
