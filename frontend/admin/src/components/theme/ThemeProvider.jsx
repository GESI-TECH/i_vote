import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";

const THEME_STORAGE_KEY = "i-vote-admin-theme";
const themes = ["light", "dark", "system"];

function getStoredTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return themes.includes(storedTheme) ? storedTheme : "system";
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme);
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function updateTheme() {
      const nextResolvedTheme = theme === "system" ? getSystemTheme() : theme;
      setResolvedTheme(nextResolvedTheme);
      document.documentElement.classList.toggle(
        "dark",
        nextResolvedTheme === "dark",
      );
    }

    updateTheme();
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
