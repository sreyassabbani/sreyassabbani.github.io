open BlogTypes
open BlogBindings

// Get the blogs directory path
let getBlogsDirectory = () => {
  let cwd = process["cwd"]()
  join(cwd, "blogs")
}

// Convert filename to slug
let filenameToSlug = (filename: string) => {
  let parsed = parse(filename)
  parsed["name"]
}

// Get all blog post slugs
let getAllBlogSlugs = () => {
  let blogsDir = getBlogsDirectory()
  if existsSync(blogsDir) {
    readdirSync(blogsDir)
    ->Array.filter(file => {
      let parsed = parse(file)
      parsed["ext"] === ".mdx"
    })
    ->Array.map(filenameToSlug)
  } else {
    []
  }
}

// Read and parse a single blog post
let getBlogPost = (slug: string): option<blogPost> => {
  let blogsDir = getBlogsDirectory()
  let filePath = join(blogsDir, `${slug}.mdx`)
  
  if existsSync(filePath) {
    try {
      let fileContent = readFileSync(filePath, "utf8")
      let parsed = matter(fileContent)
      
      Some({
        slug: slug,
        frontmatter: parsed["data"],
        content: parsed["content"],
        compiledSource: "", // Will be populated by serializeMdx
      })
    } catch {
    | _ => None
    }
  } else {
    None
  }
}

// Get all blog posts for listing
let getAllBlogPosts = (): array<blogListing> => {
  getAllBlogSlugs()
  ->Array.map(slug => {
    switch getBlogPost(slug) {
    | Some(post) => Some({
        slug: post.slug,
        frontmatter: post.frontmatter,
      })
    | None => None
    }
  })
  ->Array.filterMap(x => x)
  ->Array.toSorted((a, b) => {
    // Sort by date descending
    String.compare(b.frontmatter.date, a.frontmatter.date)
  })
}

// Serialize MDX content for rendering
let serializeMdx = async (content: string): Promise.t<mdxSource> => {
  let options = {"mdxOptions": {"remarkPlugins": [], "rehypePlugins": []}}
  serialize(content, options)
}
