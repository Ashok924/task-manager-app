"use client";

import TaskItem from "./TaskItem";
import type { Task } from "../types/task";

interface TaskListProps {
  tasks: Task[];
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskList = ({
  tasks,
  filter,
  onFilterChange,
  onToggle,
  onDelete,
}: TaskListProps) => {
  const filters: Array<{ value: "all" | "active" | "completed"; label: string }> = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <div className="w-full">
      <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
        {filters.map((filterOption) => (
          <button
            key={filterOption.value}
            onClick={() => onFilterChange(filterOption.value)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0 sm:flex-none sm:px-4 sm:text-sm dark:focus:ring-zinc-600 ${
              filter === filterOption.value
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
            {filter === "all"
              ? "No tasks yet. Add one above!"
              : filter === "active"
              ? "No active tasks."
              : "No completed tasks."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;

