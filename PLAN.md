# Implementation Plan

## Status

Current phase: iteration 3 - domain logic with TDD

Legend:
- `[ ]` not started
- `[~]` in progress
- `[x]` completed

## Constraints From Spec

- CLI-only tool named `docsearch`.
- TypeScript + Node.js implementation.
- Local embeddings only via `@xenova/transformers` using `Xenova/all-MiniLM-L6-v2`.
- PDF parsing via `pdf-parse`.
- In-memory vector store only; no persistence.
- Chunking is exactly one chunk per PDF page.
- Query flow must index the provided PDF on the fly before ranking results.
- Plain-text query output must match the specified format.
- Development should follow red-green-refactor TDD.
- Each CLI flow needs E2E coverage for at least one success path and one failure path.

## Iteration Plan

### 1. Project bootstrap
- `[x]` Initialize the Node.js + TypeScript project structure.
- `[x]` Add dependencies and scripts for CLI execution, build, and tests.
- `[x]` Configure TypeScript, module format, and package binary entry for `docsearch`.
- `[x]` Choose and configure the test runner for unit and E2E tests.

### 2. Define domain model and boundaries
- `[x]` Define core types for page chunks, vectors, ranked results, and command inputs.
- `[x]` Define ports/interfaces for PDF extraction and embedding generation.
- `[x]` Define pure ranking utilities, including cosine similarity and top-k selection.
- `[x]` Capture error cases and CLI-facing failure messages.

### 3. Build the domain with TDD
- `[x]` Add failing unit tests for cosine similarity and ranking behavior.
- `[x]` Add failing unit tests for page chunk creation behavior, including skipping empty pages.
- `[x]` Implement the pure domain logic to satisfy the tests.
- `[x]` Refactor while preserving explicit typing and deterministic tests.

### 4. Implement infrastructure adapters
- `[ ]` Implement PDF text extraction using `pdf-parse`.
- `[ ]` Implement local embedding generation using `@xenova/transformers`.
- `[ ]` Add thin wrappers that convert library outputs into domain types.
- `[ ]` Handle adapter-level failures with stable error mapping.

### 5. Implement application services
- `[ ]` Build the indexing workflow that parses pages, skips empty pages, embeds text, and returns the in-memory index.
- `[ ]` Build the query workflow that indexes the file, embeds the question, ranks results, and returns top-k matches.
- `[ ]` Add application-level tests with fakes for PDF extraction and embeddings.

### 6. Implement CLI
- `[ ]` Add the `index` command with `--file`.
- `[ ]` Add the `query` command with `--file`, `--question`, and optional `--top`.
- `[ ]` Format stdout exactly as required by the spec.
- `[ ]` Return non-zero exits and useful stderr messages for invalid input or runtime failures.

### 7. End-to-end verification
- `[ ]` Add E2E tests for `docsearch index` happy path.
- `[ ]` Add E2E tests for `docsearch query` happy path.
- `[ ]` Add at least one E2E failure test for invalid or missing input.
- `[ ]` Add the sample PDF under `samples/` for manual verification flows.

### 8. Final validation and docs
- `[ ]` Run the full test suite and fix remaining issues.
- `[ ]` Manually verify the three sample queries from the spec.
- `[ ]` Update `README.md` with install, usage, and verification instructions.
- `[ ]` Keep this file updated as implementation progresses.

## Update Protocol

When work starts on a step:
- change `[ ]` to `[~]`

When work is finished and verified:
- change `[~]` to `[x]`

After each iteration:
- update `Current phase`
- add short notes below with what changed, what was verified, and the next target

## Iteration Notes

### Iteration 0
- Created the initial implementation plan from `SPECIFICATIONS.md` and `CONVENTIONS.md`.
- Identified that the repository does not yet contain application code, tests, or project scaffolding.
- Next target: bootstrap the TypeScript project and testing setup before any feature implementation.

### Iteration 1
- Added the base Node.js + TypeScript project scaffold, including `package.json`, `tsconfig.json`, and `vitest.config.ts`.
- Added the initial CLI entrypoint and minimal source/test layout for unit and E2E execution.
- Installed dependencies and generated the lockfile.
- Verified the scaffold with `npm run build` and `npm test`.
- Next target: define the domain model, ports, ranking utilities, and CLI-facing error boundaries.

### Iteration 2
- Added domain types for PDF pages, chunks, vectors, ranked results, and command inputs.
- Added domain ports for PDF extraction and embedding generation.
- Added the ranking module surface so the next TDD iteration can implement pure ranking behavior behind a stable API.
- Added CLI error types and mapping with unit coverage for known and unknown failures.
- Verified the iteration with `npm run build` and `npm test`.
- Next target: write failing unit tests for ranking and chunk creation, then implement the pure domain logic.

### Iteration 3
- Added red-phase unit tests for cosine similarity, ranked top-k selection, and page chunk creation with empty-page skipping.
- Implemented `createPageChunks`, `cosineSimilarity`, and `rankChunks` as pure domain logic.
- Exported the chunk creation API from the domain index and tightened the implementation to satisfy strict TypeScript checks.
- Verified the iteration with `npm run build` and `npm test`.
- Next target: implement the `pdf-parse` and `@xenova/transformers` adapters and map their failures into stable domain errors.
