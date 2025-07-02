open ThemeContext

// Icon components
module MoonIcon = {
  @react.component
  let make = (~className="h-4 w-4") =>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
      />
    </svg>
}

module SunIcon = {
  @react.component
  let make = (~className="h-4 w-4") =>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
      />
    </svg>
}

module CodeIcon = {
  @react.component
  let make = (~className="h-4 w-4") =>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
      />
    </svg>
}

// Theme toggle button component
module ThemeToggle = {
  @react.component
  let make = (~label, ~icon, ~onClick, ~description) =>
    <button
      onClick={_ => onClick()}
      className="
        flex items-center gap-2 px-3 py-2 rounded-lg
        bg-secondary hover:bg-accent transition-colors
        text-sm text-foreground
        border border-border
      "
      title=description>
      icon
      <span className="font-medium"> {React.string(label)} </span>
    </button>
}

@react.component
let make = () => {
  let {state, actions} = useTheme()

  <footer
    className="mt-16 border-t border-border pt-8 pb-4 bg-background">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        {React.string("© 2025 Sreyas Sabbani. Built with Next.js & ReScript.")}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground mr-2"> {React.string("Themes:")} </span>
        <ThemeToggle
          label={switch state.siteTheme {
          | Light => "Light"
          | Dark => "Dark"
          }}
          icon={switch state.siteTheme {
          | Light => <SunIcon />
          | Dark => <MoonIcon />
          }}
          onClick=actions.toggleSiteTheme
          description="Toggle site theme"
        />
        <ThemeToggle
          label={switch state.codeTheme {
          | GruvboxLight => "Code Light"
          | GruvboxDark => "Code Dark"
          }}
          icon={<CodeIcon />}
          onClick=actions.toggleCodeTheme
          description="Toggle code block theme"
        />
      </div>
    </div>
  </footer>
}
