import { describe, expect, it } from "vitest";
import { CliError, mapErrorToCliFailure } from "../../src/domain/errors.js";
describe("CLI error mapping", () => {
    it("preserves known CLI error codes and messages", () => {
        const failure = mapErrorToCliFailure(new CliError("INVALID_TOP_VALUE", "The --top value must be a positive integer."));
        expect(failure).toEqual({
            code: "INVALID_TOP_VALUE",
            message: "The --top value must be a positive integer.",
            exitCode: 1
        });
    });
    it("maps unexpected errors to an unknown CLI failure", () => {
        const failure = mapErrorToCliFailure(new Error("Boom"));
        expect(failure).toEqual({
            code: "UNKNOWN",
            message: "Boom",
            exitCode: 1
        });
    });
});
//# sourceMappingURL=domain-errors.test.js.map