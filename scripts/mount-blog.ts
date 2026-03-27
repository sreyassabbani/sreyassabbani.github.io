import { spawnSync } from "node:child_process";
import { cp, lstat, mkdir, readdir, rm } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

const root = process.cwd();
export const mountPath = path.resolve(root, "src/content/blog");
export const ignoredPathSegments = new Set([".git", ".github"]);

export async function pathExists(targetPath: string) {
  try {
    await lstat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function resolveSourcePath() {
  const configuredSource = process.env.BLOG_CONTENT_DIR?.trim();
  const sourceCandidates = [
    configuredSource ? path.resolve(root, configuredSource) : undefined,
    path.join(homedir(), "workflow/blog"),
    path.resolve(root, "../blog"),
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const candidate of sourceCandidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }

  return sourceCandidates[0] ?? path.join(homedir(), "blog");
}

async function directoryHasEntries(targetPath: string) {
  try {
    const entries = await readdir(targetPath);
    return entries.length > 0;
  } catch {
    return false;
  }
}

function isIgnoredRelativePath(relativePath: string) {
  return relativePath
    .split(path.sep)
    .some((segment) => ignoredPathSegments.has(segment));
}

function listTrackedSourceFiles(sourcePath: string) {
  const result = spawnSync("git", ["-C", sourcePath, "ls-files", "-z"], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const errorOutput = result.stderr.trim();
    throw new Error(
      errorOutput || `failed to list tracked files in ${sourcePath}`,
    );
  }

  return result.stdout
    .split("\0")
    .filter(Boolean)
    .filter((relativePath) => !isIgnoredRelativePath(relativePath));
}

async function copyTrackedSourceFiles(sourcePath: string) {
  const trackedFiles = listTrackedSourceFiles(sourcePath);

  for (const relativePath of trackedFiles) {
    const sourceFilePath = path.join(sourcePath, relativePath);

    if (!(await pathExists(sourceFilePath))) {
      continue;
    }

    const mountFilePath = path.join(mountPath, relativePath);

    await mkdir(path.dirname(mountFilePath), { recursive: true });
    await cp(sourceFilePath, mountFilePath, { force: true });
  }

  return trackedFiles.length;
}

type EnsureMountedBlogOptions = {
  backupExisting?: boolean;
  backupRoot?: string;
  logPrefix?: string;
};

export async function ensureMountedBlog(
  options: EnsureMountedBlogOptions = {},
) {
  const {
    backupExisting = false,
    backupRoot = path.resolve(root, ".blog-sync-backups"),
    logPrefix = "[mount-blog]",
  } = options;
  const sourcePath = await resolveSourcePath();
  const sourceExists = await pathExists(sourcePath);
  const mountExists = await pathExists(mountPath);

  await mkdir(path.dirname(mountPath), { recursive: true });

  if (
    backupExisting &&
    mountExists &&
    (await directoryHasEntries(mountPath))
  ) {
    const stamp = new Date().toISOString().replaceAll(":", "-");
    const backupPath = path.join(backupRoot, stamp);

    await mkdir(backupRoot, { recursive: true });
    await cp(mountPath, backupPath, { recursive: true });
    console.log(
      `${logPrefix} backed up existing src/content/blog -> ${path.relative(root, backupPath)}`,
    );
  }

  await rm(mountPath, { force: true, recursive: true });

  if (sourceExists) {
    await mkdir(mountPath, { recursive: true });
    const trackedFileCount = await copyTrackedSourceFiles(sourcePath);
    console.log(
      `${logPrefix} synced ${trackedFileCount} tracked files from ${path.relative(root, sourcePath)} -> src/content/blog`,
    );
    return;
  }

  await mkdir(mountPath, { recursive: true });
  console.warn(
    `${logPrefix} no blog repo found at ${sourcePath}; using empty src/content/blog`,
  );
}

if (import.meta.main) {
  await ensureMountedBlog();
}
