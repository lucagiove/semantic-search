import { CliError } from "../domain/errors.js";
import { pipeline } from "@xenova/transformers";
const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
export class TransformersEmbeddingGenerator {
    createPipelineDependency;
    extractorPromise;
    constructor(dependencies = {}) {
        this.createPipelineDependency = dependencies.createPipeline ?? pipeline;
    }
    async embedText(text) {
        const [vector] = await this.embedTexts([text]);
        if (vector === undefined) {
            throw new CliError("EMBEDDING_FAILED", "Embedding model returned no vector.");
        }
        return vector;
    }
    async embedTexts(texts) {
        try {
            const extractor = await this.getExtractor();
            const tensor = await extractor(Array.from(texts), {
                pooling: "mean",
                normalize: true
            });
            return tensorToVectors(tensor, texts.length);
        }
        catch (error) {
            throw new CliError("EMBEDDING_FAILED", "Failed to generate embeddings.", {
                cause: error
            });
        }
    }
    async getExtractor() {
        if (this.extractorPromise === undefined) {
            this.extractorPromise = this.createPipelineDependency("feature-extraction", EMBEDDING_MODEL)
                .then((extractor) => extractor);
        }
        return this.extractorPromise;
    }
}
export const tensorToVectors = (tensor, expectedCount) => {
    const dimensions = tensor.dims;
    const flatData = Array.from(tensor.data);
    if (dimensions.length !== 2) {
        throw new Error("Embedding tensor must have two dimensions.");
    }
    const [rowCount, columnCount] = dimensions;
    if (rowCount === undefined ||
        columnCount === undefined ||
        rowCount !== expectedCount ||
        rowCount <= 0 ||
        columnCount <= 0) {
        throw new Error("Embedding tensor shape does not match the requested input count.");
    }
    if (flatData.length !== rowCount * columnCount) {
        throw new Error("Embedding tensor data length does not match its dimensions.");
    }
    const vectors = [];
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
        const offset = rowIndex * columnCount;
        vectors.push(flatData.slice(offset, offset + columnCount));
    }
    return vectors;
};
//# sourceMappingURL=embedding-generator.js.map