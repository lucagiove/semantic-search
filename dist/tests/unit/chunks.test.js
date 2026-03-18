import { describe, expect, it } from "vitest";
import { createPageChunks } from "../../src/domain/chunks.js";
describe("createPageChunks", () => {
    it("creates one chunk per non-empty page using the file basename", () => {
        const chunks = createPageChunks("docs/report.pdf", [
            { pageNumber: 1, text: "Overview" },
            { pageNumber: 2, text: "   " },
            { pageNumber: 3, text: "Details" }
        ]);
        expect(chunks).toEqual([
            {
                filename: "report.pdf",
                page: 1,
                text: "Overview"
            },
            {
                filename: "report.pdf",
                page: 3,
                text: "Details"
            }
        ]);
    });
});
//# sourceMappingURL=chunks.test.js.map