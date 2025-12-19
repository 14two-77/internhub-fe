import { Link } from "react-router-dom";
import { Briefcase, Search, ListFilter, Moon, Sun } from "lucide-react";
import { useThemeStore } from "../stores/themeStore";
import { NavLink } from "./NavLink";

export const Navbar = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="shrink-0 flex items-center gap-2 group">
              <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-200">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
                Intern
                <span className="text-indigo-600 dark:text-indigo-400">
                  Hub
                </span>
              </span>
            </Link>
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <NavLink to="/" icon={<Search className="w-4 h-4" />}>
                Browse
              </NavLink>
              <NavLink
                to="/selections"
                icon={<ListFilter className="w-4 h-4" />}
              >
                My Selections
              </NavLink>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-slate-700"
              aria-label="Toggle Dark Mode"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 flex justify-around p-2 bg-slate-50 dark:bg-slate-900">
        <Link
          to="/"
          className="flex flex-col items-center text-xs text-slate-600 dark:text-slate-400 p-2"
        >
          <Search className="w-5 h-5 mb-1" /> Browse
        </Link>
        <Link
          to="/selections"
          className="flex flex-col items-center text-xs text-slate-600 dark:text-slate-400 p-2"
        >
          <ListFilter className="w-5 h-5 mb-1" /> My Selections
        </Link>
      </div>
    </nav>
  );
};
