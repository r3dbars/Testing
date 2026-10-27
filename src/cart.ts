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
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

if (import.meta.main) {
  const mugs: LineItem = { sku: "mug", name: "Mug", priceCents: 1000, quantity: 2 };
  const sticker: LineItem = { sku: "sticker", name: "Sticker", priceCents: 100, quantity: 1 };
  for (const [items, expected] of [
    [[mugs, sticker], 3],
    [[mugs], 2],
    [[], 0],
  ] as [LineItem[], number][]) {
    const actual = itemCount(items);
    if (actual !== expected) {
      throw new Error(`itemCount: expected ${expected}, got ${actual}`);
    }
  }
}

export function discount(subtotalCents: number, coupon?: Coupon): number {
  if (!coupon) return 0;
  if (coupon.kind === "fixed") return Math.min(coupon.amount, subtotalCents);
  return Math.min(coupon.amount, subtotalCents);
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
