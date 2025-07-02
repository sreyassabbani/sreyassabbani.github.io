// Theme types
type siteTheme = Light | Dark
type codeTheme = GruvboxLight | GruvboxDark

type themeState = {
  siteTheme: siteTheme,
  codeTheme: codeTheme,
}

type themeActions = {
  toggleSiteTheme: unit => unit,
  toggleCodeTheme: unit => unit,
  setSiteTheme: siteTheme => unit,
  setCodeTheme: codeTheme => unit,
}

type contextValue = {
  state: themeState,
  actions: themeActions,
}

// Utility functions
let siteThemeToString: siteTheme => string
let siteThemeFromString: string => siteTheme
let codeThemeToString: codeTheme => string
let codeThemeFromString: string => codeTheme

// Hook
let useTheme: unit => contextValue

// Component
@react.component
let make: (~children: React.element) => React.element
