"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (typeof window !== "undefined" && (localStorage.getItem("theme") as Theme | null)) || "dark";
    setTheme(stored);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", next);
  };

  const isLight = mounted && theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Activer le mode sombre" : "Activer le mode clair"}
      aria-pressed={isLight}
      className="relative inline-flex items-center w-12 h-6 border border-border-visible hover:border-text-primary transition-colors duration-[var(--duration-micro)] cursor-pointer"
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-text-display transition-[left] duration-[var(--duration-micro)]"
        style={{ left: isLight ? "26px" : "2px" }}
      />
      <span className="sr-only">{isLight ? "Light" : "Dark"}</span>
    </button>
  );
}
