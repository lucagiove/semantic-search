import { describe, expect, it } from "vitest";
import { CliError } from "../../src/domain/errors.js";
import { extractTextFromPage, PdfParseTextExtractor } from "../../src/infrastructure/pdf-extractor.js";
describe("extractTextFromPage", () => {
    it("joins text items on the same line and inserts newlines for line breaks", async () => {
        const pageText = await extractTextFromPage({
            async getTextContent() {
                return {
                    items: [
                        { str: "Hello", transform: [0, 0, 0, 0, 0, 10] },
                        { str: " world", transform: [0, 0, 0, 0, 0, 10] },
                        { str: "Next", transform: [0, 0, 0, 0, 0, 20] }
                    ]
                };
            }
        });
        expect(pageText).toBe("Hello world\nNext");
    });
});
describe("PdfParseTextExtractor", () => {
    it("extracts one PdfPageText entry per page", async () => {
        const extractor = new PdfParseTextExtractor({
            async readFile() {
                return Buffer.from("pdf");
            },
            async parsePdf(_buffer, options) {
                await options?.pagerender?.({
                    async getTextContent() {
                        return {
                            items: [{ str: "Page 1", transform: [0, 0, 0, 0, 0, 1] }]
                        };
                    }
                });
                await options?.pagerender?.({
                    async getTextContent() {
                        return {
                            items: [{ str: "Page 2", transform: [0, 0, 0, 0, 0, 1] }]
                        };
                    }
                });
                return { numpages: 2 };
            }
        });
        await expect(extractor.extractPages("docs/report.pdf")).resolves.toEqual([
            { pageNumber: 1, text: "Page 1" },
            { pageNumber: 2, text: "Page 2" }
        ]);
    });
    it("maps missing files to a FILE_NOT_FOUND error", async () => {
        const extractor = new PdfParseTextExtractor({
            async readFile() {
                const error = new Error("missing");
                error.code = "ENOENT";
                throw error;
            }
        });
        await expect(extractor.extractPages("docs/missing.pdf")).rejects.toEqual(new CliError("FILE_NOT_FOUND", "PDF file not found: docs/missing.pdf", {
            cause: expect.any(Error)
        }));
    });
    it("maps parse failures to a PDF_EXTRACTION_FAILED error", async () => {
        const extractor = new PdfParseTextExtractor({
            async readFile() {
                return Buffer.from("pdf");
            },
            async parsePdf() {
                throw new Error("parse failed");
            }
        });
        await expect(extractor.extractPages("docs/report.pdf")).rejects.toMatchObject({
            code: "PDF_EXTRACTION_FAILED",
            message: "Failed to extract text from PDF: docs/report.pdf"
        });
    });
});
//# sourceMappingURL=pdf-extractor.test.js.map