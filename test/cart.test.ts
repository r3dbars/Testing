import { describe, expect, it } from "bun:test";
import { discount, itemCount, shipping, subtotal, total, type LineItem } from "../src/cart";
import { formatCents } from "../src/format";

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
  it("counts quantities across lines", () => {
    expect(itemCount([mug, sticker])).toBe(3);
    expect(itemCount([])).toBe(0);
  });
  it("applies a percent coupon to the subtotal", () => {
    expect(discount(3950, { code: "SAVE10", kind: "percent", amount: 10 })).toBe(395);
    expect(total([mug, sticker], "SAVE10")).toBe(4154);
  });
  it("normalizes coupon case and surrounding whitespace", () => {
    const expected = total([mug, sticker], "SAVE10");
    expect(expected).toBe(4154);
    for (const code of ["save10", " SAVE10 ", " save10 "]) {
      expect(total([mug, sticker], code)).toBe(expected);
    }
  });
  it("ships orders at the threshold free", () => {
    expect(shipping(4999)).toBe(599);
    expect(shipping(5000)).toBe(0);
  });
  it("formats totals with two cents digits", () => {
    expect(formatCents(total([{ ...mug, priceCents: 5000, quantity: 1 }]))).toBe("$50.00");
    expect(formatCents(total([{ ...sticker, priceCents: 406, quantity: 1 }]))).toBe("$10.05");
    expect(formatCents(0)).toBe("$0.00");
    expect(formatCents(-5)).toBe("-$0.05");
    expect(formatCents(-1005)).toBe("-$10.05");
  });
});
