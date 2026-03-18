export const cliErrorCodes = [
  "FILE_NOT_FOUND",
  "INVALID_PDF",
  "EMPTY_QUESTION",
  "INVALID_TOP_VALUE",
  "PDF_EXTRACTION_FAILED",
  "EMBEDDING_FAILED",
  "RANKING_FAILED",
  "UNKNOWN"
] as const;

export type CliErrorCode = (typeof cliErrorCodes)[number];

export interface CliErrorOptions {
  readonly cause?: unknown;
  readonly details?: string;
}

export class CliError extends Error {
  public readonly code: CliErrorCode;
  public readonly details: string | undefined;

  public constructor(code: CliErrorCode, message: string, options: CliErrorOptions = {}) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = "CliError";
    this.code = code;
    this.details = options.details;
  }
}

export interface CliFailure {
  readonly code: CliErrorCode;
  readonly message: string;
  readonly exitCode: number;
}

export const mapErrorToCliFailure = (error: unknown): CliFailure => {
  if (error instanceof CliError) {
    switch (error.code) {
      case "FILE_NOT_FOUND":
      case "INVALID_PDF":
      case "EMPTY_QUESTION":
      case "INVALID_TOP_VALUE":
        return {
          code: error.code,
          message: error.message,
          exitCode: 1
        };
      case "PDF_EXTRACTION_FAILED":
      case "EMBEDDING_FAILED":
      case "RANKING_FAILED":
      case "UNKNOWN":
        return {
          code: error.code,
          message: error.message,
          exitCode: 1
        };
      default:
        return assertNever(error.code);
    }
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN",
      message: error.message,
      exitCode: 1
    };
  }

  return {
    code: "UNKNOWN",
    message: "An unknown error occurred.",
    exitCode: 1
  };
};

const assertNever = (value: never): never => {
  throw new Error(`Unhandled CLI error code: ${String(value)}`);
};
