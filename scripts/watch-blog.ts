import { type FSWatcher, watch } from "node:fs";
import path from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import {
    ensureMountedBlog,
    ignoredPathSegments,
    parseMountBlogArgs,
    pathExists,
    resolveSourcePath,
} from "./mount-blog";

const root = process.cwd();
const logPrefix = "[blog-watch]";
const args = process.argv.slice(2);
const skipInitialSync = args.includes("--skip-initial-sync");
const { includeUntracked } = parseMountBlogArgs(args);

let watcher: FSWatcher | null = null;
let watchedSourcePath: string | null = null;
let syncTimer: ReturnType<typeof setTimeout> | null = null;
let syncInFlight = false;
let rerunRequested = false;
let shuttingDown = false;

function isIgnoredRelativePath(relativePath: string | null | undefined) {
    if (!relativePath) return false;

    return relativePath
        .split(path.sep)
        .some((segment) => ignoredPathSegments.has(segment));
}

function scheduleSync() {
    if (syncTimer) {
        clearTimeout(syncTimer);
    }

    syncTimer = setTimeout(() => {
        syncTimer = null;
        void syncMount();
    }, 120);
}

async function syncMount() {
    if (syncInFlight) {
        rerunRequested = true;
        return;
    }

    syncInFlight = true;

    try {
        await ensureMountedBlog({ includeUntracked, logPrefix });

        const nextSourcePath = await resolveSourcePath();
        if (
            watchedSourcePath !== nextSourcePath &&
            (await pathExists(nextSourcePath))
        ) {
            await restartWatcher(nextSourcePath);
        }
    } catch (error) {
        console.error(`${logPrefix} sync failed`, error);
    } finally {
        syncInFlight = false;

        if (rerunRequested) {
            rerunRequested = false;
            scheduleSync();
        }
    }
}

function closeWatcher() {
    watcher?.close();
    watcher = null;
    watchedSourcePath = null;
}

async function waitForSourcePath() {
    while (!shuttingDown) {
        const sourcePath = await resolveSourcePath();
        if (await pathExists(sourcePath)) {
            return sourcePath;
        }

        console.warn(`${logPrefix} waiting for blog source at ${sourcePath}`);
        await sleep(2000);
    }

    return null;
}

async function restartWatcher(sourcePath?: string) {
    closeWatcher();

    const nextSourcePath = sourcePath ?? (await waitForSourcePath());
    if (!nextSourcePath || shuttingDown) {
        return;
    }

    watchedSourcePath = nextSourcePath;

    watcher = watch(
        nextSourcePath,
        { recursive: true },
        (_eventType, filename) => {
            const relativePath = typeof filename === "string" ? filename : null;

            if (isIgnoredRelativePath(relativePath)) {
                return;
            }

            scheduleSync();
        },
    );

    watcher.on("error", async (error) => {
        console.error(`${logPrefix} watcher error`, error);
        if (!shuttingDown) {
            await restartWatcher();
        }
    });

    console.log(
        `${logPrefix} watching ${path.relative(root, nextSourcePath) || nextSourcePath}`,
    );
}

function shutdown() {
    shuttingDown = true;

    if (syncTimer) {
        clearTimeout(syncTimer);
        syncTimer = null;
    }

    closeWatcher();
}

async function shutdownAndExit() {
    if (shuttingDown) {
        return;
    }

    shutdown();

    if (includeUntracked) {
        try {
            await ensureMountedBlog({ logPrefix: "[blog-watch:cleanup]" });
        } catch (error) {
            console.error(
                "[blog-watch:cleanup] failed to restore tracked-only mount",
                error,
            );
            process.exit(1);
        }
    }

    process.exit(0);
}

process.on("SIGINT", () => {
    void shutdownAndExit();
});

process.on("SIGTERM", () => {
    void shutdownAndExit();
});

if (!skipInitialSync) {
    await ensureMountedBlog({ includeUntracked, logPrefix });
}

await restartWatcher();
await new Promise(() => {});
