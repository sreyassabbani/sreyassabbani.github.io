// Node.js filesystem bindings
@module("fs")
external readFileSync: (string, string) => string = "readFileSync"

@module("fs")
external readdirSync: string => array<string> = "readdirSync"

@module("fs")
external existsSync: string => bool = "existsSync"

@module("path")
external join: (string, string) => string = "join"

@module("path")
external parse: string => {"name": string, "ext": string} = "parse"

// Next.js MDX Remote bindings
@module("next-mdx-remote/serialize")
external serialize: (string, 'a) => Promise.t<BlogTypes.mdxSource> = "serialize"

// Gray-matter for frontmatter parsing
@module("gray-matter")
external matter: string => {"data": BlogTypes.frontmatter, "content": string} = "default"

// Process and __dirname bindings
@val external process: {"cwd": unit => string} = "process"
@val external __dirname: string = "__dirname"
