import { Command, CommanderError } from "commander";
import { fileURLToPath } from "node:url";
import { indexPdf as defaultIndexPdf, queryPdf as defaultQueryPdf } from "./application/services.js";
import { mapErrorToCliFailure } from "./domain/errors.js";
import { TransformersEmbeddingGenerator } from "./infrastructure/embedding-generator.js";
import { PdfParseTextExtractor } from "./infrastructure/pdf-extractor.js";
const sharedDependencies = {
    pdfTextExtractor: new PdfParseTextExtractor(),
    embeddingGenerator: new TransformersEmbeddingGenerator()
};
export const runCli = async (argv, dependencies = {}) => {
    const indexPdf = dependencies.indexPdf ?? defaultIndexPdf;
    const queryPdf = dependencies.queryPdf ?? defaultQueryPdf;
    const writeStdout = dependencies.writeStdout ?? ((message) => process.stdout.write(message));
    const writeStderr = dependencies.writeStderr ?? ((message) => process.stderr.write(message));
    const program = new Command();
    program
        .name("docsearch")
        .description("Semantic search CLI for PDF documents")
        .version("0.1.0");
    program
        .command("index")
        .requiredOption("--file <path>")
        .action(async (options) => {
        const result = await indexPdf({ filePath: options.file }, sharedDependencies);
        writeStdout(`Indexed ${result.pageCount} pages from ${result.filename}\n`);
    });
    program
        .command("query")
        .requiredOption("--file <path>")
        .requiredOption("--question <text>")
        .option("--top <number>", "Number of results to return", "5")
        .action(async (options) => {
        const top = Number.parseInt(options.top, 10);
        const result = await queryPdf({
            filePath: options.file,
            question: options.question,
            top
        }, sharedDependencies);
        writeStdout(formatQueryResults(result.question, result.results));
    });
    program.exitOverride();
    try {
        await program.parseAsync(argv, { from: "node" });
        return 0;
    }
    catch (error) {
        if (error instanceof CommanderError) {
            if (error.code === "commander.helpDisplayed") {
                return 0;
            }
            writeStderr(`${error.message}\n`);
            return error.exitCode;
        }
        const failure = mapErrorToCliFailure(error);
        writeStderr(`${failure.message}\n`);
        return failure.exitCode;
    }
};
export const formatQueryResults = (question, results) => {
    const lines = results.map((result, index) => `${index + 1}. ${result.filename}  page ${result.page}`);
    return `Results for: "${question}"\n\n${lines.join("\n")}${lines.length > 0 ? "\n" : ""}`;
};
const isMainModule = process.argv[1] !== undefined &&
    fileURLToPath(import.meta.url) === process.argv[1];
if (isMainModule) {
    const exitCode = await runCli(process.argv);
    if (exitCode !== 0) {
        process.exitCode = exitCode;
    }
}
//# sourceMappingURL=cli.js.map