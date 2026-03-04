import { readFileSync } from "node:fs";

export interface BuildInfo {
  version: string;
  commit: string;
  buildTime: string;
}

function getCommit(): string {
  if (process.env.GIT_COMMIT) {
    return process.env.GIT_COMMIT;
  }

  try {
    return Bun.spawnSync(["git", "rev-parse", "--short", "HEAD"])
      .stdout.toString()
      .trim();
  } catch {
    return "unknown";
  }
}

function getVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8")) as {
      version?: string;
    };

    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

export const buildInfo: BuildInfo = {
  version: getVersion(),
  commit: getCommit(),
  buildTime: process.env.BUILD_TIME ?? new Date().toISOString(),
};
