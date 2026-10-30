import { expect, it } from "bun:test";
import { formatCents } from "../src/format";

it("formats whole dollars and cents", () => {
  expect(formatCents(1234)).toBe("$12.34");
  expect(formatCents(-250)).toBe("-$2.50");
});

it("formats cents with two digits", () => {
  expect(formatCents(1205)).toBe("$12.05");
  expect(formatCents(307)).toBe("$3.07");
  expect(formatCents(-307)).toBe("-$3.07");
  expect(formatCents(1200)).toBe("$12.00");
  expect(formatCents(-1200)).toBe("-$12.00");
  expect(formatCents(0)).toBe("$0.00");
});
