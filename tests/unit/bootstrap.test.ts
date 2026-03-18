import { describe, expect, it } from "vitest";

import { bootstrapStatus } from "../../src/index.js";

describe("project bootstrap", () => {
  it("exposes a ready status for the initial scaffold", () => {
    expect(bootstrapStatus.ready).toBe(true);
  });
});
