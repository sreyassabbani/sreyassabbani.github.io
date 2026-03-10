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
bun install
bun run dev
```

## Deploy pattern

The deploy workflow checks out two separate repos:

```text
/
  blog/
  site/
```

Then it builds from `site/`. The build step sets `BLOG_CONTENT_DIR=../blog`, so the `prebuild` hook syncs the checked out blog repo into `site/src/content/blog` automatically.

## Why this setup is cleaner than submodules

- No submodule init/update workflow.
- Blog history and permissions stay isolated.
- The site repo builds the same way locally and in CI.
- Astro routes and `getCollection("blog")` code do not need to know where content came from.
