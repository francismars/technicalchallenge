"use client";
import { useEffect, useState } from "react";

const themes = [
  { key: "light", label: "Light" },
  { key: "dark", label: "Dark" },
  { key: "system", label: "System" },
];

export default function ThemeToggle() {
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    // On mount, sync with localStorage
    const saved = localStorage.getItem("theme") || "system";
    setTheme(saved);
    applyTheme(saved);
    // Listen for system theme changes if system is selected
    if (saved === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("system");
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    }
  }, []);

  function applyTheme(theme: string) {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else if (theme === "light") {
      html.classList.remove("dark");
    } else {
      // System: match OS
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  }

  function handleChange(newTheme: string) {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
    applyTheme(newTheme);
  }

  return (
    <div className="flex gap-2 items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1 shadow border border-gray-200 dark:border-gray-700">
      {themes.map((t) => (
        <button
          key={t.key}
          onClick={() => handleChange(t.key)}
          className={`px-2 py-1 rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400
            ${theme === t.key ? "bg-blue-500 text-white dark:bg-blue-400 dark:text-gray-900" : "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900"}
          `}
          aria-pressed={theme === t.key}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
} 