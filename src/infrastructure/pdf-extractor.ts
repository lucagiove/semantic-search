import { readFile } from "node:fs/promises";

import pdfParse from "pdf-parse";

import { CliError } from "../domain/errors.js";
import type { PdfTextExtractor } from "../domain/ports.js";
import type { PdfPageText } from "../domain/types.js";

interface TextItem {
  readonly str?: string;
  readonly transform?: readonly number[];
}

interface PageTextContent {
  readonly items: readonly TextItem[];
}

interface PageDataLike {
  getTextContent(options: {
    normalizeWhitespace: boolean;
    disableCombineTextItems: boolean;
  }): Promise<PageTextContent>;
}

interface PdfParseResult {
  readonly numpages: number;
}

interface PdfParseOptions {
  pagerender?: (pageData: PageDataLike) => Promise<string>;
}

type PdfParseFunction = (
  dataBuffer: Buffer,
  options?: PdfParseOptions
) => Promise<PdfParseResult>;

interface PdfTextExtractorDependencies {
  readonly readFile?: (filePath: string) => Promise<Buffer>;
  readonly parsePdf?: PdfParseFunction;
}

export class PdfParseTextExtractor implements PdfTextExtractor {
  private readonly readFileDependency: (filePath: string) => Promise<Buffer>;
  private readonly parsePdfDependency: PdfParseFunction;

  public constructor(dependencies: PdfTextExtractorDependencies = {}) {
    this.readFileDependency =
      dependencies.readFile ?? ((filePath: string) => readFile(filePath));
    this.parsePdfDependency = dependencies.parsePdf ?? (pdfParse as PdfParseFunction);
  }

  public async extractPages(filePath: string): Promise<readonly PdfPageText[]> {
    const pageTexts: PdfPageText[] = [];

    let fileBuffer: Buffer;

    try {
      fileBuffer = await this.readFileDependency(filePath);
    } catch (error) {
      throw mapReadError(filePath, error);
    }

    try {
      await this.parsePdfDependency(fileBuffer, {
        pagerender: async (pageData) => {
          const text = await extractTextFromPage(pageData);

          pageTexts.push({
            pageNumber: pageTexts.length + 1,
            text
          });

          return text;
        }
      });
    } catch (error) {
      throw new CliError(
        "PDF_EXTRACTION_FAILED",
        `Failed to extract text from PDF: ${filePath}`,
        { cause: error }
      );
    }

    return pageTexts;
  }
}

export const extractTextFromPage = async (pageData: PageDataLike): Promise<string> => {
  const textContent = await pageData.getTextContent({
    normalizeWhitespace: false,
    disableCombineTextItems: false
  });

  let text = "";
  let lastY: number | undefined;

  for (const item of textContent.items) {
    const currentY = item.transform?.[5];
    const currentText = item.str ?? "";

    if (lastY === undefined || currentY === lastY) {
      text += currentText;
    } else {
      text += `\n${currentText}`;
    }

    lastY = currentY;
  }

  return text;
};

const mapReadError = (filePath: string, error: unknown): CliError => {
  if (isNodeError(error) && error.code === "ENOENT") {
    return new CliError("FILE_NOT_FOUND", `PDF file not found: ${filePath}`, {
      cause: error
    });
  }

  return new CliError(
    "PDF_EXTRACTION_FAILED",
    `Failed to read PDF file: ${filePath}`,
    { cause: error }
  );
};

const isNodeError = (error: unknown): error is NodeJS.ErrnoException => {
  return error instanceof Error;
};
