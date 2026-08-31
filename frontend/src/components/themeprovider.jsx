import { useEffect } from "react";

function ThemeProvider({ children }) {
  useEffect(() => {
    const savedTheme =
      localStorage.getItem("femoraTheme") || "light";

    const applyTheme = (theme) => {
      const root = document.documentElement;

      if (theme === "dark") {
        root.classList.add("dark");
      } else if (theme === "light") {
        root.classList.remove("dark");
      } else {
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;

        root.classList.toggle("dark", prefersDark);
      }
    };

    applyTheme(savedTheme);

    // Listen for system theme changes
    if (savedTheme === "system") {
      const mediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      const handleChange = () => {
        applyTheme("system");
      };

      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener(
          "change",
          handleChange
        );
      };
    }
  }, []);

  return children;
}

export default ThemeProvider;