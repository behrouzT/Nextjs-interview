export function formatCents(cents: number): string {
  const negative = cents < 0;
  const absolute = Math.abs(cents);
  const dollars = Math.floor(absolute / 100);
  const remainder = absolute % 100;
  const formatted = `$${dollars.toLocaleString("en-US")}.${remainder
    .toString()
    .padStart(2, "0")}`;

  return negative ? `-${formatted}` : formatted;
}
