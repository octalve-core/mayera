import { rmSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const buildDirectory = resolve(projectRoot, ".next");

if (
  buildDirectory !== `${projectRoot}/.next` &&
  buildDirectory !== `${projectRoot}\\.next`
) {
  throw new Error("Refusing to clean an unexpected path.");
}

rmSync(buildDirectory, { recursive: true, force: true });
console.log(
  "Removed the local Next.js cache. It will be rebuilt on the next start.",
);
