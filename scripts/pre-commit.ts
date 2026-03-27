import { spawnSync } from "node:child_process";
import path from "node:path";
import {
    ensureMountedBlog,
    listTrackedSourceFiles,
    mountPath,
    pathExists,
    resolveSourcePath,
} from "./mount-blog";

await ensureMountedBlog({
    backupExisting: true,
    logPrefix: "[pre-commit]",
});

const sourcePath = await resolveSourcePath();
const trackedSourceFiles = (await pathExists(sourcePath))
    ? new Set(listTrackedSourceFiles(sourcePath))
    : new Set<string>();

const stagedBlogPathsResult = spawnSync(
    "git",
    [
        "diff",
        "--cached",
        "--name-only",
        "-z",
        "--diff-filter=ACMR",
        "--",
        "src/content/blog",
    ],
    {
        encoding: "utf8",
    },
);

if (stagedBlogPathsResult.status !== 0) {
    const errorOutput = stagedBlogPathsResult.stderr.trim();
    throw new Error(
        errorOutput || "failed to inspect staged blog files in the site repo",
    );
}

const invalidStagedPaths = stagedBlogPathsResult.stdout
    .split("\0")
    .filter(Boolean)
    .map((stagedPath) =>
        path
            .relative(mountPath, path.resolve(process.cwd(), stagedPath))
            .replaceAll("\\", "/"),
    )
    .filter((relativePath) => !trackedSourceFiles.has(relativePath));

if (invalidStagedPaths.length > 0) {
    console.error(
        "[pre-commit] refusing commit because src/content/blog has staged files that are not tracked in the blog repo:",
    );

    for (const invalidStagedPath of invalidStagedPaths) {
        console.error(`  - ${invalidStagedPath}`);
    }

    process.exit(1);
}
