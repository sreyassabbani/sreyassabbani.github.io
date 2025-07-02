// Theme context for managing site theme and code block theme
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

let context = React.createContext(None)

module Provider = {
  let makeProps = (~value, ~children, ()) =>
    {
      "value": Some(value),
      "children": children,
    }

  let make = React.Context.provider(context)
}

// Utility functions
let siteThemeToString = theme =>
  switch theme {
  | Light => "light"
  | Dark => "dark"
  }

let siteThemeFromString = str =>
  switch str {
  | "dark" => Dark
  | _ => Light
  }

let codeThemeToString = theme =>
  switch theme {
  | GruvboxLight => "gruvboxLight"
  | GruvboxDark => "gruvboxDark"
  }

let codeThemeFromString = str =>
  switch str {
  | "gruvboxDark" => GruvboxDark
  | _ => GruvboxLight
  }

// Local storage operations
module Storage = {
  @val external localStorage: 'a = "localStorage"

  let getItem: string => option<string> = %raw(`
    function(key) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    }
  `)

  let setItem: (string, string) => unit = %raw(`
    function(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        // ignore
      }
    }
  `)
}

// DOM operations
module Dom = {
  let addDarkClass: unit => unit = %raw(`
    function() {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.add('dark');
      }
    }
  `)
  
  let removeDarkClass: unit => unit = %raw(`
    function() {
      if (typeof document !== 'undefined') {
        document.documentElement.classList.remove('dark');
      }
    }
  `)
  
  let getSystemTheme: unit => string = %raw(`
    function() {
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "dark";
      }
      return "light";
    }
  `)
  
  let dispatchStorageEvent: (string, string) => unit = %raw(`
    function(key, value) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: key,
          newValue: value,
          storageArea: localStorage
        }));
      }
    }
  `)
}

// Hook to use theme context
let useTheme = () => {
  let contextValue = React.useContext(context)
  switch contextValue {
  | Some(value) => value
  | None => failwith("useTheme must be used within a ThemeProvider")
  }
}

// Theme provider component
@react.component
let make = (~children) => {
  let (siteTheme, setSiteThemeState) = React.useState(() => Light)
  let (codeTheme, setCodeThemeState) = React.useState(() => GruvboxLight)

  // Initialize themes from localStorage and system preference
  React.useEffect0(() => {
    // Get saved themes from localStorage
    let savedSiteTheme = Storage.getItem("theme")
    let savedCodeTheme = Storage.getItem("codeTheme")

    // Set site theme
    switch savedSiteTheme {
    | Some(themeStr) => {
        let theme = siteThemeFromString(themeStr)
        setSiteThemeState(_ => theme)
        switch theme {
        | Dark => Dom.addDarkClass()
        | Light => Dom.removeDarkClass()
        }
      }
    | None => {
        let systemThemeStr = Dom.getSystemTheme()
        let systemTheme = siteThemeFromString(systemThemeStr)
        setSiteThemeState(_ => systemTheme)
        Storage.setItem("theme", siteThemeToString(systemTheme))
        switch systemTheme {
        | Dark => Dom.addDarkClass()
        | Light => Dom.removeDarkClass()
        }
      }
    }

    // Set code theme
    switch savedCodeTheme {
    | Some(codeThemeStr) => {
        let theme = codeThemeFromString(codeThemeStr)
        setCodeThemeState(_ => theme)
      }
    | None => {
        let defaultCodeTheme = switch siteTheme {
        | Dark => GruvboxDark
        | Light => GruvboxLight
        }
        setCodeThemeState(_ => defaultCodeTheme)
        Storage.setItem("codeTheme", codeThemeToString(defaultCodeTheme))
      }
    }

    None
  })

  let toggleSiteTheme = () => {
    let newTheme = switch siteTheme {
    | Light => Dark
    | Dark => Light
    }
    setSiteThemeState(_ => newTheme)
    switch newTheme {
    | Dark => Dom.addDarkClass()
    | Light => Dom.removeDarkClass()
    }
    Storage.setItem("theme", siteThemeToString(newTheme))
    Dom.dispatchStorageEvent("theme", siteThemeToString(newTheme))
  }

  let toggleCodeTheme = () => {
    let newTheme = switch codeTheme {
    | GruvboxLight => GruvboxDark
    | GruvboxDark => GruvboxLight
    }
    setCodeThemeState(_ => newTheme)
    Storage.setItem("codeTheme", codeThemeToString(newTheme))
    Dom.dispatchStorageEvent("codeTheme", codeThemeToString(newTheme))
  }

  let setSiteTheme = theme => {
    setSiteThemeState(_ => theme)
    Storage.setItem("theme", siteThemeToString(theme))
    switch theme {
    | Dark => Dom.addDarkClass()
    | Light => Dom.removeDarkClass()
    }
  }

  let setCodeTheme = theme => {
    setCodeThemeState(_ => theme)
    Storage.setItem("codeTheme", codeThemeToString(theme))
  }

  let contextValue = {
    state: {
      siteTheme,
      codeTheme,
    },
    actions: {
      toggleSiteTheme,
      toggleCodeTheme,
      setSiteTheme,
      setCodeTheme,
    },
  }

  <Provider value={Some(contextValue)}> children </Provider>
}
