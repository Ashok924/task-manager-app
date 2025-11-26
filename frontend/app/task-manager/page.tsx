"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import useTasks from "../hooks/useTasks";
import { useAuth } from "../contexts/AuthContext";

const TaskManagerPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    tasks,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    isLoading,
  } = useTasks();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-600 dark:text-zinc-400">Checking authentication...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-600 dark:text-zinc-400">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 py-4 dark:bg-zinc-950 sm:py-8 md:py-12">
      <div className="mx-auto w-full max-w-2xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl md:text-4xl lg:text-5xl">
            Task Manager
          </h1>
          <p className="mt-1.5 text-sm text-zinc-600 dark:text-zinc-400 sm:mt-2 sm:text-base md:text-lg">
            Organize your tasks efficiently
          </p>
        </div>

        <div className="mb-4 sm:mb-6">
          <TaskForm onAddTask={addTask} />
        </div>

        <TaskList
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
};

export default TaskManagerPage;

