import { indexPdf as defaultIndexPdf, queryPdf as defaultQueryPdf } from "./application/services.js";
type IndexPdf = typeof defaultIndexPdf;
type QueryPdf = typeof defaultQueryPdf;
interface CliDependencies {
    readonly indexPdf?: IndexPdf;
    readonly queryPdf?: QueryPdf;
    readonly writeStdout?: (message: string) => void;
    readonly writeStderr?: (message: string) => void;
}
export declare const runCli: (argv: readonly string[], dependencies?: CliDependencies) => Promise<number>;
export declare const formatQueryResults: (question: string, results: readonly {
    filename: string;
    page: number;
}[]) => string;
export {};
