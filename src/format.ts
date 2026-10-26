export function formatCents(cents: number): string {
  const dollars = Math.floor(Math.abs(cents) / 100);
  const rest = Math.abs(cents) % 100;
  return `${cents < 0 ? "-" : ""}$${dollars}.${rest}`;
}
