import { Link } from "react-router-dom";
import { Users, DollarSign, MapPin, CheckCircle2 } from "lucide-react";
import { CompanyLogo } from "./CompanyLogo";
import { StatusSelector } from "./StatusSelector";
import { useSelectionStore } from "../stores/selectionStore";
import { STATUS_CONFIG } from "../utils/constants";
import type { JobOpening } from "../types";

export const JobCard = ({ job }: { job: JobOpening }) => {
  const currentStatus = useSelectionStore(
    (state) => state.selections[job.openingId]
  );

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 flex flex-col h-full group">
      <div className="p-5 flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start mb-4 gap-3 relative">
          {" "}
          <Link to={`/job/${job.openingId}`}>
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <CompanyLogo
                url={job.company.logoUrl}
                name={job.company.companyNameEn}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 wrap-break-word">
                  {job.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium truncate block w-full">
                  {job.company.companyNameEn}
                </p>
              </div>
            </div>
          </Link>
          {currentStatus && (
            <div
              className={`absolute top-0 right-0 px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 whitespace-nowrap ${STATUS_CONFIG[currentStatus].color}`}
            >
              {STATUS_CONFIG[currentStatus].label}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {job.tags.map((tag) => (
            <span
              key={tag.tagId}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 truncate max-w-30"
            >
              {tag.tagName}
            </span>
          ))}
        </div>
        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mt-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <Users className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate">
              Quota:{" "}
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {job.quota}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <DollarSign className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {job.compensationAmount
                ? `${job.compensationAmount} ${job.compensationType?.compensationType}`
                : "-"}
            </span>
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="truncate" title={job.officeName}>
              {job.officeName}
            </span>
          </div>
          <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {job.inStudentDraftCount} students selected this
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 rounded-b-2xl flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <StatusSelector openingId={job.openingId} />
        </div>
        <Link
          to={`/job/${job.openingId}`}
          className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-all whitespace-nowrap"
        >
          Details
        </Link>
      </div>
    </div>
  );
};
