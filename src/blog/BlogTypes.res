// Blog post frontmatter and content types
type frontmatter = {
  title: string,
  date: string,
  excerpt: string,
  tags: array<string>,
}

// TODO
type mdxSource;

type blogPost = {
  slug: string,
  frontmatter: frontmatter,
  content: string,
}


// Blog listing type
type blogListing = {
  slug: string,
  frontmatter: frontmatter,
}
