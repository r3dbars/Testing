import { formatCents } from "./format";

export const FREE_SHIPPING_CENTS = 5000;

/** The line under the cart total: how far the shopper is from free shipping. */
export function shippingNote(subtotalCents: number): string {
  const left = FREE_SHIPPING_CENTS - subtotalCents;
  return left <= 0 ? "Shipping is free." : `Add ${formatCents(left)} more for free shipping.`;
}
