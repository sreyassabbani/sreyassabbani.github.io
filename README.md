# sreyas.is

Astro site repo with blog content kept in a separate git repo.

## Recommended layout

```text
workspace/
  blog/   # content repo
  site/   # this repo
```

`src/content/blog` is not committed. It is generated automatically before `bun run dev` and `bun run build`.

## How mounting works

- If `BLOG_CONTENT_DIR` is set, the site copies content from that path.
- Otherwise it looks for `~/blog`.
- If that does not exist, it falls back to a sibling repo at `../blog`.
- If neither exists, it creates an empty `src/content/blog` directory so the site still builds.

That keeps Astro's content collection setup unchanged while avoiding submodules entirely. The copy step is important because MDX files can use relative imports that need to resolve from inside the site repo.

## Local development

```bash
git clone git@github.com:sreyassabbani/blog ~/blog
git clone git@github.com:sreyassabbani/sreyas.is ~/site
cd ~/site
direnv allow
bun install
bun run dev
```

## Helix / Nix / direnv

- `flake.nix` now provides `bun`, `node`, and `nu`.
- The Nix shell prepends `node_modules/.bin` to `PATH`, so repo-local tools like `astro-ls` and `typescript-language-server` are visible to Helix.
- `.helix/languages.toml` points `.astro`, `.ts`, `.tsx`, `.js`, and `.jsx` files at the right language servers without needing global installs.
- `tsconfig.json` enables `@astrojs/ts-plugin`, which is what teaches TypeScript-aware editors how to understand `.astro` imports outside VS Code.
- `bun run typecheck` runs `astro check`, which covers both `.astro` files and normal TypeScript files.

If you launch Helix from Nushell, make sure your Nushell config loads `direnv` first so the flake shell environment reaches `hx`.

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
