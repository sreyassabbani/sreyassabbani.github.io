import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "theme";
const LIGHT_THEME_COLOR = "#eff1f5";
const DARK_THEME_COLOR = "#232634";

function applyTheme(isDark: boolean) {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    root.style.colorScheme = isDark ? "dark" : "light";

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta instanceof HTMLMetaElement) {
        themeColorMeta.content = isDark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR;
    }
}

export default function ThemeToggle({ className = "" }) {
    const [isDark, setIsDark] = useState<boolean | null>(null);

    useEffect(() => {
        const prefersDark = window.matchMedia?.(
            "(prefers-color-scheme: dark)",
        ).matches;
        const saved = localStorage.getItem(STORAGE_KEY);
        const next = saved === "dark" || (saved === null && prefersDark);
        applyTheme(next);
        setIsDark(next);
    }, []);

    useEffect(() => {
        if (isDark === null) return;

        applyTheme(isDark);
        localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    }, [isDark]);

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            aria-pressed={Boolean(isDark)}
            onClick={() => setIsDark((prev) => !prev)}
            className={cn(
                buttonVariants({ variant: "outline", size: "icon-sm" }),
                "rounded-full bg-card text-foreground shadow-none transition-[transform,colors] duration-300 ease-out hover:scale-110 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                className,
            )}
        >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
    );
}
