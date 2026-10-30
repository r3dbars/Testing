import { expect, it } from "bun:test";
import { shippingNote } from "../src/shipping";

it("says how much more gets free shipping", () => {
  expect(shippingNote(4000)).toBe("Add $10.00 more for free shipping.");
  expect(shippingNote(4995)).toBe("Add $0.05 more for free shipping.");
});

it("says shipping is free at the threshold", () => {
  expect(shippingNote(5000)).toBe("Shipping is free.");
});
