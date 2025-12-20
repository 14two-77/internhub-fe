import { create } from "zustand";

export type DatasetOption = {
  id: string;
  label: string;
};

type DatasetState = {
  current: string; // id of selected dataset
  options: DatasetOption[];
  setCurrent: (id: string) => void;
  addDataset: (opt: DatasetOption) => void;
};

export const useDatasetStore = create<DatasetState>((set, get) => ({
  // initial available datasets
  options: [
    { id: "junior", label: "Junior (2025)" },
    { id: "senior", label: "Senior (2025)" },
  ],
  // default to senior (previous behaviour)
  current: "senior",
  setCurrent: (id) => {
    const { options } = get();
    // fall back to first option if id not found
    const exists = options.some((o) => o.id === id);
    set({ current: exists ? id : options[0].id });
  },
  addDataset: (opt) =>
    set((s) => ({
      options: s.options.concat(opt),
    })),
}));
