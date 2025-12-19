import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeState } from "../types";

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "intern-theme-storage",
    },
  ),
);
