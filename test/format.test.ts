import { expect, it } from "bun:test";
import { formatCents } from "../src/format";

it("formats whole dollars and cents", () => {
  expect(formatCents(1234)).toBe("$12.34");
  expect(formatCents(-250)).toBe("-$2.50");
});
