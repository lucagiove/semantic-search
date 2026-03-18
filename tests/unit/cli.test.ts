import { describe, expect, it, vi } from "vitest";

import { CliError } from "../../src/domain/errors.js";
import { runCli } from "../../src/cli.js";

describe("runCli", () => {
  it("prints the index confirmation line", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const exitCode = await runCli(
      ["node", "docsearch", "index", "--file", "docs/report.pdf"],
      {
        writeStdout: stdout,
        writeStderr: stderr,
        indexPdf: vi.fn(async () => ({
          filename: "report.pdf",
          pageCount: 3,
          indexedChunks: []
        })),
        queryPdf: vi.fn()
      }
    );

    expect(exitCode).toBe(0);
    expect(stdout).toHaveBeenCalledWith("Indexed 3 pages from report.pdf\n");
    expect(stderr).not.toHaveBeenCalled();
  });

  it("prints query results exactly in the required plain-text format", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const exitCode = await runCli(
      [
        "node",
        "docsearch",
        "query",
        "--file",
        "docs/report.pdf",
        "--question",
        "What attention mechanism is proposed?"
      ],
      {
        writeStdout: stdout,
        writeStderr: stderr,
        indexPdf: vi.fn(),
        queryPdf: vi.fn(async () => ({
          filename: "report.pdf",
          question: "What attention mechanism is proposed?",
          results: [
            { filename: "report.pdf", page: 4, score: 1 },
            { filename: "report.pdf", page: 7, score: 0.9 }
          ]
        }))
      }
    );

    expect(exitCode).toBe(0);
    expect(stdout).toHaveBeenCalledWith(
      'Results for: "What attention mechanism is proposed?"\n\n1. report.pdf  page 4\n2. report.pdf  page 7\n'
    );
    expect(stderr).not.toHaveBeenCalled();
  });

  it("prints CLI failures to stderr and returns a non-zero exit code", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const exitCode = await runCli(
      ["node", "docsearch", "query", "--file", "docs/report.pdf", "--question", ""],
      {
        writeStdout: stdout,
        writeStderr: stderr,
        indexPdf: vi.fn(),
        queryPdf: vi.fn(async () => {
          throw new CliError("EMPTY_QUESTION", "The --question value must not be empty.");
        })
      }
    );

    expect(exitCode).toBe(1);
    expect(stdout).not.toHaveBeenCalled();
    expect(stderr).toHaveBeenCalledWith("The --question value must not be empty.\n");
  });
});
