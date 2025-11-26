"use client";

import { useState, FormEvent } from "react";

interface TaskFormProps {
  onAddTask: (title: string) => void;
}

const TaskForm = ({ onAddTask }: TaskFormProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      onAddTask(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0 sm:px-4 sm:py-3 sm:text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95 sm:px-6 sm:py-3 sm:text-base dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-600"
          disabled={!input.trim()}
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default TaskForm;

