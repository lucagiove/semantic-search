import type { EmbeddingGenerator } from "../domain/ports.js";
import type { EmbeddingVector } from "../domain/types.js";
interface TensorLike {
    readonly data: ArrayLike<number>;
    readonly dims: readonly number[];
}
type PipelineFactory = (task: "feature-extraction", model: string) => Promise<unknown>;
interface EmbeddingGeneratorDependencies {
    readonly createPipeline?: PipelineFactory;
}
export declare class TransformersEmbeddingGenerator implements EmbeddingGenerator {
    private readonly createPipelineDependency;
    private extractorPromise;
    constructor(dependencies?: EmbeddingGeneratorDependencies);
    embedText(text: string): Promise<EmbeddingVector>;
    embedTexts(texts: readonly string[]): Promise<readonly EmbeddingVector[]>;
    private getExtractor;
}
export declare const tensorToVectors: (tensor: TensorLike, expectedCount: number) => readonly EmbeddingVector[];
export {};
