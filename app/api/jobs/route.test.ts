import { describe, expect, it } from "vitest";
import { GET } from "./route";

// These tests are the contract. Do not edit them.

describe("GET /api/jobs", () => {
  it("returns 200 for a known status", async () => {
    const response = await GET(
      new Request("http://localhost/api/jobs?status=open"),
    );

    expect(response.status).toBe(200);
  });

  it("filters with the search query parameter", async () => {
    const response = await GET(
      new Request("http://localhost/api/jobs?search=Printer"),
    );
    const body = (await response.json()) as { jobs: { id: string }[] };

    expect(response.status).toBe(200);
    expect(body.jobs.map((job) => job.id)).toEqual(["j4"]);
  });

  it("returns 400 for an unknown status", async () => {
    const response = await GET(
      new Request("http://localhost/api/jobs?status=paused"),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "Invalid status" });
  });
});
