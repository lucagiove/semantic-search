import { basename } from "node:path";

import type { PageChunk, PdfPageText } from "./types.js";

export const createPageChunks = (
  filePath: string,
  pages: readonly PdfPageText[]
): readonly PageChunk[] => {
  const filename = basename(filePath);

  return pages.flatMap((page) => {
    const text = page.text.trim();

    if (text.length === 0) {
      return [];
    }

    return [
      {
        filename,
        page: page.pageNumber,
        text
      }
    ];
  });
};
