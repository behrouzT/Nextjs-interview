import { describe, expect, it } from "vitest";
import { quoteJob } from "./quote";
import type { JobInput } from "./types";

// These tests are the contract. Do not edit them.

function job(overrides: Partial<JobInput> = {}): JobInput {
  return {
    laborMinutes: 0,
    laborRateCentsPerHour: 0,
    parts: [],
    priority: "standard",
    isRepeatCustomer: false,
    ...overrides,
  };
}

describe("quoteJob", () => {
  it("prices the worked example from the README", () => {
    expect(
      quoteJob(
        job({
          laborMinutes: 30,
          laborRateCentsPerHour: 8000,
          parts: [{ name: "Cable", priceCents: 1500, quantity: 2 }],
          priority: "rush",
          isRepeatCustomer: true,
        }),
      ),
    ).toEqual({
      laborCents: 4000,
      partsCents: 3000,
      surchargeCents: 1050,
      discountCents: 805,
      totalCents: 7245,
    });
  });

  it("rounds labor to the nearest cent", () => {
    expect(
      quoteJob(
        job({
          laborMinutes: 20,
          laborRateCentsPerHour: 5000,
          parts: [{ name: "Bracket", priceCents: 2000, quantity: 1 }],
        }),
      ),
    ).toMatchObject({
      laborCents: 1667,
      partsCents: 2000,
      surchargeCents: 0,
      discountCents: 0,
      totalCents: 3667,
    });
  });

  it("rounds a rush surcharge half up", () => {
    expect(
      quoteJob(
        job({
          parts: [{ name: "Board", priceCents: 10010, quantity: 1 }],
          priority: "rush",
        }),
      ),
    ).toMatchObject({
      laborCents: 0,
      partsCents: 10010,
      surchargeCents: 1502,
      discountCents: 0,
      totalCents: 11512,
    });
  });

  it("adds a 35 percent emergency surcharge", () => {
    expect(
      quoteJob(
        job({
          laborMinutes: 60,
          laborRateCentsPerHour: 10000,
          priority: "emergency",
        }),
      ),
    ).toMatchObject({
      surchargeCents: 3500,
      discountCents: 0,
      totalCents: 13500,
    });
  });

  it("applies the repeat discount after the surcharge and rounds it half up", () => {
    const rushRepeat = quoteJob(
      job({
        laborMinutes: 60,
        laborRateCentsPerHour: 10000,
        priority: "rush",
        isRepeatCustomer: true,
      }),
    );

    expect(rushRepeat).toMatchObject({
      laborCents: 10000,
      surchargeCents: 1500,
      discountCents: 1150,
      totalCents: 10350,
    });

    expect(
      quoteJob(
        job({
          laborMinutes: 60,
          laborRateCentsPerHour: 10005,
          isRepeatCustomer: true,
        }),
      ),
    ).toMatchObject({
      discountCents: 1001,
      totalCents: 9004,
    });
  });

  it("charges no discount for a first-time customer", () => {
    expect(
      quoteJob(
        job({
          laborMinutes: 60,
          laborRateCentsPerHour: 10000,
          priority: "rush",
          isRepeatCustomer: false,
        }),
      ),
    ).toMatchObject({
      discountCents: 0,
      totalCents: 11500,
    });
  });

  it("raises the total to the $25 minimum without changing the line items", () => {
    expect(
      quoteJob(
        job({
          laborMinutes: 10,
          laborRateCentsPerHour: 6000,
        }),
      ),
    ).toEqual({
      laborCents: 1000,
      partsCents: 0,
      surchargeCents: 0,
      discountCents: 0,
      totalCents: 2500,
    });
  });

  it("applies the minimum when labor minutes were worked at a zero rate", () => {
    expect(
      quoteJob(
        job({
          laborMinutes: 30,
          laborRateCentsPerHour: 0,
        }),
      ),
    ).toMatchObject({
      laborCents: 0,
      totalCents: 2500,
    });
  });

  it("applies the minimum when the only part is free", () => {
    expect(
      quoteJob(
        job({
          parts: [{ name: "Inspection", priceCents: 0, quantity: 1 }],
        }),
      ),
    ).toEqual({
      laborCents: 0,
      partsCents: 0,
      surchargeCents: 0,
      discountCents: 0,
      totalCents: 2500,
    });
  });

  it("does not apply the minimum to an empty job", () => {
    expect(quoteJob(job())).toEqual({
      laborCents: 0,
      partsCents: 0,
      surchargeCents: 0,
      discountCents: 0,
      totalCents: 0,
    });
  });

  it("does not mutate the parts array", () => {
    const parts = [{ name: "Cable", priceCents: 1500, quantity: 2 }];
    const snapshot = parts.map((part) => ({ ...part }));

    quoteJob(
      job({
        laborMinutes: 30,
        laborRateCentsPerHour: 8000,
        parts,
        priority: "rush",
        isRepeatCustomer: true,
      }),
    );

    expect(parts).toEqual(snapshot);
  });

  it("rejects labor that is negative or not an integer", () => {
    expect(() => quoteJob(job({ laborMinutes: -1 }))).toThrow(
      "laborMinutes must be a non-negative integer",
    );
    expect(() => quoteJob(job({ laborMinutes: 1.5 }))).toThrow(
      "laborMinutes must be a non-negative integer",
    );
  });

  it("rejects a labor rate that is negative or not an integer", () => {
    expect(() => quoteJob(job({ laborRateCentsPerHour: -5 }))).toThrow(
      "laborRateCentsPerHour must be a non-negative integer",
    );
    expect(() => quoteJob(job({ laborRateCentsPerHour: 10.5 }))).toThrow(
      "laborRateCentsPerHour must be a non-negative integer",
    );
  });

  it("rejects a part quantity that is not a positive integer", () => {
    expect(() =>
      quoteJob(
        job({
          parts: [{ name: "Cable", priceCents: 100, quantity: 0 }],
        }),
      ),
    ).toThrow("part quantity must be a positive integer");
  });

  it("rejects a part price that is negative or not an integer", () => {
    expect(() =>
      quoteJob(
        job({
          parts: [{ name: "Cable", priceCents: -1, quantity: 1 }],
        }),
      ),
    ).toThrow("part priceCents must be a non-negative integer");
  });

  it("rejects an unknown priority", () => {
    expect(() => quoteJob(job({ priority: "urgent" }))).toThrow(
      "priority must be standard, rush, or emergency",
    );
  });
});
