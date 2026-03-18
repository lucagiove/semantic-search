declare module "pdf-parse" {
  interface PdfParseResult {
    readonly numpages: number;
  }

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

  interface PdfParseOptions {
    pagerender?: (pageData: PageDataLike) => Promise<string>;
  }

  export default function pdfParse(
    dataBuffer: Buffer,
    options?: PdfParseOptions
  ): Promise<PdfParseResult>;
}
