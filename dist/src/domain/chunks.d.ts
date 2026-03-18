import type { PageChunk, PdfPageText } from "./types.js";
export declare const createPageChunks: (filePath: string, pages: readonly PdfPageText[]) => readonly PageChunk[];
