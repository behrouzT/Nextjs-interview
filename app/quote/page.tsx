import { QuoteForm } from "@/components/QuoteForm";

export default function QuotePage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-10">
      <div className="max-w-2xl">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-accent">Task 1</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Quote a repair</h1>
        <p className="mt-3 leading-7 text-muted">
          Pricing rules live in the README. Implement them in{" "}
          <code>lib/pricing/quote.ts</code>, then run <code>npm test</code>. This form is
          only a way to try the function.
        </p>
      </div>
      <QuoteForm />
    </main>
  );
}
