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
type PdfParseFunction = (dataBuffer: Buffer, options?: PdfParseOptions) => Promise<PdfParseResult>;
interface PdfTextExtractorDependencies {
    readonly readFile?: (filePath: string) => Promise<Buffer>;
    readonly parsePdf?: PdfParseFunction;
}
export declare class PdfParseTextExtractor implements PdfTextExtractor {
    private readonly readFileDependency;
    private readonly parsePdfDependency;
    constructor(dependencies?: PdfTextExtractorDependencies);
    extractPages(filePath: string): Promise<readonly PdfPageText[]>;
}
export declare const extractTextFromPage: (pageData: PageDataLike) => Promise<string>;
export {};
