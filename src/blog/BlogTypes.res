// Blog post frontmatter and content types
type frontmatter = {
  title: string,
  date: string,
  excerpt: string,
  tags: array<string>,
}

type blogPost = {
  slug: string,
  frontmatter: frontmatter,
  content: string,
  compiledSource: string,
}

// MDX compilation result
type mdxSource = {
  compiledSource: string,
  frontmatter: frontmatter,
}

// Blog listing type
type blogListing = {
  slug: string,
  frontmatter: frontmatter,
}
