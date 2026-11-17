"use client";

import { useState } from "react";
import { formatCents } from "@/lib/pricing/money";
import { quoteJob } from "@/lib/pricing/quote";
import type { Priority, Quote } from "@/lib/pricing/types";

type PartDraft = {
  id: string;
  name: string;
  priceDollars: string;
  quantity: string;
};

const fieldClass =
  "w-full rounded-xl border border-line bg-background px-3 py-2 font-normal outline-none focus-visible:outline-2 focus-visible:outline-accent";

export function QuoteForm() {
  const [laborMinutes, setLaborMinutes] = useState("30");
  const [hourlyRate, setHourlyRate] = useState("80");
  const [priority, setPriority] = useState<Priority>("rush");
  const [repeat, setRepeat] = useState(true);
  const [parts, setParts] = useState<PartDraft[]>([
    { id: "example-cable", name: "Cable", priceDollars: "15", quantity: "2" },
  ]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  function calculate() {
    const partLines = parts
      .filter((part) => part.name.trim() !== "" || part.priceDollars.trim() !== "")
      .map((part) => ({
        name: part.name.trim(),
        priceCents: Math.round(Number(part.priceDollars) * 100),
        quantity: Number(part.quantity),
      }));

    try {
      const next = quoteJob({
        laborMinutes: Number(laborMinutes),
        laborRateCentsPerHour: Math.round(Number(hourlyRate) * 100),
        parts: partLines,
        priority,
        isRepeatCustomer: repeat,
      });
      setQuote(next);
      setError(null);
    } catch (caught) {
      setQuote(null);
      setError(caught instanceof Error ? caught.message : "Could not price this job");
    }
  }

  function loadExample() {
    setLaborMinutes("30");
    setHourlyRate("80");
    setPriority("rush");
    setRepeat(true);
    setParts([
      { id: "example-cable", name: "Cable", priceDollars: "15", quantity: "2" },
    ]);
    setQuote(null);
    setError(null);
  }

  function updatePart(id: string, patch: Partial<PartDraft>) {
    setParts((current) =>
      current.map((part) => (part.id === id ? { ...part, ...patch } : part)),
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form
        className="grid gap-5 rounded-2xl border border-line bg-card p-5"
        onSubmit={(event) => {
          event.preventDefault();
          calculate();
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 text-sm font-medium">
            Labor minutes
            <input
              inputMode="numeric"
              value={laborMinutes}
              onChange={(event) => setLaborMinutes(event.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Hourly rate (dollars)
            <input
              inputMode="decimal"
              value={hourlyRate}
              onChange={(event) => setHourlyRate(event.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium">
            Priority
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
              className={fieldClass}
            >
              <option value="standard">Standard</option>
              <option value="rush">Rush, 15%</option>
              <option value="emergency">Emergency, 35%</option>
            </select>
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={repeat}
              onChange={(event) => setRepeat(event.target.checked)}
              className="size-4 accent-accent"
            />
            Repeat customer, 10% off
          </label>
        </div>

        <fieldset className="grid gap-3">
          <legend className="text-sm font-medium">Parts</legend>
          {parts.map((part) => (
            <div key={part.id} className="grid gap-2 sm:grid-cols-[1fr_120px_90px_auto]">
              <input
                aria-label="Part name"
                value={part.name}
                onChange={(event) => updatePart(part.id, { name: event.target.value })}
                placeholder="Name"
                className={fieldClass}
              />
              <input
                aria-label="Part price in dollars"
                inputMode="decimal"
                value={part.priceDollars}
                onChange={(event) =>
                  updatePart(part.id, { priceDollars: event.target.value })
                }
                placeholder="Price"
                className={fieldClass}
              />
              <input
                aria-label="Part quantity"
                inputMode="numeric"
                value={part.quantity}
                onChange={(event) =>
                  updatePart(part.id, { quantity: event.target.value })
                }
                className={fieldClass}
              />
              <button
                type="button"
                onClick={() =>
                  setParts((current) => current.filter((item) => item.id !== part.id))
                }
                className="rounded-xl px-3 py-2 text-sm text-muted hover:text-foreground"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setParts((current) => [
                ...current,
                {
                  id: nextPartId(),
                  name: "",
                  priceDollars: "",
                  quantity: "1",
                },
              ])
            }
            className="justify-self-start text-sm font-medium text-accent"
          >
            Add part
          </button>
        </fieldset>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Calculate quote
          </button>
          <button
            type="button"
            onClick={loadExample}
            className="rounded-full border border-line px-4 py-2 text-sm font-medium"
          >
            Load worked example
          </button>
        </div>
        <p className="text-sm text-muted">
          The worked example in the README totals $72.45. The form turns dollars into cents
          before it calls <code>quoteJob</code>.
        </p>
      </form>

      <aside className="rounded-2xl border border-line bg-card p-5">
        <h2 className="text-sm font-medium uppercase tracking-[0.14em] text-muted">Quote</h2>
        {error ? (
          <p role="alert" className="mt-4 text-sm leading-6 text-warn">
            {error}
          </p>
        ) : null}
        {quote ? (
          <dl className="mt-4 grid gap-3 text-sm">
            <MoneyRow label="Labor" cents={quote.laborCents} />
            <MoneyRow label="Parts" cents={quote.partsCents} />
            <MoneyRow label="Surcharge" cents={quote.surchargeCents} />
            <MoneyRow label="Discount" cents={quote.discountCents} />
            <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3">
              <dt className="font-medium">Total</dt>
              <dd className="text-2xl font-semibold tabular-nums">
                {formatCents(quote.totalCents)}
              </dd>
            </div>
          </dl>
        ) : !error ? (
          <p className="mt-4 text-sm leading-6 text-muted">
            Calculate a quote to see the breakdown.
          </p>
        ) : null}
      </aside>
    </div>
  );
}

function MoneyRow({ label, cents }: { label: string; cents: number }) {
  const shown = label === "Discount" && cents > 0 ? `−${formatCents(cents)}` : formatCents(cents);

  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums">{shown}</dd>
    </div>
  );
}

let partSequence = 1;

function nextPartId(): string {
  partSequence += 1;
  return `part-${partSequence}`;
}
