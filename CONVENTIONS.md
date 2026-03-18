# TypeScript TDD Conventions

Use red-green-refactor for every behavior change in this project.

- Start with a failing test that describes the behavior from the spec.
- Keep imports at the top of each module; avoid inline imports.
- Prefer explicit types and avoid `any` in domain and test code.
- Use exhaustive `switch` checks with a `never` guard for unions/enums.

## Unit tests for the domain

- Add or update unit tests for domain logic before implementation changes.
- Focus tests on pure domain behavior and edge cases, not framework internals.
- Keep domain tests deterministic with fakes/stubs for IO boundaries.

## End-to-end tests

- For each CLI flow, add an E2E test that starts from user input and verifies the output.
- Cover the happy path and at least one failure path.
- Assert externally visible outcomes (exit code, stdout content, file side-effects if any).
