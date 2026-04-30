// @ts-check
import { context } from "esbuild";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: ["src/extension.ts"],
  bundle: true,
  format: "cjs",
  minify: production,
  sourcemap: !production,
  sourcesContent: false,
  platform: "node",
  outfile: "dist/extension.js",
  external: ["vscode"],
  logLevel: "silent",
  plugins: [
    {
      name: "build-reporter",
      setup(build) {
        build.onStart(() => {
          console.log(`[${new Date().toLocaleTimeString()}] build started`);
        });
        build.onEnd((result) => {
          for (const { text, location } of result.errors) {
            console.error(`✘ [ERROR] ${text}`);
            if (location) {
              console.error(
                `    ${location.file}:${location.line}:${location.column}:`,
              );
            }
          }
          console.log(
            `[${new Date().toLocaleTimeString()}] build finished ${result.errors.length === 0 ? "✓" : "✗"}`,
          );
        });
      },
    },
  ],
};

async function main() {
  const ctx = await context(buildOptions);
  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
