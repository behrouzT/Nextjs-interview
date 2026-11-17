import { describe, expect, it } from "vitest";
import { filterJobs, sortByDueDate, summarize } from "./board";
import type { Job } from "./types";

// These tests are the contract. Do not edit them.

function job(overrides: Partial<Job> & Pick<Job, "id" | "dueDate">): Job {
  return {
    title: overrides.id,
    customer: "Customer",
    status: "open",
    estimatedCents: 1000,
    ...overrides,
  };
}

describe("filterJobs", () => {
  const jobs = [
    job({
      id: "j1",
      title: "Replace laptop screen",
      customer: "Aline Moreau",
      dueDate: "2026-11-16",
      status: "open",
    }),
    job({
      id: "j3",
      title: "Data recovery",
      customer: "Aline Moreau",
      dueDate: "2026-11-10",
      status: "done",
    }),
    job({
      id: "j4",
      title: "Printer jam",
      customer: "Cafe Sol",
      dueDate: "2026-11-12",
      status: "cancelled",
    }),
  ];

  it("returns every job when search is empty and status is all", () => {
    expect(filterJobs(jobs, { search: "", status: "all" })).toEqual(jobs);
  });

  it("filters by an exact status", () => {
    expect(
      filterJobs(jobs, { search: "", status: "open" }).map((item) => item.id),
    ).toEqual(["j1"]);
  });

  it("matches a customer name without caring about case", () => {
    expect(
      filterJobs(jobs, { search: "aline", status: "all" }).map((item) => item.id),
    ).toEqual(["j1", "j3"]);
  });

  it("matches a title without caring about case, and trims the search", () => {
    expect(
      filterJobs(jobs, { search: "  SCREEN ", status: "all" }).map(
        (item) => item.id,
      ),
    ).toEqual(["j1"]);
  });
});

describe("sortByDueDate", () => {
  function sample(): Job[] {
    return [
      job({ id: "b", dueDate: "2026-11-16" }),
      job({ id: "a", dueDate: "2026-11-16" }),
      job({ id: "c", dueDate: "2026-11-10" }),
    ];
  }

  it("does not mutate the input array", () => {
    const jobs = [
      job({ id: "c", dueDate: "2026-11-10" }),
      job({ id: "a", dueDate: "2026-11-16" }),
      job({ id: "b", dueDate: "2026-11-18" }),
    ];
    const snapshot = jobs.map((item) => item.id);
    sortByDueDate(jobs);
    expect(jobs.map((item) => item.id)).toEqual(snapshot);
  });

  it("sorts the soonest due date first and breaks ties by id", () => {
    expect(sortByDueDate(sample()).map((item) => item.id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });
});

describe("summarize", () => {
  const today = "2026-11-16";
  const jobs = [
    job({
      id: "today",
      dueDate: today,
      status: "open",
      estimatedCents: 100,
    }),
    job({
      id: "late",
      dueDate: "2026-11-15",
      status: "in_progress",
      estimatedCents: 25,
    }),
    job({
      id: "cancelled",
      dueDate: "2026-11-01",
      status: "cancelled",
      estimatedCents: 50,
    }),
    job({
      id: "finished",
      dueDate: "2026-11-01",
      status: "done",
      estimatedCents: 10,
    }),
  ];

  it("counts open and in-progress jobs as still open", () => {
    expect(summarize(jobs, today).openCount).toBe(2);
  });

  it("counts a job as overdue only when it is still active and due before today", () => {
    expect(summarize(jobs, today).overdueCount).toBe(1);
  });

  it("sums every job except cancelled into active revenue", () => {
    expect(summarize(jobs, today).activeRevenueCents).toBe(135);
  });
});
