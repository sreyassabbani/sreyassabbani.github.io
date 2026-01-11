import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "theme";

export default function ThemeToggle({ className = "" }) {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const prefersDark = window.matchMedia?.(
            "(prefers-color-scheme: dark)",
        ).matches;
        const saved = localStorage.getItem(STORAGE_KEY);
        const next = saved === "dark" || (saved === null && prefersDark);
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
    }, []);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
        localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            aria-pressed={isDark}
            onClick={() => setIsDark((prev) => !prev)}
            className={`flex items-center justify-center rounded-full bg-[color:var(--primary)] text-[color:var(--primary-foreground)] border border-[color:var(--border)] shadow-sm hover:scale-125 focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)] focus:ring-offset-2 focus:ring-offset-[color:var(--background)] ${className}`}
        >
            {isDark ? (
                <Sun className="w-4 h-4" />
            ) : (
                <Moon className="w-4 h-4" />
            )}
        </button>
    );
}
