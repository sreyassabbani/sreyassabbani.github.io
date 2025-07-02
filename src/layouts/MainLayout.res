module Link = Next.Link
module ThemeProvider = ThemeContext
module Footer = Footer

module Navigation = {
  @react.component
  let make = () =>
    <nav
      className="p-2 py-10 mt-5 h-12 flex border-b border-border justify-between items-center text-sm text-foreground">
      <Link href="/" className="flex items-center w-1/3">
        <span className="text-4xl ml-2 align-middle font-semibold">
          {React.string("sreyas")}
          <span className="text-primary"> {React.string(".is")} </span>
          <span className="text-xs text-muted-foreground mx-2 font-normal">
            {React.string("(should be, soon)")}
          </span>
        </span>
      </Link>
      <div className="flex w-2/3 justify-end space-x-6">
        <Link href="/blog" className="flex items-center justify-center relative group">
          {React.string("Blog")}
          <span
            className="
              absolute left-0 -bottom-1 w-full h-0.5 bg-primary
              scale-x-0 group-hover:scale-x-100
              transition-transform duration-200 origin-left
              -translate-y-2
            "
          />
        </Link>
        <Link href="/projects" className="flex items-center justify-center relative group">
          {React.string("Projects")}
          <span
            className="
              absolute left-0 -bottom-1 w-full h-0.5 bg-primary
              scale-x-0 group-hover:scale-x-100
              transition-transform duration-200 origin-left
              -translate-y-2
            "
          />
        </Link>
        <div className="flex ml-5 rounded gap-4 p-2 relative group">
          <a
            className="font-bold flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/sreyassabbani">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline h-5 w-5 align-middle fill-foreground hover:fill-primary"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path
                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
              />
            </svg>
          </a>
          <a
            className="font-bold flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/sreyas-sabbani-533668288/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline h-5 w-5 align-middle fill-foreground hover:fill-primary"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path
                d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
              />
            </svg>
          </a>
          <a
            className="font-bold flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com/in/sreyas-sabbani-533668288/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline h-7 w-7 align-middle fill-foreground hover:fill-primary"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <path
                d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m-.4 4.25-6.54 4.09c-.65.41-1.47.41-2.12 0L4.4 8.25c-.25-.16-.4-.43-.4-.72 0-.67.73-1.07 1.3-.72L12 11l6.7-4.19c.57-.35 1.3.05 1.3.72 0 .29-.15.56-.4.72"
              />
            </svg>
          </a>
          <span
            className="
            absolute -top-4 left-1/2 -translate-x-1/2
            text-primary font-semibold px-2 py-1 rounded text-xs
            opacity-0 translate-y-2
            transition-all duration-200 ease-out
            group-hover:opacity-100
            group-hover:translate-y-0
            flex justify-center items-center
            min-w-max
          ">
            {React.string("Links!")}
          </span>
        </div>
      </div>
    </nav>
}

@react.component
let make = (~children) => {
  <ThemeProvider>
    <div className="flex lg:justify-center min-h-[100vh]">
      <div className="max-w-5xl w-full lg:w-3/4 font-base flex flex-col min-h-[100vh]">
        <Navigation />
        <main className="mt-4 mx-4 flex-1"> children </main>
        <Footer />
      </div>
    </div>
  </ThemeProvider>
}
