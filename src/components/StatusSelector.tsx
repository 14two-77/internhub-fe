import { useSelectionStore } from "../stores/selectionStore";
import { STATUS_CONFIG } from "../utils/constants";
import type { SelectionStatus } from "../types";

export const StatusSelector = ({ openingId }: { openingId: number }) => {
  const { setStatus, getStatus } = useSelectionStore();
  const currentStatus = getStatus(openingId);

  return (
    <div
      className={`relative inline-block text-left sm:w-auto rounded-lg border-0 pr-2 ring-1 ring-inset focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-colors duration-200 font-medium ${
        currentStatus
          ? STATUS_CONFIG[currentStatus].color
          : "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 ring-slate-300 dark:ring-slate-600"
      }`}
    >
      <select
        value={currentStatus || ""}
        onChange={(e) =>
          setStatus(openingId, (e.target.value as SelectionStatus) || null)
        }
        className={`block w-full rounded-lg border-0 py-2 pl-3 pr-10 cursor-pointer outline-none`}
      >
        <option value="" className="text-slate-500 bg-white dark:bg-slate-800">
          Set Status...
        </option>
        <option value="interested" className="bg-white dark:bg-slate-800">
          Interested
        </option>
        <option value="applied" className="bg-white dark:bg-slate-800">
          Applied
        </option>
        <option value="interviewing" className="bg-white dark:bg-slate-800">
          Interviewing
        </option>
        <option value="got_offer" className="bg-white dark:bg-slate-800">
          Got Offer
        </option>
        <option value="not_interested" className="bg-white dark:bg-slate-800">
          Not Interested
        </option>
      </select>
    </div>
  );
};
