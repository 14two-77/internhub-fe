import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  DollarSign,
  MapPin,
  Users,
  ChevronLeft,
} from "lucide-react";
import { fetchJobDetail } from "../services/api";
import { CompanyLogo } from "../components/CompanyLogo";
import { StatusSelector } from "../components/StatusSelector";
import { getGoogleMapsLink } from "../utils/helpers";
import GoogleMap from "../components/GoogleMap";

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJobDetail(id!),
  });

  if (isLoading)
    return (
      <div className="flex justify-center p-12 bg-white dark:bg-slate-900 min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );

  if (!job)
    return (
      <div className="p-12 text-center text-red-500 font-medium bg-white dark:bg-slate-900 min-h-screen">
        Job not found
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <div className="bg-white dark:bg-slate-800 shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10 sm:rounded-2xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="shrink-0">
                <div className="w-24 h-24 bg-white dark:bg-slate-700 rounded-xl p-1 shadow-inner">
                  <CompanyLogo
                    url={job.company.logoUrl}
                    name={job.company.companyNameEn}
                    size={24}
                  />
                </div>
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                      {job.title}
                    </h1>
                    <a
                      href={job.company.website || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 dark:text-indigo-400 hover:underline mt-1.5 block font-medium text-lg"
                    >
                      {job.company.companyNameEn}
                    </a>
                  </div>
                  <div className="w-full md:w-auto">
                    <StatusSelector openingId={job.openingId} />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium">
                  {/* Stat Badge Template */}
                  {[
                    { icon: Users, label: "Quota", value: job.quota },
                    {
                      icon: DollarSign,
                      label: "Salary",
                      value: job.compensationAmount
                        ? `${job.compensationAmount} ${job.compensationType?.compensationType}`
                        : "Negotiable",
                    },
                    {
                      icon: Briefcase,
                      label: "Type",
                      value: job.workingCondition,
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-700"
                    >
                      <stat.icon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                      <span className="text-slate-500 dark:text-slate-400">
                        {stat.label}:{" "}
                        <span className="text-slate-900 dark:text-white font-semibold">
                          {stat.value}
                        </span>
                      </span>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-3.5 py-2 rounded-xl border border-slate-100 dark:border-slate-700">
                    <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <a
                      href={getGoogleMapsLink(job.officeAddressLine1)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 underline transition-colors"
                    >
                      View on Map
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="mt-10 border-t border-slate-100 dark:border-slate-700 pt-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
                Job Description
              </h2>
              <div
                className="prose prose-slate dark:prose-invert max-w-none leading-relaxed 
                           text-slate-600 dark:text-slate-300
                           dark:prose-headings:text-white dark:prose-p:text-slate-300 dark:prose-strong:text-white dark:prose-li:text-slate-300"
                dangerouslySetInnerHTML={{ __html: job.description || "" }}
              />
            </div>

            {job.requirements && (
              <div className="mt-10 border-t border-slate-100 dark:border-slate-700 pt-10">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
                  Requirements
                </h2>
                <div
                  className="prose prose-slate dark:prose-invert max-w-none leading-relaxed 
                             text-slate-600 dark:text-slate-300
                             dark:prose-headings:text-white dark:prose-p:text-slate-300 dark:prose-strong:text-white dark:prose-li:text-slate-300"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            )}

            <div className="mt-10 border-t border-slate-100 dark:border-slate-700 pt-10">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {job.tags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50"
                  >
                    #{tag.tagName}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-10 border-t border-slate-100 dark:border-slate-700 pt-10 flex flex-col sm:flex-row gap-6">
              <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/40">
                <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                  Application Contact
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-300 whitespace-pre-wrap font-medium">
                  {job.recruitmentContactChannel}
                </p>
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Office Location
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  {job.officeAddressLine1}
                </p>
                {job.officeAddressLine2 && (
                  <p className="text-sm text-slate-500 dark:text-slate-500 italic">
                    {job.officeAddressLine2}
                  </p>
                )}

                {job.officeAddressLine1 && (
                  <div className="mt-4">
                    <GoogleMap
                      address={`${job.officeAddressLine1} ${
                        job.officeAddressLine2 || ""
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
