// Next.js bindings

// Link component
module Link = {
  @module("next/link") @react.component
  external make: (
    ~href: string,
    ~as_: string=?,
    ~prefetch: bool=?,
    ~replace: bool=?,
    ~scroll: bool=?,
    ~shallow: bool=?,
    ~passHref: bool=?,
    ~className: string=?,
    ~children: React.element,
  ) => React.element = "default"
}

// Router hook
module Router = {
  type router = {
    "pathname": string,
    "query": Js.Dict.t<string>,
    "asPath": string,
    "route": string,
    "push": (. string) => unit,
    "replace": (. string) => unit,
    "back": (. unit) => unit,
  }
  
  @module("next/router")
  external useRouter: unit => router = "useRouter"
}

// GetServerSideProps
module GetServerSideProps = {
  type context<'params, 'query> = {}
  type t<'props, 'params, 'query> = 'query => Promise.t<{"props": 'props}>
}

// GetStaticProps
module GetStaticProps = {
  type context<'params> = {
    "params": 'params,
  }
  
  type result<'props> = 
    | Props({"props": 'props})
    | NotFound({"notFound": bool})
    | Redirect({"redirect": {"destination": string, "permanent": bool}})
  
  type t<'props, 'params> = context<'params> => Promise.t<result<'props>>
}

// GetStaticPaths
module GetStaticPaths = {
  type path<'params> = {"params": 'params}
  
  type result<'params> = {
    "paths": array<path<'params>>,
    "fallback": bool,
  }
  
  type t<'params> = unit => Promise.t<result<'params>>
}
