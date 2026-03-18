export declare const cliErrorCodes: readonly ["FILE_NOT_FOUND", "INVALID_PDF", "EMPTY_QUESTION", "INVALID_TOP_VALUE", "PDF_EXTRACTION_FAILED", "EMBEDDING_FAILED", "RANKING_FAILED", "UNKNOWN"];
export type CliErrorCode = (typeof cliErrorCodes)[number];
export interface CliErrorOptions {
    readonly cause?: unknown;
    readonly details?: string;
}
export declare class CliError extends Error {
    readonly code: CliErrorCode;
    readonly details: string | undefined;
    constructor(code: CliErrorCode, message: string, options?: CliErrorOptions);
}
export interface CliFailure {
    readonly code: CliErrorCode;
    readonly message: string;
    readonly exitCode: number;
}
export declare const mapErrorToCliFailure: (error: unknown) => CliFailure;
