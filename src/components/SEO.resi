// SEO component interface
type seoProps = {
  title?: string,
  description?: string,
  keywords?: array<string>,
  ogImage?: string,
  ogUrl?: string,
  twitterCard?: string,
  canonical?: string,
  noindex?: bool,
}

let defaultTitle: string
let defaultDescription: string
let defaultKeywords: array<string>
let siteUrl: string

@react.component
let make: (
  ~title: string=?,
  ~description: string=?,
  ~keywords: array<string>=?,
  ~ogImage: string=?,
  ~ogUrl: string=?,
  ~twitterCard: string=?,
  ~canonical: string=?,
  ~noindex: bool=?,
) => React.element
