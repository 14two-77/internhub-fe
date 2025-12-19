import { Link, useLocation } from "react-router-dom";

export const NavLink = ({
  to,
  children,
  icon,
}: {
  to: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-semibold transition-all duration-200 ${
        isActive
          ? "border-indigo-500 text-slate-900 dark:text-white"
          : "border-transparent text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200"
      }`}
    >
      {icon && <span className="mr-2 opacity-70">{icon}</span>}
      {children}
    </Link>
  );
};
