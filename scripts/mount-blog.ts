import { cp, lstat, mkdir, readdir, rm } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

const root = process.cwd();
const mountPath = path.resolve(root, "src/content/blog");
const ignoredPathSegments = new Set([".git", ".github"]);

async function pathExists(targetPath: string) {
  try {
    await lstat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function resolveSourcePath() {
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
    await cp(sourcePath, mountPath, {
      recursive: true,
      filter: (entry) =>
        !entry
          .split(path.sep)
          .some((segment) => ignoredPathSegments.has(segment)),
    });
    console.log(
      `${logPrefix} synced ${path.relative(root, sourcePath)} -> src/content/blog`,
    );
    return;
  }

  await mkdir(mountPath, { recursive: true });
  console.warn(
    `${logPrefix} no blog repo found at ${sourcePath}; using empty src/content/blog`,
  );
}

await ensureMountedBlog();
