// Fixture projects prove the CI gate itself; the actual README is checked separately.
import { strict as assert } from "node:assert";
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = mkdtempSync(join(tmpdir(), "testing-readme-"));
try {
  cpSync(`${import.meta.dir}/../src`, `${root}/src`, { recursive: true });
  mkdirSync(`${root}/test`);
  cpSync(`${import.meta.dir}/readme-examples.ts`, `${root}/test/readme-examples.ts`);
  const build = Bun.spawnSync([process.execPath, "build", "src/index.ts", "--outdir", "dist", "--target", "bun"], { cwd: root });
  assert.equal(build.exitCode, 0, build.stderr.toString());
  const examples = (command: string) => `# CLI examples\n\n\`\`\`sh\nbun src/index.ts\n${command}\n\`\`\`\n`;
  const cases = [
    { name: "positional coupon", readme: examples("bun src/index.ts SAVE10"), passes: true },
    { name: "fixed coupon", readme: examples("bun run src/index.ts FIVEOFF"), passes: true },
    { name: "#12 ignored coupon flag", readme: examples("bun run src/index.ts --coupon SAVE10"), passes: false, error: "did not apply its advertised coupon" },
    { name: "inline ignored coupon flag", readme: examples("bun src/index.ts SAVE10") + "\nTry `bun src/index.ts --coupon FIVEOFF`.\n", passes: false, error: "did not apply its advertised coupon" },
    { name: "legacy npm setup", readme: examples("npm start"), passes: false, error: "not a supported project command" },
  ];
  for (const fixture of cases) {
    writeFileSync(`${root}/README.md`, fixture.readme);
    const result = Bun.spawnSync([process.execPath, "test/readme-examples.ts"], { cwd: root, timeout: 15_000 });
    const output = result.stdout.toString() + result.stderr.toString();
    assert.equal(result.exitCode === 0, fixture.passes, `${fixture.name}: unexpected exit ${result.exitCode}\n${output}`);
    if (fixture.error) assert(output.includes(fixture.error), `${fixture.name}: failed for the wrong reason\n${output}`);
    console.log(`PASS: ${fixture.name} — gate ${fixture.passes ? "accepts" : "rejects"}`);
  }
} finally {
  rmSync(root, { recursive: true, force: true });
}
