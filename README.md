# sreyas.is

Astro site repo with blog content kept in a separate git repo.

## Recommended layout

```text
workspace/
  blog/   # content repo
  site/   # this repo
```

`src/content/blog` is not committed. It is generated automatically before `bun run dev` and `bun run build`.
By default, only blog content files tracked by git in the blog repo are synced into the site repo; untracked drafts, scratch files, repo metadata, and the blog repo `README.md` / `LICENSE` stay out of `src/content/blog`.

## How mounting works

- If `BLOG_CONTENT_DIR` is set, the site copies content from that path.
- Otherwise it looks for `~/workflow/blog`.
- If that does not exist, it falls back to a sibling repo at `../blog`.
- If neither exists, it creates an empty `src/content/blog` directory so the site still builds.

That keeps Astro's content collection setup unchanged while avoiding submodules entirely. The copy step is important because MDX files can use relative imports that need to resolve from inside the site repo.

## Local development

```bash
git clone git@github.com:sreyassabbani/blog ~/workflow/blog
git clone git@github.com:sreyassabbani/sreyas.is ~/workflow/sreyas.is
cd ~/workflow/sreyas.is
direnv allow
bun install
bun run dev
```

While `bun run dev` is running, the site now watches `~/workflow/blog` (or `BLOG_CONTENT_DIR`) and re-syncs `src/content/blog` automatically whenever the blog repo changes.

If you want drafts and other untracked files to appear temporarily during local development, run:

```bash
bun run dev -- --show-untracked
```

That mode includes untracked blog files while the dev command is alive, then restores `src/content/blog` back to tracked-only content when the process exits normally.

## Helix / Nix / direnv

- `flake.nix` now provides `bun`, `node`, and `nu`.
- The Nix shell prepends `node_modules/.bin` to `PATH`, so repo-local tools like `astro-ls` and `typescript-language-server` are visible to Helix.
- `.helix/languages.toml` points `.astro`, `.ts`, `.tsx`, `.js`, and `.jsx` files at the right language servers without needing global installs.
- `tsconfig.json` enables `@astrojs/ts-plugin`, which is what teaches TypeScript-aware editors how to understand `.astro` imports outside VS Code.
- `bun run typecheck` runs `astro check`, which covers both `.astro` files and normal TypeScript files.
- `bun run blog:sync` refreshes the generated `src/content/blog` mount from `~/workflow/blog` or `BLOG_CONTENT_DIR`.
- `bun run blog:watch` keeps the generated mount in sync continuously while you work.
- `bun run blog:sync -- --show-untracked` and `bun run blog:watch -- --show-untracked` temporarily include untracked files too.

If you launch Helix from Nushell, make sure your Nushell config loads `direnv` first so the flake shell environment reaches `hx`.

## Pre-commit sync

This repo now installs a versioned `pre-commit` hook through `simple-git-hooks`.

- Every site-repo commit re-syncs `src/content/blog` from the real blog source.
- Before overwriting the generated mount, it writes a timestamped backup to `.blog-sync-backups/`.
- If `src/content/blog` has staged files that are not tracked in `~/workflow/blog`, the commit is blocked.
- `~/workflow/blog` is still the source of truth. `src/content/blog` stays generated and gitignored.

## Deploy pattern

The deploy workflow checks out two separate repos:

```text
/
  blog/
  site/
```

Then it builds from `site/`. The build step sets `BLOG_CONTENT_DIR=../blog`, so the `prebuild` hook syncs the checked out blog repo into `site/src/content/blog` automatically.

Blog pushes can trigger this deploy workflow directly through a `repository_dispatch` event. To enable that, add a `SITE_REPO_DISPATCH_TOKEN` secret in the `blog` repo with permission to dispatch workflows in `sreyassabbani/sreyassabbani.github.io`.

## Why this setup is cleaner than submodules

- No submodule init/update workflow.
- Blog history and permissions stay isolated.
- The site repo builds the same way locally and in CI.
- Astro routes and `getCollection("blog")` code do not need to know where content came from.
