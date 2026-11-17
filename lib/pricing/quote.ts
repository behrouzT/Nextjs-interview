import type { JobInput, Quote } from "./types";

/**
 * Price one repair job.
 * The rules are the contract in README.md under "Task 1".
 */
export function quoteJob(input: JobInput): Quote {
  void input;
  throw new Error("quoteJob is not implemented");
}
