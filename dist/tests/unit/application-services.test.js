import { describe, expect, it } from "vitest";
import { CliError } from "../../src/domain/errors.js";
import { indexPdf, queryPdf } from "../../src/application/services.js";
class FakePdfTextExtractor {
    pages;
    constructor(pages) {
        this.pages = pages;
    }
    async extractPages(_filePath) {
        return this.pages;
    }
}
class FakeEmbeddingGenerator {
    vectorsByText;
    constructor(vectorsByText) {
        this.vectorsByText = vectorsByText;
    }
    async embedText(text) {
        const vector = this.vectorsByText.get(text);
        if (vector === undefined) {
            throw new Error(`Missing vector for text: ${text}`);
        }
        return vector;
    }
    async embedTexts(texts) {
        return texts.map((text) => {
            const vector = this.vectorsByText.get(text);
            if (vector === undefined) {
                throw new Error(`Missing vector for text: ${text}`);
            }
            return vector;
        });
    }
}
describe("indexPdf", () => {
    it("extracts pages, skips empty ones, and returns indexed chunks", async () => {
        const extractor = new FakePdfTextExtractor([
            { pageNumber: 1, text: "Overview" },
            { pageNumber: 2, text: "   " },
            { pageNumber: 3, text: "Details" }
        ]);
        const embeddings = new FakeEmbeddingGenerator(new Map([
            ["Overview", [1, 0]],
            ["Details", [0, 1]]
        ]));
        const result = await indexPdf({ filePath: "docs/report.pdf" }, { pdfTextExtractor: extractor, embeddingGenerator: embeddings });
        expect(result).toEqual({
            filename: "report.pdf",
            indexedChunks: [
                {
                    filename: "report.pdf",
                    page: 1,
                    text: "Overview",
                    vector: [1, 0]
                },
                {
                    filename: "report.pdf",
                    page: 3,
                    text: "Details",
                    vector: [0, 1]
                }
            ],
            pageCount: 2
        });
    });
    it("rejects empty file paths", async () => {
        const extractor = new FakePdfTextExtractor([]);
        const embeddings = new FakeEmbeddingGenerator(new Map());
        await expect(indexPdf({ filePath: "   " }, { pdfTextExtractor: extractor, embeddingGenerator: embeddings })).rejects.toEqual(new CliError("FILE_NOT_FOUND", "A PDF file path is required."));
    });
});
describe("queryPdf", () => {
    it("indexes the PDF, embeds the question, and returns ranked results", async () => {
        const extractor = new FakePdfTextExtractor([
            { pageNumber: 1, text: "Overview" },
            { pageNumber: 2, text: "Attention" },
            { pageNumber: 3, text: "Appendix" }
        ]);
        const embeddings = new FakeEmbeddingGenerator(new Map([
            ["Overview", [0, 1]],
            ["Attention", [1, 0]],
            ["Appendix", [0.8, 0.2]],
            ["What attention mechanism is proposed?", [1, 0]]
        ]));
        const result = await queryPdf({
            filePath: "docs/report.pdf",
            question: "What attention mechanism is proposed?",
            top: 2
        }, { pdfTextExtractor: extractor, embeddingGenerator: embeddings });
        expect(result).toEqual({
            filename: "report.pdf",
            question: "What attention mechanism is proposed?",
            results: [
                {
                    filename: "report.pdf",
                    page: 2,
                    score: 1
                },
                {
                    filename: "report.pdf",
                    page: 3,
                    score: expect.closeTo(0.9701425001, 10)
                }
            ]
        });
    });
    it("rejects an empty question", async () => {
        const extractor = new FakePdfTextExtractor([]);
        const embeddings = new FakeEmbeddingGenerator(new Map());
        await expect(queryPdf({ filePath: "docs/report.pdf", question: "   ", top: 5 }, { pdfTextExtractor: extractor, embeddingGenerator: embeddings })).rejects.toEqual(new CliError("EMPTY_QUESTION", "The --question value must not be empty."));
    });
    it("rejects non-positive top values", async () => {
        const extractor = new FakePdfTextExtractor([]);
        const embeddings = new FakeEmbeddingGenerator(new Map());
        await expect(queryPdf({ filePath: "docs/report.pdf", question: "hello", top: 0 }, { pdfTextExtractor: extractor, embeddingGenerator: embeddings })).rejects.toEqual(new CliError("INVALID_TOP_VALUE", "The --top value must be a positive integer."));
    });
});
//# sourceMappingURL=application-services.test.js.map