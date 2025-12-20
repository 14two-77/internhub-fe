import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { JobCard } from "../components/JobCard";
import { Pagination } from "../components/Pagination";
import { fetchJobs } from "../services/api";
import { useSelectionStore } from "../stores/selectionStore";
import type { Tag } from "../types";
import TagMultiSelect from "../components/MultiSelect";
import { useDatasetStore } from "../stores/datasetStore";

export const BrowsePage: React.FC = () => {
  const dataset = useDatasetStore((s) => s.current);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", dataset],
    queryFn: () => fetchJobs(),
  });

  const [search, setSearch] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "none" | "compensation" | "quota" | "students"
  >("none");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [excludeNotInterested, setExcludeNotInterested] = useState(false);
  const itemsPerPage = 9;
  const gridRef = React.useRef<HTMLDivElement>(null);
  const paginationRef = React.useRef<HTMLDivElement>(null);

  // Collect all unique tags from jobs
  const allTags = useMemo(() => {
    if (!jobs) return [] as Tag[];
    const map = new Map<number, Tag>();
    for (const j of jobs) {
      if (!j.tags) continue;
      for (const t of j.tags) {
        if (!map.has(t.tagId)) {
          map.set(t.tagId, { tagId: t.tagId, tagName: t.tagName });
        }
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.tagName.localeCompare(b.tagName)
    );
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    let result = jobs;

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (j) =>
          (j.title || "").toLowerCase().includes(lower) ||
          (j.company?.companyNameEn || "").toLowerCase().includes(lower) ||
          (j.tags || []).some((t: any) =>
            (t.tagName || "").toLowerCase().includes(lower)
          )
      );
    }

    if (selectedTagIds.length > 0) {
      // OR semantics: job that has at least one of the selected tags
      result = result.filter((j) =>
        (j.tags || []).some((t: any) => selectedTagIds.includes(t.tagId))
      );
    }

    if (excludeNotInterested) {
      result = result.filter((j) => {
        const status = useSelectionStore.getState().selections[j.openingId];
        return status !== "not_interested";
      });
    }

    if (sortBy !== "none") {
      result = [...result].sort((a, b) => {
        let compareValue = 0;

        if (sortBy === "compensation") {
          const aComp = a.compensationAmount || 0;
          const bComp = b.compensationAmount || 0;
          compareValue = aComp - bComp;
        } else if (sortBy === "quota") {
          compareValue = a.quota - b.quota;
        } else if (sortBy === "students") {
          compareValue = a.inStudentDraftCount - b.inStudentDraftCount;
        }

        return sortOrder === "asc" ? compareValue : -compareValue;
      });
    }

    return result;
  }, [jobs, search, selectedTagIds, sortBy, sortOrder, excludeNotInterested]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortBy, sortOrder, excludeNotInterested, selectedTagIds]);

  useEffect(() => {
    if (!gridRef.current) return;

    const navbarHeight = 64;
    const gridTop =
      gridRef.current.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: gridTop - navbarHeight,
      behavior: "smooth",
    });
  }, [currentPage]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        if (gridRef.current) {
          const navbarHeight = 64;
          const gridTop = gridRef.current.getBoundingClientRect().top;
          const isAtTop = Math.abs(gridTop - navbarHeight) < 2;

          if (!isAtTop) {
            const gridTopPos =
              gridRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
              top: gridTopPos - navbarHeight,
              behavior: "smooth",
            });
          } else {
            setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
          }
        }
      } else if (e.key === "ArrowRight") {
        if (paginationRef.current) {
          const paginationBottom =
            paginationRef.current.getBoundingClientRect().bottom;
          const isAtBottom =
            Math.abs(paginationBottom - window.innerHeight) < 2;

          if (!isAtBottom) {
            const paginationBottomPos =
              paginationRef.current.getBoundingClientRect().bottom +
              window.scrollY;
            window.scrollTo({
              top: paginationBottomPos - window.innerHeight,
              behavior: "smooth",
            });
          } else {
            setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalPages]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredJobs, currentPage]);

  if (isLoading)
    return (
      <div className="flex flex-col justify-center items-center p-20 min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-500 mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">
          Loading opportunities...
        </p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Explore Opportunities
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">
              Discover your next internship from top companies. Filter, select,
              and track your applications.
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 text-sm text-indigo-700 dark:text-indigo-300">
            <p className="font-medium">💡 Navigation tip:</p>
            <p>← Scroll to top | → Scroll to bottom</p>
            <p className="text-xs mt-1 opacity-75">
              Press when aligned to change page
            </p>
          </div>
        </div>

        {/* Search + Tag selector row */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xl min-w-1/3 h-fit">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm shadow-sm transition-all duration-200"
              placeholder="Search by job title, company, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tags multi-select */}
          <div className="relative flex items-stretch">
            <TagMultiSelect
              options={allTags}
              selected={selectedTagIds}
              onChange={setSelectedTagIds}
              placeholder="Filter by tags"
              clearable
            />
          </div>
        </div>

        <div className="mt-6 flex flex-row gap-8">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Sort by:
              </label>
              <div
                className="
    relative inline-block text-left sm:w-auto rounded-lg
    bg-white dark:bg-slate-800
    text-slate-900 dark:text-slate-100
    ring-1 ring-inset ring-slate-200 dark:ring-slate-700
    focus-within:ring-2 focus-within:ring-indigo-500
    transition-colors duration-200
    pr-2
  "
              >
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="
      block w-full rounded-lg border-0
      bg-transparent
      py-2 pl-3 pr-10
      text-sm cursor-pointer
      outline-none
      appearance-none
    "
                >
                  <option value="none" className="bg-white dark:bg-slate-800">
                    None
                  </option>
                  <option
                    value="compensation"
                    className="bg-white dark:bg-slate-800"
                  >
                    Compensation
                  </option>
                  <option value="quota" className="bg-white dark:bg-slate-800">
                    Quota
                  </option>
                  <option
                    value="students"
                    className="bg-white dark:bg-slate-800"
                  >
                    Students Selected
                  </option>
                </select>

                {/* Optional custom arrow (if you want full control) */}
                <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400 dark:text-slate-500">
                  ▼
                </span>
              </div>
            </div>

            {sortBy !== "none" && (
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortOrder === "asc"
                    ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                }`}
              >
                {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
              </button>
            )}
          </div>

          <label
            htmlFor="exclude-not-interested"
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <input
              type="checkbox"
              id="exclude-not-interested"
              checked={excludeNotInterested}
              onChange={(e) => setExcludeNotInterested(e.target.checked)}
              className="
      h-4 w-4
      rounded-md
      border-slate-300 dark:border-slate-600
      text-indigo-600
      focus:ring-2 focus:ring-indigo-500
      bg-white dark:bg-slate-800
      transition
    "
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Exclude <span className="font-medium">“Not Interested”</span>
            </span>
          </label>
        </div>
      </div>

      {paginatedJobs.length > 0 ? (
        <>
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginatedJobs.map((job) => (
              <JobCard key={job.openingId} job={job} />
            ))}
          </div>

          <div ref={paginationRef}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredJobs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-24 bg-white dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">
            No jobs found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search terms.
          </p>
        </div>
      )}
    </div>
  );
};
