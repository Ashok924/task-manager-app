"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../contexts/SidebarContext";

const Sidebar = () => {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

  const navItems = [
    { id: "tasks", href: "/task-manager", label: "Tasks", icon: "📋" },
    { id: "dashboard", href: "/task-manager", label: "Dashboard", icon: "📊" },
    { id: "settings", href: "/task-manager", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      {/* Overlay - All Screen Sizes */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[57px] z-40 h-[calc(100vh-57px)] w-64 transform border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-900 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Menu
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label="Close sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              © 2024 task-manager-app
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

