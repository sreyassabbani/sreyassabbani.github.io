import { spawnSync } from "node:child_process";
import { cp, lstat, mkdir, readdir, rm } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

const root = process.cwd();
export const mountPath = path.resolve(root, "src/content/blog");
export const ignoredPathSegments = new Set([".git", ".github"]);
export const showUntrackedFlag = "--show-untracked";

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
        .replaceAll("\\", "/")
        .split("/")
        .some((segment) => ignoredPathSegments.has(segment));
}

export function listTrackedSourceFiles(sourcePath: string) {
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

function listSourceFiles(
    sourcePath: string,
    options: { includeUntracked?: boolean } = {},
) {
    const { includeUntracked = false } = options;
    const gitArgs = includeUntracked
        ? [
              "-C",
              sourcePath,
              "ls-files",
              "-z",
              "--cached",
              "--others",
              "--exclude-standard",
          ]
        : ["-C", sourcePath, "ls-files", "-z"];
    const result = spawnSync("git", gitArgs, {
        encoding: "utf8",
    });

    if (result.status !== 0) {
        const errorOutput = result.stderr.trim();
        throw new Error(
            errorOutput || `failed to list source files in ${sourcePath}`,
        );
    }

    return result.stdout
        .split("\0")
        .filter(Boolean)
        .filter((relativePath) => !isIgnoredRelativePath(relativePath));
}

async function copySourceFiles(
    sourcePath: string,
    options: { includeUntracked?: boolean } = {},
) {
    const sourceFiles = listSourceFiles(sourcePath, options);
    let copiedFileCount = 0;

    for (const relativePath of sourceFiles) {
        const sourceFilePath = path.join(sourcePath, relativePath);

        if (!(await pathExists(sourceFilePath))) {
            continue;
        }

        const mountFilePath = path.join(mountPath, relativePath);

        await mkdir(path.dirname(mountFilePath), { recursive: true });
        await cp(sourceFilePath, mountFilePath, { force: true });
        copiedFileCount += 1;
    }

    return copiedFileCount;
}

type EnsureMountedBlogOptions = {
    backupExisting?: boolean;
    backupRoot?: string;
    includeUntracked?: boolean;
    logPrefix?: string;
};

export function parseMountBlogArgs(argv = process.argv.slice(2)) {
    return {
        includeUntracked: argv.includes(showUntrackedFlag),
    };
}

export async function ensureMountedBlog(
    options: EnsureMountedBlogOptions = {},
) {
    const {
        backupExisting = false,
        backupRoot = path.resolve(root, ".blog-sync-backups"),
        includeUntracked = false,
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
        const syncedFileCount = await copySourceFiles(sourcePath, {
            includeUntracked,
        });
        const syncModeLabel = includeUntracked ? "files" : "tracked files";
        console.log(
            `${logPrefix} synced ${syncedFileCount} ${syncModeLabel} from ${path.relative(root, sourcePath)} -> src/content/blog`,
        );
        return;
    }

    await mkdir(mountPath, { recursive: true });
    console.warn(
        `${logPrefix} no blog repo found at ${sourcePath}; using empty src/content/blog`,
    );
}

if (import.meta.main) {
    await ensureMountedBlog(parseMountBlogArgs());
}
