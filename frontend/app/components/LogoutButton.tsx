"use client";

import { useAuth } from "../contexts/AuthContext";

const LogoutButton = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-zinc-600 dark:text-zinc-400 sm:inline">
        {user?.name || user?.email}
      </span>
      <button
        onClick={handleLogout}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-600"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;

