"use client";

import { useState } from "react";
import type { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    // Wait for animation to complete before actually deleting
    setTimeout(() => {
      onDelete(task.id);
    }, 300);
  };

  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-zinc-200 bg-white p-3 transition-all duration-300 dark:border-zinc-800 dark:bg-zinc-900 sm:items-center sm:gap-3 sm:p-4 ${
        isDeleting ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mt-1 h-5 w-5 min-w-[1.25rem] cursor-pointer rounded border-zinc-300 text-zinc-600 focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0 sm:mt-0 dark:border-zinc-700 dark:bg-zinc-800 dark:focus:ring-zinc-600"
      />
      <span
        className={`flex-1 break-words text-sm sm:text-base ${
          task.completed
            ? "text-zinc-500 line-through dark:text-zinc-500"
            : "text-zinc-900 dark:text-zinc-100"
        }`}
      >
        {task.title}
      </span>
      <button
        onClick={handleDelete}
        className="flex items-center justify-center rounded p-1.5 text-zinc-600 transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0 hover:bg-zinc-100 hover:text-red-600 sm:p-2 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-red-400 dark:focus:ring-zinc-600"
        aria-label="Delete task"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-4 w-4 sm:h-5 sm:w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .5c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
          />
        </svg>
      </button>
    </div>
  );
};

export default TaskItem;

