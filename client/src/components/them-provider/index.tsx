import { createContext, FC, ReactNode, useState } from "react"
import { Provider } from "react-redux"

type Theme = "dark" | "light"

interface ThemContextType {
  theme: Theme
  toggleTheme: () => void
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeContext = createContext<ThemContextType>({
  theme: "dark",
  toggleTheme: () => null,
})

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const storedTheme: Theme = (localStorage.getItem("theme") as Theme) ?? "dark"
  const [theme, setTheme] = useState(storedTheme)

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === "dark" ? "light" : "dark"

      localStorage.setItem("theme", newTheme)

      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <main className={`${theme} text-foreground bg-background`}>
        {children}
      </main>
    </ThemeContext.Provider>
  )
}
