import { spawn, type ChildProcess } from "node:child_process";
import { ensureMountedBlog } from "./mount-blog";

const root = process.cwd();

function spawnProcess(
  cmd: string[],
  options: { stdin?: "ignore" | "inherit" } = {},
) {
  return spawn(cmd[0], cmd.slice(1), {
    cwd: root,
    env: process.env,
    stdio: [options.stdin ?? "ignore", "inherit", "inherit"],
  });
}

const waitForExit = (process: ChildProcess) =>
  new Promise<number | null>((resolve) => {
    process.once("exit", (code) => resolve(code));
  });

const terminate = (
  processes: ChildProcess[],
  signal: NodeJS.Signals = "SIGTERM",
) => {
  for (const process of processes) {
    try {
      process.kill(signal);
    } catch {
      // Ignore errors while shutting down sibling processes.
    }
  }
};

await ensureMountedBlog();

const watchProcess = spawnProcess(
  [process.execPath, "--bun", "./scripts/watch-blog.ts", "--skip-initial-sync"],
);

const astroProcess = spawnProcess(
  [process.execPath, "--bun", "./node_modules/.bin/astro", "dev"],
  { stdin: "inherit" },
);

const childProcesses = [watchProcess, astroProcess];

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    terminate(childProcesses, signal);
    process.exit(0);
  });
}

const { code } = await Promise.race([
  waitForExit(watchProcess).then((exitCode) => ({
    name: "watch",
    code: exitCode,
  })),
  waitForExit(astroProcess).then((exitCode) => ({
    name: "astro",
    code: exitCode,
  })),
]);

terminate(childProcesses);
await Promise.allSettled(childProcesses.map((process) => waitForExit(process)));

process.exit(code ?? 0);
