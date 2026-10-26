import { describe, expect, it } from "bun:test";
import { discount, shipping, subtotal, total, type LineItem } from "../src/cart";

const mug: LineItem = { sku: "mug", name: "Factory mug", priceCents: 1800, quantity: 2 };
const sticker: LineItem = { sku: "sticker", name: "Rocket sticker", priceCents: 350, quantity: 1 };

describe("cart", () => {
  it("adds up line items", () => {
    expect(subtotal([mug, sticker])).toBe(3950);
  });
  it("applies a fixed coupon", () => {
    expect(discount(3950, { code: "FIVEOFF", kind: "fixed", amount: 500 })).toBe(500);
  });
  it("charges shipping on small orders", () => {
    expect(shipping(1000)).toBe(599);
  });
  it("ships big orders free", () => {
    expect(shipping(8000)).toBe(0);
  });
  it("totals a cart with no coupon", () => {
    expect(total([mug, sticker])).toBe(3950 + 599);
  });
});
