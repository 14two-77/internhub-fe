import { useState, useEffect } from "react";

export const CompanyLogo = ({
  url,
  name,
  size = 14,
}: {
  url: string | null;
  name: string;
  size?: number;
}) => {
  // const [error, setError] = useState(false);

  // useEffect(() => {
  //   setError(false);
  // }, [url]);

  // if (error || !url) {
  return (
    <div
      className={`w-${size} h-${size} rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shrink-0`}
    >
      <span className="text-indigo-700 dark:text-indigo-300 font-bold text-xl select-none">
        {name.charAt(0).toUpperCase()}
      </span>
    </div>
  );
  // }

  // return (
  //   <div
  //     className={`w-${size} h-${size} rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden p-1 shrink-0`}
  //   >
  //     <img
  //       src={url}
  //       alt={name}
  //       onError={() => setError(true)}
  //       className="max-w-full max-h-full object-contain"
  //     />
  //   </div>
  // );
};
