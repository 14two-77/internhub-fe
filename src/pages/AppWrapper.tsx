import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { BrowsePage } from "./BrowsePage";
import { SelectionsPage } from "./SelectionsPage";
import { JobDetailPage } from "./JobDetailPage";
import { useThemeStore } from "../stores/themeStore";

export const AppWrapper = () => {
  const { theme } = useThemeStore();

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200">
      <Navbar />
      <Routes>
        <Route path="/" element={<BrowsePage />} />
        <Route path="/selections" element={<SelectionsPage />} />
        <Route path="/job/:id" element={<JobDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
