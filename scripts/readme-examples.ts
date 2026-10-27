// Run separately from bun test: README's Checks section itself invokes bun test.
import { strict as assert } from "node:assert";
import { COUPONS } from "../src/cart";

const root = `${import.meta.dir}/..`;
const readme = await Bun.file(`${root}/README.md`).text();
const commands: string[] = [];
for (const match of readme.matchAll(/```(?:sh|bash|shell)\s*\n([\s\S]*?)```/g)) {
  for (const line of match[1]!.split("\n")) {
    const command = line.trim().replace(/^\$ /, "");
    if (command && !command.startsWith("#")) commands.push(command);
  }
}
// Inline run examples are promises to users, too.
for (const match of readme.matchAll(/(?<!`)`((?:bun|npm) [^`\n]+)`(?!`)/g)) {
  commands.push(match[1]!);
}
assert(commands.length > 0, "README must contain executable examples");
let demos = 0;

function run(argv: string[]) {
  const result = Bun.spawnSync(argv, { cwd: root, timeout: 60_000 });
  assert.equal(result.exitCode, 0,
    `${argv.join(" ")} failed:\n${result.stderr.toString()}\n${result.stdout.toString()}`);
  return result.stdout.toString().trim();
}

for (const command of new Set(commands)) {
  // Run argv directly, never an arbitrary shell program from the README.
  assert(/^[A-Za-z0-9_./= -]+$/.test(command), `Unsupported example syntax: ${command}`);
  const argv = command.split(/\s+/);
  const isDemo = argv[0] === "bun" && argv.includes("src/index.ts");
  assert(isDemo || ["bun install", "bun install --frozen-lockfile", "bun run typecheck", "bun run test", "bun run build"].includes(command),
    `README command is not a supported project command: ${command}`);
  console.log(`README > ${command}`);
  const output = run([process.execPath, ...argv.slice(1)]);
  if (isDemo) {
    demos++;
    const coupon = argv.find(arg => Object.hasOwn(COUPONS, arg));
    const baseline = run([process.execPath, "src/index.ts"]);
    const expected = coupon ? run([process.execPath, "src/index.ts", coupon]) : baseline;
    assert.equal(output, expected, `${command} did not apply its advertised coupon`);
    assert.match(output, /^\d+ items, total \$\d+\.\d{2}$/, "Example must print a receipt");
    if (coupon) assert.notEqual(output, baseline, `${command} silently ignored ${coupon}`);
  }
}
assert(demos > 0, "README must demonstrate running src/index.ts");
console.log(`Verified ${new Set(commands).size} README commands, including ${demos} demo examples.`);
