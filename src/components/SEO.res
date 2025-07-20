// SEO component for managing meta tags dynamically
@module("next/head") external head: React.component<{..}> = "default"

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

let defaultTitle = "Sreyas Sabbani - Math, Physics & CS Enthusiast"
let defaultDescription = "I'm a math, physics, and CS enthusiast sharing insights about science, tech, and art. Explore my blog posts, projects, and thoughts on modern learning."
let defaultKeywords = ["sreyas sabbani", "math", "physics", "computer science", "blog", "rescript", "web development", "programming"]
let siteUrl = App.url

@react.component
let make = (
  ~title=?,
  ~description=?,
  ~keywords=?,
  ~ogImage=?,
  ~ogUrl=?,
  ~twitterCard="summary_large_image",
  ~canonical=?,
  ~noindex=false,
) => {
  let pageTitle = switch title {
  | Some(t) => `${t} | ${defaultTitle}`
  | None => defaultTitle
  }
  
  let pageDescription = Belt.Option.getWithDefault(description, defaultDescription)
  let pageKeywords = Belt.Option.getWithDefault(keywords, defaultKeywords)
  let keywordsString = Js.Array.joinWith(", ", pageKeywords)
  
  let ogImageUrl = Belt.Option.getWithDefault(ogImage, `${siteUrl}/static/profile-pic.png`)
  let ogUrlFinal = Belt.Option.getWithDefault(ogUrl, siteUrl)
  let canonicalUrl = Belt.Option.getWithDefault(canonical, ogUrlFinal)
  
  React.createElement(head, {
    "children": React.array([
      // Basic meta tags
      <title key="title"> {React.string(pageTitle)} </title>,
      <meta key="description" name="description" content=pageDescription />,
      <meta key="keywords" name="keywords" content=keywordsString />,
      
      // Canonical URL
      <link key="canonical" rel="canonical" href=canonicalUrl />,
      
      // Robots meta
      <meta 
        key="robots" 
        name="robots" 
        content={noindex ? "noindex, nofollow" : "index, follow"} 
      />,
      
      // Open Graph tags
      <meta key="og:type" property="og:type" content="website" />,
      <meta key="og:site_name" property="og:site_name" content="Sreyas Sabbani" />,
      <meta key="og:title" property="og:title" content=pageTitle />,
      <meta key="og:description" property="og:description" content=pageDescription />,
      <meta key="og:image" property="og:image" content=ogImageUrl />,
      <meta key="og:url" property="og:url" content=ogUrlFinal />,
      <meta key="og:locale" property="og:locale" content="en_US" />,
      
      // Twitter Card tags
      <meta key="twitter:card" name="twitter:card" content=twitterCard />,
      <meta key="twitter:site" name="twitter:site" content="@sreyassabbani" />,
      <meta key="twitter:creator" name="twitter:creator" content="@sreyassabbani" />,
      <meta key="twitter:title" name="twitter:title" content=pageTitle />,
      <meta key="twitter:description" name="twitter:description" content=pageDescription />,
      <meta key="twitter:image" name="twitter:image" content=ogImageUrl />,
      
      // Additional meta tags for better SEO
      <meta key="theme-color" name="theme-color" content="#6180B0" />,
      <meta key="msapplication-TileColor" name="msapplication-TileColor" content="#6180B0" />,
    ])
  })
}
