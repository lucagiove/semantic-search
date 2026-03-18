export const cosineSimilarity = (left, right) => {
    if (left.length !== right.length) {
        throw new Error("Vectors must have the same length.");
    }
    if (left.length === 0) {
        throw new Error("Vectors must not be empty.");
    }
    let dotProduct = 0;
    let leftMagnitudeSum = 0;
    let rightMagnitudeSum = 0;
    for (let index = 0; index < left.length; index += 1) {
        const leftValue = left[index];
        const rightValue = right[index];
        if (leftValue === undefined || rightValue === undefined) {
            throw new Error("Vectors must have the same length.");
        }
        dotProduct += leftValue * rightValue;
        leftMagnitudeSum += leftValue * leftValue;
        rightMagnitudeSum += rightValue * rightValue;
    }
    if (leftMagnitudeSum === 0 || rightMagnitudeSum === 0) {
        throw new Error("Vectors must not have zero magnitude.");
    }
    return dotProduct / (Math.sqrt(leftMagnitudeSum) * Math.sqrt(rightMagnitudeSum));
};
export const rankChunks = (input) => {
    return [...input.indexedChunks]
        .map((chunk) => ({
        filename: chunk.filename,
        page: chunk.page,
        score: cosineSimilarity(input.questionVector, chunk.vector)
    }))
        .sort((left, right) => {
        if (right.score !== left.score) {
            return right.score - left.score;
        }
        if (left.filename !== right.filename) {
            return left.filename.localeCompare(right.filename);
        }
        return left.page - right.page;
    })
        .slice(0, input.top);
};
//# sourceMappingURL=ranking.js.map