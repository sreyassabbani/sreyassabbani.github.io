import { cp, lstat, mkdir, rm } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";

const root = process.cwd();
const mountPath = path.resolve(root, "src/content/blog");

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
        path.join(homedir(), "blog"),
        path.resolve(root, "../blog"),
    ].filter((candidate): candidate is string => Boolean(candidate));

    for (const candidate of sourceCandidates) {
        if (await pathExists(candidate)) {
            return candidate;
        }
    }

    return sourceCandidates[0] ?? path.join(homedir(), "blog");
}

async function ensureMountedBlog() {
    const sourcePath = await resolveSourcePath();
    const sourceExists = await pathExists(sourcePath);

    await mkdir(path.dirname(mountPath), { recursive: true });
    await rm(mountPath, { force: true, recursive: true });

    if (sourceExists) {
        await cp(sourcePath, mountPath, {
            recursive: true,
            filter: (entry) => !entry.split(path.sep).includes(".git"),
        });
        console.log(
            `[mount-blog] synced ${path.relative(root, sourcePath)} -> src/content/blog`,
        );
        return;
    }

    await mkdir(mountPath, { recursive: true });
    console.warn(
        `[mount-blog] no blog repo found at ${sourcePath}; using empty src/content/blog`,
    );
}

await ensureMountedBlog();
