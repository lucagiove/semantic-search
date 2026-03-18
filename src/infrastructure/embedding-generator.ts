import { CliError } from "../domain/errors.js";
import type { EmbeddingGenerator } from "../domain/ports.js";
import type { EmbeddingVector } from "../domain/types.js";
import { pipeline } from "@xenova/transformers";

const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";

interface TensorLike {
  readonly data: ArrayLike<number>;
  readonly dims: readonly number[];
}

interface FeatureExtractionOptions {
  readonly pooling: "mean";
  readonly normalize: boolean;
}

type FeatureExtractionPipeline = (
  texts: string | string[],
  options: FeatureExtractionOptions
) => Promise<TensorLike>;

type PipelineFactory = (
  task: "feature-extraction",
  model: string
) => Promise<unknown>;

interface EmbeddingGeneratorDependencies {
  readonly createPipeline?: PipelineFactory;
}

export class TransformersEmbeddingGenerator implements EmbeddingGenerator {
  private readonly createPipelineDependency: PipelineFactory;
  private extractorPromise: Promise<FeatureExtractionPipeline> | undefined;

  public constructor(dependencies: EmbeddingGeneratorDependencies = {}) {
    this.createPipelineDependency = dependencies.createPipeline ?? pipeline;
  }

  public async embedText(text: string): Promise<EmbeddingVector> {
    const [vector] = await this.embedTexts([text]);

    if (vector === undefined) {
      throw new CliError("EMBEDDING_FAILED", "Embedding model returned no vector.");
    }

    return vector;
  }

  public async embedTexts(texts: readonly string[]): Promise<readonly EmbeddingVector[]> {
    try {
      const extractor = await this.getExtractor();
      const tensor = await extractor(Array.from(texts), {
        pooling: "mean",
        normalize: true
      });

      return tensorToVectors(tensor, texts.length);
    } catch (error) {
      throw new CliError("EMBEDDING_FAILED", "Failed to generate embeddings.", {
        cause: error
      });
    }
  }

  private async getExtractor(): Promise<FeatureExtractionPipeline> {
    if (this.extractorPromise === undefined) {
      this.extractorPromise = this.createPipelineDependency("feature-extraction", EMBEDDING_MODEL)
        .then((extractor) => extractor as FeatureExtractionPipeline);
    }

    return this.extractorPromise;
  }
}

export const tensorToVectors = (
  tensor: TensorLike,
  expectedCount: number
): readonly EmbeddingVector[] => {
  const dimensions = tensor.dims;
  const flatData = Array.from(tensor.data);

  if (dimensions.length !== 2) {
    throw new Error("Embedding tensor must have two dimensions.");
  }

  const [rowCount, columnCount] = dimensions;

  if (
    rowCount === undefined ||
    columnCount === undefined ||
    rowCount !== expectedCount ||
    rowCount <= 0 ||
    columnCount <= 0
  ) {
    throw new Error("Embedding tensor shape does not match the requested input count.");
  }

  if (flatData.length !== rowCount * columnCount) {
    throw new Error("Embedding tensor data length does not match its dimensions.");
  }

  const vectors: EmbeddingVector[] = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const offset = rowIndex * columnCount;
    vectors.push(flatData.slice(offset, offset + columnCount));
  }

  return vectors;
};
