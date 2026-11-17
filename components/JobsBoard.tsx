"use client";

import { useEffect, useState } from "react";
import { summarize } from "@/lib/jobs/board";
import { INTERVIEW_TODAY } from "@/lib/jobs/constants";
import { formatIsoDate, statusLabel } from "@/lib/jobs/format";
import { formatCents } from "@/lib/pricing/money";
import type { Job, StatusFilter } from "@/lib/jobs/types";

const FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "cancelled", label: "Cancelled" },
];

export function JobsBoard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      q: search,
      status,
      today: INTERVIEW_TODAY,
    });

    fetch(`/api/jobs?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        const body = (await response.json()) as {
          jobs?: Job[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(body.error ?? "Could not load jobs");
        }

        setJobs(body.jobs ?? []);
        setError(null);
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught)) return;
        setError(caught instanceof Error ? caught.message : "Could not load jobs");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps -- status is the only filter that should refetch

  const summary = summarize(jobs, INTERVIEW_TODAY);

  function markDone(id: string) {
    setJobs((current) =>
      current.map((job) =>
        job.id === id ? { ...job, status: "done" } : job,
      ),
    );
  }

  return (
    <section className="grid gap-6">
      <form
        className="grid gap-4 rounded-2xl border border-line bg-card p-4 sm:grid-cols-[1fr_220px]"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="grid gap-1.5 text-sm font-medium">
          Search
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Title or customer"
            className="rounded-xl border border-line bg-background px-3 py-2 font-normal outline-none focus-visible:outline-2 focus-visible:outline-accent"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="rounded-xl border border-line bg-background px-3 py-2 font-normal outline-none focus-visible:outline-2 focus-visible:outline-accent"
          >
            {FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Still open" value={String(summary.openCount)} />
        <SummaryCard label="Overdue" value={String(summary.overdueCount)} />
        <SummaryCard
          label="Active revenue"
          value={formatCents(summary.activeRevenueCents)}
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-warn">
          {error}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-background text-xs uppercase tracking-[0.14em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Job</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium">Estimate</th>
              <th className="px-4 py-3 font-medium">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-line">
                <td className="px-4 py-3">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-muted">{job.customer}</div>
                </td>
                <td className="px-4 py-3">{statusLabel(job.status)}</td>
                <td className="px-4 py-3 tabular-nums">{formatIsoDate(job.dueDate)}</td>
                <td className="px-4 py-3 tabular-nums">
                  {formatCents(job.estimatedCents)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => markDone(job.id)}
                    disabled={job.status === "done" || job.status === "cancelled"}
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:text-muted"
                  >
                    {job.status === "done"
                      ? "Done"
                      : job.status === "cancelled"
                        ? "Cancelled"
                        : "Mark done"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading ? (
          <p className="border-t border-line px-4 py-6 text-sm text-muted">Loading jobs…</p>
        ) : null}
        {!loading && jobs.length === 0 ? (
          <p className="border-t border-line px-4 py-6 text-sm text-muted">
            No jobs match this filter.
          </p>
        ) : null}
      </div>
    </section>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-line bg-card px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </article>
  );
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}
