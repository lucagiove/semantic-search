export const cliErrorCodes = [
    "FILE_NOT_FOUND",
    "INVALID_PDF",
    "EMPTY_QUESTION",
    "INVALID_TOP_VALUE",
    "PDF_EXTRACTION_FAILED",
    "EMBEDDING_FAILED",
    "RANKING_FAILED",
    "UNKNOWN"
];
export class CliError extends Error {
    code;
    details;
    constructor(code, message, options = {}) {
        super(message, options.cause ? { cause: options.cause } : undefined);
        this.name = "CliError";
        this.code = code;
        this.details = options.details;
    }
}
export const mapErrorToCliFailure = (error) => {
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
const assertNever = (value) => {
    throw new Error(`Unhandled CLI error code: ${String(value)}`);
};
//# sourceMappingURL=errors.js.map