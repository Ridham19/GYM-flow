import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

const ThemeToggle = () => {
    const { theme, setTheme } = useThemeStore();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle Theme"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <Sun className={`h-6 w-6 text-orange-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 ${theme === 'dark' ? 'hidden' : 'block'}`} />
            <Moon className={`h-6 w-6 text-blue-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ${theme === 'dark' ? 'block' : 'hidden'}`} />
            {/* Fallback to ensure icon visibility if animation fails or state is mid-transition */}
            {theme === "dark" && <Moon className="h-6 w-6 text-blue-400 absolute top-2 right-2 opacity-0 pointer-events-none" />}
        </button>
    );
};

export default ThemeToggle;
