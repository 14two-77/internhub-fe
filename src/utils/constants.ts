import {
  CheckCircle2,
  XCircle,
  Briefcase,
  Users,
  GraduationCap,
} from "lucide-react";

export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  interested: {
    label: "Interested",
    color:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800",
    icon: CheckCircle2,
  },
  not_interested: {
    label: "Not Interested",
    color:
      "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    icon: XCircle,
  },
  applied: {
    label: "Applied",
    color:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800",
    icon: Briefcase,
  },
  interviewing: {
    label: "Interviewing",
    color:
      "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-800",
    icon: Users,
  },
  got_offer: {
    label: "Got Offer",
    color:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800",
    icon: GraduationCap,
  },
};
