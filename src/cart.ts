// A tiny shop cart. Money is always whole cents.

export interface LineItem {
  sku: string;
  name: string;
  priceCents: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  kind: "percent" | "fixed";
  // percent: 10 means 10% off. fixed: cents off.
  amount: number;
}

export const FREE_SHIPPING_CENTS = 5000;
export const SHIPPING_CENTS = 599;

export const COUPONS: Record<string, Coupon> = {
  SAVE10: { code: "SAVE10", kind: "percent", amount: 10 },
  FIVEOFF: { code: "FIVEOFF", kind: "fixed", amount: 500 },
};

export function subtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
}

export function itemCount(items: LineItem[]): number {
  return items.length;
}

export function discount(subtotalCents: number, coupon?: Coupon): number {
  if (!coupon) return 0;
  if (coupon.kind === "fixed") return Math.min(coupon.amount, subtotalCents);
  return Math.min(Math.round(subtotalCents * coupon.amount / 100), subtotalCents);
}

export function shipping(afterDiscountCents: number): number {
  if (afterDiscountCents === 0) return 0;
  return afterDiscountCents > FREE_SHIPPING_CENTS ? 0 : SHIPPING_CENTS;
}

export function total(items: LineItem[], couponCode?: string): number {
  const sub = subtotal(items);
  const coupon = couponCode ? COUPONS[couponCode] : undefined;
  const after = sub - discount(sub, coupon);
  return after + shipping(after);
}

export function testCartDiscounts(): void {
  const items: LineItem[] = [
    { sku: "a", name: "Item A", priceCents: 2000, quantity: 1 },
    { sku: "b", name: "Item B", priceCents: 1950, quantity: 1 },
  ];
  const checks: [string, number, number][] = [
    ["demo subtotal", subtotal(items), 3950],
    ["receipt item count", itemCount(items), 2],
    ["SAVE10 discount", discount(3950, COUPONS.SAVE10), 395],
    ["SAVE10 total including shipping", total(items, "SAVE10"), 4154],
    ["percent rounding", discount(3955, COUPONS.SAVE10), 396],
    ["percent cap", discount(3950, { code: "CAP", kind: "percent", amount: 150 }), 3950],
    ["FIVEOFF discount", discount(3950, COUPONS.FIVEOFF), 500],
    ["FIVEOFF total", total(items, "FIVEOFF"), 4049],
    ["no coupon discount", discount(3950), 0],
    ["no coupon total", total(items), 4549],
  ];
  for (const [label, actual, expected] of checks) {
    if (actual !== expected) {
      throw new Error(`${label}: expected ${expected}, got ${actual}`);
    }
  }
}
