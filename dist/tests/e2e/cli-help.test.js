import { describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
const execFileAsync = promisify(execFile);
describe("docsearch CLI bootstrap", () => {
    it("prints the command name in help output", async () => {
        const result = await execFileAsync("node", ["--import", "tsx", "./src/cli.ts", "--help"], {
            cwd: process.cwd()
        });
        expect(result.stdout).toContain("docsearch");
    });
});
//# sourceMappingURL=cli-help.test.js.map