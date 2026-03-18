export interface BootstrapStatus {
  readonly ready: true;
}

export const bootstrapStatus: BootstrapStatus = {
  ready: true
};

export * from "./domain/index.js";
export * from "./infrastructure/index.js";
