import { describe, expect, it } from "vitest";
import { cosineSimilarity, rankChunks } from "../../src/domain/ranking.js";
describe("cosineSimilarity", () => {
    it("returns 1 for identical vectors", () => {
        const score = cosineSimilarity([1, 2, 3], [1, 2, 3]);
        expect(score).toBeCloseTo(1, 10);
    });
    it("returns 0 for orthogonal vectors", () => {
        const score = cosineSimilarity([1, 0], [0, 1]);
        expect(score).toBeCloseTo(0, 10);
    });
});
describe("rankChunks", () => {
    it("sorts indexed chunks by descending similarity and limits to top-k", () => {
        const indexedChunks = [
            {
                filename: "report.pdf",
                page: 1,
                text: "introduction",
                vector: [0, 1]
            },
            {
                filename: "report.pdf",
                page: 2,
                text: "attention details",
                vector: [1, 0]
            },
            {
                filename: "report.pdf",
                page: 3,
                text: "appendix",
                vector: [0.8, 0.2]
            }
        ];
        const results = rankChunks({
            questionVector: [1, 0],
            indexedChunks,
            top: 2
        });
        expect(results).toEqual([
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
        ]);
    });
});
//# sourceMappingURL=ranking.test.js.map