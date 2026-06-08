"use client";

import { useSyncExternalStore } from "react";

type Theme = "dark" | "light";
const THEME_EVENT = "clubs-actionnaires-theme-change";

function subscribe(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  return () => window.removeEventListener(THEME_EVENT, callback);
}

function getSnapshot(): Theme {
  return localStorage.getItem("theme") === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    if (next === "dark") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("theme", next);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Activer le mode sombre" : "Activer le mode clair"}
      aria-pressed={isLight}
      className="relative inline-flex items-center justify-center w-11 h-11 sm:w-12 sm:h-6 border border-border-visible hover:border-text-primary transition-colors duration-[var(--duration-micro)] cursor-pointer"
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-text-display transition-[left] duration-[var(--duration-micro)]"
        style={{ left: isLight ? "calc(100% - 19px)" : "3px" }}
      />
      <span className="sr-only">{isLight ? "Light" : "Dark"}</span>
    </button>
  );
}
