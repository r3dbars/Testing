import { expect, it } from "bun:test";

function run(...args: string[]) {
  const result = Bun.spawnSync([process.execPath, "src/index.ts", ...args], {
    cwd: `${import.meta.dir}/..`,
    timeout: 10_000,
  });
  expect(result.exitCode).toBe(0);
  expect(result.stderr.toString()).toBe("");
  return result.stdout.toString().trim();
}

it("runs the demo without a coupon", () => {
  expect(run()).toMatch(/^\d+ items, total \$45\.49$/);
});

it("forwards the positional fixed coupon to pricing", () => {
  expect(run("FIVEOFF")).toMatch(/^\d+ items, total \$40\.49$/);
  expect(run("FIVEOFF")).not.toBe(run());
});

it("does not silently ignore the documented percentage coupon", () => {
  const amount = (output: string) => Number(output.split("$")[1]);
  // The separate SAVE10 arithmetic repair belongs to #1. This guards argument forwarding.
  expect(amount(run("SAVE10"))).toBeLessThan(amount(run()));
});
