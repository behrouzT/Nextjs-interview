import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">
          MCI Digital B2B · Interview
        </p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Two tasks, one desk</h1>
        <p className="mt-4 text-lg leading-8 text-muted">
          Hearth & Circuit repairs laptops for a handful of local clients. The desk app
          prices a job, then lists the work in progress. Read <code>README.md</code> before
          you start. The tests are the checker.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/quote"
          className="rounded-2xl border border-line bg-card p-6 transition-colors hover:border-accent"
        >
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Task 1 · about 40 minutes
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Build the quote</h2>
          <p className="mt-3 leading-7 text-muted">
            Implement <code>quoteJob</code>. The form on this page already calls it. Labor,
            parts, rush fees, a repeat-customer discount, and a minimum charge.
          </p>
        </Link>
        <Link
          href="/jobs"
          className="rounded-2xl border border-line bg-card p-6 transition-colors hover:border-accent"
        >
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Task 2 · about 40 minutes
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Debug the jobs board</h2>
          <p className="mt-3 leading-7 text-muted">
            The list, the summary cards, and <code>GET /api/jobs</code> disagree with the
            rules. Find the bugs. Do not edit the tests.
          </p>
        </Link>
      </div>
    </main>
  );
}
