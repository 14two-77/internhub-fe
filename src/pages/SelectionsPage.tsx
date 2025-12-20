import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  DollarSign,
  Users,
  CheckCircle2,
  ListFilter,
} from "lucide-react";
import { fetchJobs } from "../services/api";
import { useSelectionStore } from "../stores/selectionStore";
import { STATUS_CONFIG } from "../utils/constants";
import { getGoogleMapsLink } from "../utils/helpers";
import { CompanyLogo } from "../components/CompanyLogo";
import type { JobOpening, SelectionStatus } from "../types";
import { useDatasetStore } from "../stores/datasetStore";

export const SelectionsPage = () => {
  const dataset = useDatasetStore((s) => s.current);

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", dataset],
    queryFn: () => fetchJobs(),
  });

  const selections = useSelectionStore((state) => state.selections);
  const setStatus = useSelectionStore((state) => state.setStatus);
  const [verticalSort, setVerticalSort] = useState<
    "manual" | "compensation" | "quota" | "students"
  >("manual");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [jobOrder, setJobOrder] = useState<Record<string, number[]>>(() => {
    // Initialize from localStorage
    try {
      const stored = localStorage.getItem("job-card-order");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Persist jobOrder to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("job-card-order", JSON.stringify(jobOrder));
  }, [jobOrder]);

  const categorizedJobs = useMemo(() => {
    if (!jobs) return {};
    const groups: Record<string, JobOpening[]> = {
      interested: [],
      applied: [],
      interviewing: [],
      got_offer: [],
      not_interested: [],
    };

    jobs.forEach((job) => {
      const status = selections[job.openingId];
      if (status && groups[status]) {
        groups[status].push(job);
      }
    });

    // Apply vertical sorting to each group
    Object.keys(groups).forEach((key) => {
      if (verticalSort !== "manual") {
        groups[key] = [...groups[key]].sort((a, b) => {
          let compareValue = 0;

          if (verticalSort === "compensation") {
            const aComp = a.compensationAmount || 0;
            const bComp = b.compensationAmount || 0;
            compareValue = aComp - bComp;
          } else if (verticalSort === "quota") {
            compareValue = a.quota - b.quota;
          } else if (verticalSort === "students") {
            compareValue = a.inStudentDraftCount - b.inStudentDraftCount;
          }

          return sortOrder === "asc" ? compareValue : -compareValue;
        });
      } else if (jobOrder[key]) {
        // Apply custom order if no sort is active
        groups[key] = groups[key].sort((a, b) => {
          const aIdx = jobOrder[key].indexOf(a.openingId);
          const bIdx = jobOrder[key].indexOf(b.openingId);
          return (
            (aIdx === -1 ? Infinity : aIdx) - (bIdx === -1 ? Infinity : bIdx)
          );
        });
      }
    });

    return groups;
  }, [jobs, selections, verticalSort, sortOrder, jobOrder]);

  // --- Drag and Drop Handlers ---
  const handleDragStart = (
    e: React.DragEvent,
    openingId: number,
    status: string
  ) => {
    e.dataTransfer.setData("openingId", openingId.toString());
    e.dataTransfer.setData("fromStatus", status);
    e.dataTransfer.effectAllowed = "move";
    // Visual feedback
    (e.target as HTMLElement).style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = "1";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, toStatus: string) => {
    e.preventDefault();
    const openingId = parseInt(e.dataTransfer.getData("openingId"));
    const fromStatus = e.dataTransfer.getData("fromStatus");

    if (toStatus === fromStatus) {
      // Reordering within the same column
      const statusJobs = categorizedJobs[toStatus] || [];
      const fromIdx = statusJobs.findIndex((j) => j.openingId === openingId);

      if (fromIdx !== -1) {
        // Find the target job based on drop position
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const y = e.clientY - rect.top;

        let toIdx = 0;
        const children = (e.currentTarget as HTMLElement).querySelectorAll(
          "a[draggable], div[draggable]"
        );
        for (let i = 0; i < children.length; i++) {
          const childRect = children[i].getBoundingClientRect();
          const childY = childRect.top - rect.top + childRect.height / 2;
          if (y < childY) {
            toIdx = i;
            break;
          }
          toIdx = i + 1;
        }

        // Update the order
        const newOrder = statusJobs.map((j) => j.openingId);
        if (fromIdx !== toIdx) {
          newOrder.splice(fromIdx, 1);
          newOrder.splice(toIdx > fromIdx ? toIdx - 1 : toIdx, 0, openingId);
          setJobOrder((prev) => ({ ...prev, [toStatus]: newOrder }));
        }
      }
    } else {
      // Moving to a different column
      setStatus(openingId, toStatus as SelectionStatus);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );

  const pipelineStages = [
    { id: "not_interested", title: "Not Interested" },
    { id: "interested", title: "Interested" },
    { id: "applied", title: "Applied" },
    { id: "interviewing", title: "Interviewing" },
    { id: "got_offer", title: "Got Offer" },
  ];

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 shrink-0 gap-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Application Pipeline
        </h1>

        {/* Vertical Sorting Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Sort:
          </label>
          <select
            value={verticalSort}
            onChange={(e) => setVerticalSort(e.target.value as any)}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="manual">Manual</option>
            <option value="compensation">Compensation</option>
            <option value="quota">Quota</option>
            <option value="students">Students Selected</option>
          </select>

          {verticalSort !== "manual" && (
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 rounded-lg text-sm font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 h-full snap-x">
        {pipelineStages.map((stage) => {
          const stageJobs = categorizedJobs[stage.id] || [];
          const config = STATUS_CONFIG[stage.id];

          return (
            <div
              key={stage.id}
              className="shrink-0 w-80 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col h-full snap-start transition-colors duration-200"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div
                className={`p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 rounded-t-xl`}
              >
                <div className="flex items-center gap-2">
                  <config.icon
                    className={`w-5 h-5 ${config.color.split(" ")[1]}`}
                  />
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {stage.title}
                  </h3>
                </div>
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {stageJobs.length}
                </span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
                {stageJobs.map((job) => (
                  <Link
                    to={`/job/${job.openingId}`}
                    key={job.openingId}
                    draggable="true"
                    onDragStart={(e) =>
                      handleDragStart(e, job.openingId, stage.id)
                    }
                    onDragEnd={handleDragEnd}
                    className="block bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group cursor-grab active:cursor-grabbing hover:no-underline"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {job.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <CompanyLogo
                        url={job.company.logoUrl}
                        name={job.company.companyNameEn}
                        size={8}
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex-1">
                        {job.company.companyNameEn}
                      </p>
                    </div>
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>
                          Quota:{" "}
                          <span className="font-medium">{job.quota}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>
                          {job.compensationAmount
                            ? `${job.compensationAmount}`
                            : "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{job.inStudentDraftCount} selected</span>
                      </div>
                      <a
                        href={getGoogleMapsLink(job.officeAddressLine1)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{job.officeName}</span>
                      </a>
                    </div>
                  </Link>
                ))}
                {stageJobs.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400 dark:text-slate-600 text-xs italic border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg m-2 pointer-events-none">
                    <div className="mb-2 opacity-50">
                      <ListFilter className="w-6 h-6" />
                    </div>
                    Drag jobs here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
