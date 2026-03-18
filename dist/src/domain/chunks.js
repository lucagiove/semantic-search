import { basename } from "node:path";
export const createPageChunks = (filePath, pages) => {
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
//# sourceMappingURL=chunks.js.map