import { describe, expect, it, vi } from "vitest";

import { TransformersEmbeddingGenerator, tensorToVectors } from "../../src/infrastructure/embedding-generator.js";

describe("tensorToVectors", () => {
  it("converts a two-dimensional tensor into vectors", () => {
    const vectors = tensorToVectors(
      {
        data: new Float32Array([1, 2, 3, 4, 5, 6]),
        dims: [2, 3]
      },
      2
    );

    expect(vectors).toEqual([
      [1, 2, 3],
      [4, 5, 6]
    ]);
  });
});

describe("TransformersEmbeddingGenerator", () => {
  it("requests normalized mean-pooled embeddings from the configured model", async () => {
    const extractor = vi.fn(async () => ({
      data: new Float32Array([0.1, 0.2, 0.3, 0.4]),
      dims: [2, 2]
    }));
    const createPipeline = vi.fn(async () => extractor);

    const generator = new TransformersEmbeddingGenerator({ createPipeline });
    const result = await generator.embedTexts(["first", "second"]);

    expect(createPipeline).toHaveBeenCalledWith(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    expect(extractor).toHaveBeenCalledWith(["first", "second"], {
      pooling: "mean",
      normalize: true
    });
    expect(result).toEqual([
      [0.10000000149011612, 0.20000000298023224],
      [0.30000001192092896, 0.4000000059604645]
    ]);
  });

  it("maps pipeline failures to EMBEDDING_FAILED", async () => {
    const generator = new TransformersEmbeddingGenerator({
      createPipeline: vi.fn(async () => {
        throw new Error("model load failed");
      })
    });

    await expect(generator.embedText("hello")).rejects.toMatchObject({
      code: "EMBEDDING_FAILED",
      message: "Failed to generate embeddings."
    });
  });
});
