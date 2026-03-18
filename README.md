# semantic-search

A CLI tool for indexing PDF documents using embedding vectors and querying them with natural-language questions.

Built as a hands-on exercise for the [AI Assistants for your teams Workshop](https://www.avanscoperta.it/en/training/ai-assistants-for-your-teams-workshop/) by Uberto Barbini at Avanscoperta.

---

## Exercise brief

> **Semantic Search Tool**
>
> The goal is to be able to index some documents using embedding vectors. You can use the language of your choice and the libraries better suited for your language. While writing the application you should also learn the basics of Embedding and Vector search (asking the AI).
>
> For the embedding, start using a local embedding model. For the storage you can use either a VectorDB or just a file loaded in memory.
>
> The app is a CLI tool that should do 2 things:
> 1. **Index** — Process a text and build/update a vector storage for embedding.
> 2. **Query** — Accept a natural-language question and return ranked results with PDF filename and page number.
>
> Then index a document on something you know about and verify the questions and answers.
>
> **Nice to have:**
> - Parse all files in a folder and refer to the file in the answer.
> - Be able to also parse PDFs and refer to the page of text in the answer.
> - Use HDE questions in embedding.
>
> **Second part:**
> - Build a MCP server to allow models to search inside it.

---

## Approach

Following the workshop's guidance:

- Start with planning and learning what's needed.
- Ask first for a Walking Skeleton and add features slowly, always checking and committing in small steps.
- The journey matters more than the destination — the goal is understanding how to use AI assistants effectively.

Three artifacts are maintained to guide AI-assisted development throughout the exercise:

| Artifact | File | Purpose |
|---|---|---|
| Specification | [SPECIFICATIONS.md](SPECIFICATIONS.md) | Full technical requirements, CLI design, data flow, and verification steps |
| Coding rules | [CONVENTIONS.md](CONVENTIONS.md) | TDD conventions and TypeScript standards the AI must follow |
| Plan / diary | [PLAN.md](PLAN.md) | Running log of decisions, steps taken, and lessons learned |

---

## Tech stack

- **Runtime:** Node.js / TypeScript
- **Embeddings:** Local model — `Xenova/all-MiniLM-L6-v2` via `@xenova/transformers`
- **PDF parsing:** `pdf-parse`
- **CLI framework:** `commander`
- **Vector store:** In-memory (no persistence in v1)

---

## Usage

```bash
# Index a PDF
docsearch index --file path/to/document.pdf

# Query the index
docsearch query --file path/to/document.pdf --question "What is the main topic?"
```

See [SPECIFICATIONS.md](SPECIFICATIONS.md) for full CLI reference and output format.
