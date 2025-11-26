import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Filter,
  ChevronDown,
  X,
  Building2,
  Globe,
  Monitor,
} from "lucide-react";
import { SiFacebook } from "@icons-pack/react-simple-icons";
import { useQuery } from "@tanstack/react-query";
import { getOpenings } from "../api/internship";
import type { JobItem } from "../types/internship";

const TagBadge = ({ name }: { name: string }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 mr-1.5 mb-1.5 border border-blue-100">
    {name}
  </span>
);

const JobCard = ({ job }: { job: JobItem }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200 flex flex-col md:flex-row gap-5 relative group">
      {/* Bookmark Icon (Mock) */}
      <div className="absolute top-4 right-4 text-gray-300 hover:text-blue-500 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${
            job.isBookmarked ? "text-blue-500 fill-current" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </div>

      {/* Logo */}
      <div className="flex-shrink-0">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg border border-gray-100 overflow-hidden bg-white flex items-center justify-center p-1">
          <img
            src={
              job.company.logoUrl || "https://placehold.co/100x100?text=Logo"
            }
            alt={job.company.companyNameEn}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/100x100?text=N/A";
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="pr-8">
          <h3
            className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1"
            title={job.title}
          >
            {job.title}
          </h3>
          <div className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5" />
            <span className="truncate">
              {job.company.companyNameEn} ({job.company.companyNameTh})
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap mb-3">
          {job.tags.length > 0 ? (
            job.tags.map((tag) => (
              <TagBadge key={tag.tagId} name={tag.tagName} />
            ))
          ) : (
            <span className="text-xs text-gray-400 italic">No tags</span>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm text-gray-500">
          {job.workingCondition && (
            <div className="flex items-center gap-1.5">
              <Monitor className="w-4 h-4 text-gray-400" />
              <span>{job.workingCondition}</span>
            </div>
          )}

          {job.compensationAmount !== null ? (
            <div className="flex items-center gap-1.5 text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-md w-fit">
              <DollarSign className="w-4 h-4" />
              <span>
                {job.compensationAmount}{" "}
                {job.compensationType?.compensationType}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-400">
              <DollarSign className="w-4 h-4" />
              <span>Negotiable</span>
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400" />
            <span>Quota: {job.quota}</span>
          </div>

          <div className="flex items-center gap-1.5 col-span-2 md:col-span-1">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate" title={job.officeName}>
              {job.officeName || "Office location"}
            </span>
          </div>
        </div>
      </div>

      {/* Actions (Desktop: Right, Mobile: Bottom) */}
      <div className="flex flex-col justify-end items-end gap-2 mt-2 md:mt-0">
        <div className="flex gap-2">
          {job.company.website && (
            <a
              href={job.company.website}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Globe className="w-5 h-5" />
            </a>
          )}
          {job.company.facebook && (
            <a
              href={job.company.facebook}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <SiFacebook className="w-5 h-5" />
            </a>
          )}
        </div>
        <button className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

// --- Main App ---

export default function Browse() {
  const { data } = useQuery({
    queryKey: ["openings"],
    queryFn: getOpenings,
  });

  // -- Filter States --
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minCompensation, setMinCompensation] = useState<number>(0);
  const [selectedWorkConditions, setSelectedWorkConditions] = useState<
    string[]
  >([]);
  const [showFilters, setShowFilters] = useState(false); // Mobile drawer

  // -- Sort States --
  const [sortBy, setSortBy] = useState<string>("newest"); // newest, quota_desc, salary_desc

  // -- Derived Data for Filters --
  const allTags = useMemo(() => {
    if (!data) return [];

    const tags = new Set<string>();
    data.items.forEach((item) => item.tags.forEach((t) => tags.add(t.tagName)));
    return Array.from(tags).sort();
  }, [data]);

  const allWorkConditions = useMemo(() => {
    if (!data) return [];

    const conditions = new Set<string>();
    data.items.forEach((item) => {
      if (item.workingCondition) conditions.add(item.workingCondition);
    });
    return Array.from(conditions);
  }, [data]);

  // -- Filter & Sort Logic --
  const filteredAndSortedItems = useMemo(() => {
    if (!data) return [];

    let result = data.items.filter((item) => {
      // Search
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(searchLower) ||
        item.company.companyNameEn.toLowerCase().includes(searchLower) ||
        item.company.companyNameTh.toLowerCase().includes(searchLower);

      // Tags (OR logic: if any selected tag matches)
      const matchesTags =
        selectedTags.length === 0 ||
        item.tags.some((t) => selectedTags.includes(t.tagName));

      // Compensation
      const itemComp = item.compensationAmount || 0;
      const matchesCompensation = itemComp >= minCompensation;

      // Work Condition
      const matchesCondition =
        selectedWorkConditions.length === 0 ||
        (item.workingCondition &&
          selectedWorkConditions.includes(item.workingCondition));

      return (
        matchesSearch && matchesTags && matchesCompensation && matchesCondition
      );
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === "salary_desc") {
        return (b.compensationAmount || 0) - (a.compensationAmount || 0);
      } else if (sortBy === "quota_desc") {
        return b.quota - a.quota;
      } else {
        // Newest (Default by ID for now since startDate is mostly null)
        return b.openingId - a.openingId;
      }
    });

    return result;
  }, [
    data,
    searchTerm,
    selectedTags,
    minCompensation,
    selectedWorkConditions,
    sortBy,
  ]);

  // -- Handlers --
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleCondition = (condition: string) => {
    setSelectedWorkConditions((prev) =>
      prev.includes(condition)
        ? prev.filter((c) => c !== condition)
        : [...prev, condition]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTags([]);
    setMinCompensation(0);
    setSelectedWorkConditions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* --- Navbar --- */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                CEDT Intern
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-blue-600">
                Jobs
              </a>
              <a href="#" className="hover:text-blue-600">
                Companies
              </a>
              <a href="#" className="hover:text-blue-600">
                My Applications
              </a>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                S
              </div>
            </div>
            <button
              className="md:hidden p-2 text-gray-500"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Sidebar Filters (Desktop) --- */}
          <aside
            className={`
            fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:bg-transparent lg:w-72 lg:block
            ${showFilters ? "translate-x-0" : "-translate-x-full"}
            overflow-y-auto lg:overflow-visible
          `}
          >
            <div className="p-6 lg:p-0 h-full lg:h-auto bg-white lg:bg-transparent shadow-xl lg:shadow-none">
              <div className="flex justify-between items-center lg:hidden mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-white lg:rounded-xl lg:border lg:border-gray-200 lg:p-6 space-y-8">
                {/* Search Input */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Job title or company..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                {/* Working Condition */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Working Condition
                  </label>
                  <div className="space-y-2">
                    {allWorkConditions.map((cond) => (
                      <label
                        key={cond}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedWorkConditions.includes(cond)}
                          onChange={() => toggleCondition(cond)}
                        />
                        <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                          {cond}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Compensation Slider */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="block text-sm font-bold text-gray-900">
                      Min. Compensation
                    </label>
                    <span className="text-sm text-blue-600 font-medium">
                      {minCompensation > 0 ? `${minCompensation}+ THB` : "Any"}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    value={minCompensation}
                    onChange={(e) =>
                      setMinCompensation(parseInt(e.target.value))
                    }
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0</span>
                    <span>1000+</span>
                  </div>
                </div>

                {/* Tag Cloud */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-gray-900">
                      Popular Tags
                    </label>
                    {selectedTags.length > 0 && (
                      <button
                        onClick={() => setSelectedTags([])}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Simple Tag Search inside Filter */}
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Find a tag..."
                      className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-md bg-gray-50 focus:bg-white transition-colors outline-none focus:border-blue-400"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`
                                        text-xs px-2.5 py-1.5 rounded-full border transition-all duration-200
                                        ${
                                          selectedTags.includes(tag)
                                            ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                                        }
                                    `}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearFilters}
                  className="w-full py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* --- Main Content --- */}
          <div className="flex-1">
            {/* Header Area */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Internship Openings
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Showing{" "}
                  <span className="font-semibold text-gray-900">
                    {filteredAndSortedItems.length}
                  </span>{" "}
                  jobs based on your preferences
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="relative group">
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer hover:border-blue-400 transition-colors">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <select
                    className="text-sm font-semibold text-gray-900 bg-transparent outline-none cursor-pointer appearance-none pr-4"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="salary_desc">Highest Paid</option>
                    <option value="quota_desc">Most Openings</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters Display (Mobile/Desktop) */}
            {(selectedTags.length > 0 ||
              minCompensation > 0 ||
              selectedWorkConditions.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedWorkConditions.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100"
                  >
                    Work: {c}{" "}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleCondition(c)}
                    />
                  </span>
                ))}
                {minCompensation > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                    Min: {minCompensation} THB{" "}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => setMinCompensation(0)}
                    />
                  </span>
                )}
                {selectedTags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                  >
                    {t}{" "}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleTag(t)}
                    />
                  </span>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-blue-600 underline px-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Job List */}
            <div className="space-y-4">
              {filteredAndSortedItems.length > 0 ? (
                filteredAndSortedItems.map((job) => (
                  <JobCard key={job.openingId} job={job} />
                ))
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No jobs found
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Try adjusting your search or filters to find what you're
                    looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-blue-600 font-medium hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Mock */}
            {filteredAndSortedItems.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-1">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white font-medium">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    3
                  </button>
                  <span className="w-8 text-center text-gray-400">...</span>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    5
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50">
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
