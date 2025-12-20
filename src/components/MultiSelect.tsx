import { Check, X } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import type { Tag } from "../types";

type TagMultiSelectProps = {
  options: Tag[];
  selected: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
  clearable?: boolean;
};

const TagMultiSelect: React.FC<TagMultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder = "Tags",
  clearable = true,
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!filter) return options;
    const lower = filter.toLowerCase();
    return options.filter((o) => o.tagName.toLowerCase().includes(lower));
  }, [options, filter]);

  const toggle = (id: number) => {
    if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
    else onChange([...selected, id]);
  };

  return (
    <div ref={wrapperRef} className="relative text-sm">
      {/* Selected chips & control */}
      <div
        className="cursor-pointer flex items-center flex-wrap gap-2 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 cursor-default h-full"
        onClick={() => setOpen((s) => !s)}
      >
        {/* Chips */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {selected.length === 0 ? (
            <div className="text-slate-400 dark:text-slate-500 truncate">
              {placeholder}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selected
                .map((id) => options.find((o) => o.tagId === id))
                .filter(Boolean)
                .map((o) => (
                  <span
                    key={o!.tagId}
                    className="cursor-default flex items-center gap-1 px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 border border-indigo-100 dark:border-indigo-800"
                  >
                    <span className="text-xs font-medium truncate max-w-36">
                      #{o!.tagName}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(o!.tagId);
                      }}
                      className="cursor-pointer p-0.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800"
                      aria-label={`Remove ${o!.tagName}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {clearable && selected.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              className="cursor-pointer text-xs text-slate-500 dark:text-slate-400 px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Clear selected tags"
            >
              Clear
            </button>
          )}
          <svg
            className={`w-4 h-4 text-slate-400 transform transition-transform ${
              open ? "rotate-180" : "rotate-0"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 mt-2 right-0 left-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
          <div className="px-3 py-2">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              autoFocus
              placeholder="Search tags..."
              className="w-full px-3 py-2 border border-slate-100 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="max-h-48 overflow-auto py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                No tags found
              </div>
            ) : (
              filteredOptions.map((o) => {
                const picked = selected.includes(o.tagId);
                return (
                  <button
                    key={o.tagId}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(o.tagId);
                    }}
                    className={`cursor-pointer w-full text-left px-3 py-2 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                      picked ? "bg-slate-50 dark:bg-slate-700" : ""
                    }`}
                  >
                    <div className="truncate">
                      <div className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        #{o.tagName}
                      </div>
                    </div>
                    <div>
                      {picked ? (
                        <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TagMultiSelect;
