import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { JobsBoard } from "./JobsBoard";
import type { Job } from "@/lib/jobs/types";

// These tests are the contract. Do not edit them.

const printer: Job = {
  id: "j4",
  title: "Printer jam",
  customer: "Cafe Sol",
  status: "cancelled",
  dueDate: "2026-11-12",
  estimatedCents: 4000,
};

const recovery: Job = {
  id: "j3",
  title: "Data recovery",
  customer: "Aline Moreau",
  status: "done",
  dueDate: "2026-11-10",
  estimatedCents: 24000,
};

function json(jobs: Job[]) {
  return Promise.resolve(
    new Response(JSON.stringify({ jobs }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }),
  );
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("JobsBoard", () => {
  it("loads a new list as you type, using the search query parameter", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: RequestInfo | URL) => {
        const url = new URL(String(input), "http://localhost");
        if (url.searchParams.get("search") === "aline") return json([recovery]);
        return json([printer]);
      }),
    );

    render(<JobsBoard />);

    await waitFor(() => {
      expect(screen.getByText("Printer jam")).toBeTruthy();
    });

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: "aline" },
    });

    await waitFor(() => {
      expect(screen.getByText("Data recovery")).toBeTruthy();
    });
  });
});
