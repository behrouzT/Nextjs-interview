# MCI Digital B2B interview

Interview exercise for the **MCI Digital B2B** department. About **90 minutes**: build a pricing function, debug the jobs board, then match the sign-in screen to the Figma handoff.

The app is a small internal tool for a repair shop. It prices a job, and it lists the jobs already on the bench.

## Setup

You need Node.js 20.9 or newer.

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm test` runs the suite once. `npm run test:watch` keeps it running.

A few tests already pass. They describe behavior that should stay. The rest are red until you finish the work. **Do not edit `*.test.ts` or `*.test.tsx` files.** You may add new files.

Use documentation freely.

## Task 1 — Build the quote

Implement `quoteJob` in `lib/pricing/quote.ts`. The form on `/quote` already calls it. The form converts dollar inputs into cents. Your function works in **integer cents** only.

```ts
quoteJob({
  laborMinutes: number,
  laborRateCentsPerHour: number,
  parts: { name: string; priceCents: number; quantity: number }[],
  priority: string,
  isRepeatCustomer: boolean,
}): {
  laborCents: number,
  partsCents: number,
  surchargeCents: number,
  discountCents: number,
  totalCents: number,
}
```

`parts` may be an empty array. Do not mutate the array you receive.

### Order of work

Round **half up** at each step, for these positive amounts that is `Math.round`. Do not wait and round once at the end.

1. **Labor** = `round(laborMinutes × laborRateCentsPerHour / 60)`.
2. **Parts** = the sum of `priceCents × quantity`.
3. **Surcharge** = `round((labor + parts) × percent / 100)`.
   - `standard` → 0%
   - `rush` → 15%
   - `emergency` → 35%
4. **Discount** = `round((labor + parts + surcharge) × 10 / 100)` when `isRepeatCustomer` is true, otherwise `0`. The discount comes after the surcharge.
5. **Total** = labor + parts + surcharge − discount.
6. **Minimum.** If `laborMinutes > 0` or there is at least one part line, and the total is under `2500` cents ($25), set the total to `2500`. Leave labor, parts, surcharge, and discount as they were. A part priced at `0` still counts as a part line. A rate of `0` with minutes above `0` still counts as labor. An empty job (no minutes and no parts) stays at `0`.

### Worked example

30 minutes at $80/hour (`8000` cents), one part "Cable" at $15 × 2, rush, repeat customer.

| Line | Cents |
| --- | --- |
| Labor | 4000 |
| Parts | 3000 |
| Surcharge (15% of 7000) | 1050 |
| Discount (10% of 8050) | 805 |
| Total | 7245 |

The quote page can load this example. A correct implementation shows **$72.45**.

### Invalid input

Throw an `Error` whose message is **exactly** one of these, and throw before you return a quote:

- `laborMinutes must be a non-negative integer`
- `laborRateCentsPerHour must be a non-negative integer`
- `part quantity must be a positive integer`
- `part priceCents must be a non-negative integer`
- `priority must be standard, rush, or emergency`

Quantity must be an integer of 1 or more. Prices and labor must be integers of 0 or more. Part names are not validated.

## Task 2 — Debug the jobs board

`/jobs` and `GET /api/jobs` should follow the same rules. Something in the current code does not. The failing tests name the expected behavior. The screen should match.

Today for this exercise is **16 November 2026** (`2026-11-16` in `lib/jobs/constants.ts`).

### Search and status

`filterJobs` keeps a job when:

- `status` is `"all"`, or equal to the job's status, and
- `search` is empty, or it is a case-insensitive substring of the **title or the customer**. Trim the search first.

### Sort

`sortByDueDate` returns the soonest `dueDate` first (`YYYY-MM-DD` sorts correctly as text). When two dates match, the smaller `id` comes first. Do not mutate the array you were given.

### Summary

`summarize(jobs, today)` describes **that list**, after filtering:

- `openCount` — status is `open` or `in_progress`
- `overdueCount` — still open by that definition, and `dueDate` is **before** today. A job due today is not overdue. Done and cancelled jobs are not overdue.
- `activeRevenueCents` — sum of `estimatedCents` for every job that is not `cancelled`

### API

`GET /api/jobs`

| Query | Meaning |
| --- | --- |
| `search` | Same rules as above. Missing means empty. |
| `status` | `all`, `open`, `in_progress`, `done`, or `cancelled`. Missing means `all`. |
| `today` | ISO date. Missing means `2026-11-16`. |

Any other `status` responds with **400** and this body:

```json
{ "error": "Invalid status" }
```

A successful response is **200**:

```json
{
  "jobs": [],
  "summary": { "openCount": 0, "overdueCount": 0, "activeRevenueCents": 0 }
}
```

`jobs` is filtered, then sorted. `summary` is computed from those filtered jobs.

### Screen

- The search box refetches as you type. There is no submit button. The request uses the `search` parameter.
- The status dropdown refetches immediately.
- The three cards describe the jobs in the list.
- **Mark done** changes that one job to `done` in the browser and the cards follow. It does not need to survive a refresh.

Likely files: `lib/jobs/board.ts`, `app/api/jobs/route.ts`, `components/JobsBoard.tsx`.

## Task 3 — Match the sign-in screen

`/login` already works. About **10 minutes**. Make it look like the Figma Dev Mode export in `design/login.fig.json`.

Match **Login / Desktop** and **Login / Mobile**: the brand panel, the card, the type, the colors, the radius, and the spacing. Keep the behavior as it is.

- An empty email or password still shows only that field's hint.
- `tech@hearth.test` / `bench-4242` still opens `/jobs`.
- Any other pair still shows "That email and password do not match."

## Done when

- `npm test` passes
- The worked example on `/quote` shows $72.45
- `/jobs` matches the rules above when you search, filter, and mark a job done
- `/login` matches `design/login.fig.json` on a desktop width and a mobile width, including the empty, invalid, and success paths
