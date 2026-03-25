import { ensureMountedBlog } from "./mount-blog";

await ensureMountedBlog({
    backupExisting: true,
    logPrefix: "[pre-commit]",
});
