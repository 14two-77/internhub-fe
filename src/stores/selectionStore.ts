import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SelectionState } from "../types";

export const useSelectionStore = create<SelectionState>()(
  persist(
    (set, get) => ({
      selections: {},
      setStatus: (openingId, status) =>
        set((state) => ({
          selections: { ...state.selections, [openingId]: status },
        })),
      getStatus: (openingId) => get().selections[openingId] || null,
    }),
    {
      name: "intern-selection-storage",
    }
  )
);
