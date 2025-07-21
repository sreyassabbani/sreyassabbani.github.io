open BlogTypes
open BlogBindings

let getBlogsDirectory = (): string => process["cwd"]()->join("blog")

let filenameToSlug = (filename: string): string => parse(filename)["name"]

let getAllBlogSlugs: unit => array<string> = () => {
  let blogsDir = getBlogsDirectory()
  if existsSync(blogsDir) {
    readdirSync(blogsDir)
    |>Array.filter(file => {
      let parsed = parse(file)
      parsed["ext"] === ".mdx"
    })
    |>Array.map(filenameToSlug)
  } else {
    []
  }
}

let getBlogPost = (slug: string): option<blogPost> => {
  let filePath = getBlogsDirectory()->join(`${slug}.mdx`)
  if existsSync(filePath) {
    try {
      let fileContent = readFileSync(filePath, "utf8")
      let parsed = matter(fileContent)
      Some({
        slug,
        frontmatter: parsed["data"],
        content: parsed["content"],
      })
    } catch {
    | _ => None
    }
  } else {
    None
  }
}

let getAllBlogPosts = (): array<BlogTypes.blogListing> =>
  getAllBlogSlugs()
  ->Belt.Array.keepMap(slug =>
    getBlogPost(slug)
    |> Option.map((post: BlogTypes.blogPost) => {
         slug: post.slug,
         frontmatter: post.frontmatter,
       })
  );

let serializeMdx = async (content: string): Promise.t<mdxSource> => {
  let options = {
    "mdxOptions": {"remarkPlugins": [], "rehypePlugins": []}}
  serialize(content, options)
}
