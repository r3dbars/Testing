import { describe, expect, it } from "bun:test";
import { COUPONS, discount, shipping, subtotal, total, type LineItem } from "../src/cart";

const mug: LineItem = { sku: "mug", name: "Factory mug", priceCents: 1800, quantity: 2 };
const sticker: LineItem = { sku: "sticker", name: "Rocket sticker", priceCents: 350, quantity: 1 };

describe("cart", () => {
  it("adds up line items", () => {
    expect(subtotal([mug, sticker])).toBe(3950);
  });
  it("applies SAVE10 as ten percent of the subtotal", () => {
    expect(discount(3950, COUPONS.SAVE10)).toBe(395);
  });
  it("includes shipping in the SAVE10 total", () => {
    expect(total([mug, sticker], "SAVE10")).toBe(4154);
  });
  it("rounds percent discounts to whole cents", () => {
    expect(discount(3954, COUPONS.SAVE10)).toBe(395);
    expect(discount(3955, COUPONS.SAVE10)).toBe(396);
  });
  it("caps percent discounts at the subtotal", () => {
    expect(discount(3950, { code: "CAP", kind: "percent", amount: 150 })).toBe(3950);
  });
  it("applies a fixed coupon", () => {
    expect(discount(3950, COUPONS.FIVEOFF)).toBe(500);
    expect(total([mug, sticker], "FIVEOFF")).toBe(4049);
  });
  it("gives no discount without a coupon", () => {
    expect(discount(3950)).toBe(0);
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
