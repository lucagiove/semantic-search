import { readFile } from "node:fs/promises";
import pdfParse from "pdf-parse";
import { CliError } from "../domain/errors.js";
export class PdfParseTextExtractor {
    readFileDependency;
    parsePdfDependency;
    constructor(dependencies = {}) {
        this.readFileDependency =
            dependencies.readFile ?? ((filePath) => readFile(filePath));
        this.parsePdfDependency = dependencies.parsePdf ?? pdfParse;
    }
    async extractPages(filePath) {
        const pageTexts = [];
        let fileBuffer;
        try {
            fileBuffer = await this.readFileDependency(filePath);
        }
        catch (error) {
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
        }
        catch (error) {
            throw new CliError("PDF_EXTRACTION_FAILED", `Failed to extract text from PDF: ${filePath}`, { cause: error });
        }
        return pageTexts;
    }
}
export const extractTextFromPage = async (pageData) => {
    const textContent = await pageData.getTextContent({
        normalizeWhitespace: false,
        disableCombineTextItems: false
    });
    let text = "";
    let lastY;
    for (const item of textContent.items) {
        const currentY = item.transform?.[5];
        const currentText = item.str ?? "";
        if (lastY === undefined || currentY === lastY) {
            text += currentText;
        }
        else {
            text += `\n${currentText}`;
        }
        lastY = currentY;
    }
    return text;
};
const mapReadError = (filePath, error) => {
    if (isNodeError(error) && error.code === "ENOENT") {
        return new CliError("FILE_NOT_FOUND", `PDF file not found: ${filePath}`, {
            cause: error
        });
    }
    return new CliError("PDF_EXTRACTION_FAILED", `Failed to read PDF file: ${filePath}`, { cause: error });
};
const isNodeError = (error) => {
    return error instanceof Error;
};
//# sourceMappingURL=pdf-extractor.js.map