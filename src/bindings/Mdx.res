// MDX bindings for ReScript

module MdxChildren = {
  type t = React.element
}

module Components = {
  type unknown = React.element
}

// MDX Remote component binding
@module("next-mdx-remote")
external mdxRemote: {"source": string, "options": 'a} => React.element = "MDXRemote"
